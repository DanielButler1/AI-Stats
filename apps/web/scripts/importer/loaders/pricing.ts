import { join, basename } from "path";
import { DIR_PRICING } from "../paths";
import { listDirs, readJson, chunk, toInList } from "../util";
import { client, isDryRun, logWrite, assertOk, pruneRowsByColumn } from "../supa";
import { createHash } from "crypto";

function toFixed10(n: number) {
    // match numeric(20,10) for pricing rules storage
    return Number(n).toFixed(10);
}

function deepSortObjectKeys(x: any): any {
    if (Array.isArray(x)) {
        // preserve array order (priority often matters)
        return x.map(deepSortObjectKeys);
    }
    if (x && typeof x === "object") {
        const out: any = {};
        Object.keys(x).sort().forEach(k => { out[k] = deepSortObjectKeys(x[k]); });
        return out;
    }
    return x;
}

function digestRule(r: any) {
    // Create a stable digest for a rule using canonical fields
    const payload = {
        unit_size: r.unit_size ?? 1,
        price: toFixed10((r.price_per_unit ?? r.price_usd_per_unit ?? 0) as number),
        pricing_plan: r.pricing_plan ?? r.pricingPlan ?? null,
        tiering_mode: r.tiering_mode ?? r.tieringMode ?? null,
        note: r.note ?? null,
        conditions: deepSortObjectKeys(r.match ?? []),
    };
    return createHash("md5").update(JSON.stringify(payload)).digest("hex");
}

const norm = (arr?: string[]) => (arr && arr.length ? arr.join(",") : "");

type PricingJSON = {
    key: string;                      // provider:model:endpoint (not required by loader)
    api_provider_id: string;          // NOTE: matches provider_models column
    provider_slug: string;            // not stored
    model_id: string;
    endpoint: string;
    provider_model_slug?: string | null;
    is_active_gateway: boolean;
    input_modalities?: string[];
    output_modalities?: string[];
    effective_from?: string | null;
    effective_to?: string | null;
    capability?: Record<string, unknown>;
    params?: any[];
    rules?: Array<{
        meter: string;
        unit?: string;
        unit_size?: number;
        price_per_unit?: number;
        price_usd_per_unit?: number;
        currency?: string;
        tiering_mode?: string;
        pricing_plan: string;
        note?: string | null;
        match?: PricingMatch[];             // conditions
        priority?: number;
    }>;
};

type PricingMatch = {
    path: string;
    op: string;
    or_group?: number;
    and_index?: number;
    value: string | number | Array<any>;
}

export async function loadPricing() {
    const supa = client();
    const providerModelIds = new Set<string>();
    const pricingRuleKeys = new Set<string>();

    const providerDirs = await listDirs(DIR_PRICING);

    for (const provPath of providerDirs) {
        const api_provider_id = basename(provPath);
        const endpointDirs = await listDirs(provPath);
        for (const epPath of endpointDirs) {
            const endpoint = basename(epPath);
            const modelDirs = await listDirs(epPath);

            // Accumulate desired rows for this (provider, endpoint) scope
            // Now matches table: key (PK), api_provider_id, provider_slug, model_id, endpoint,
            // provider_model_slug, is_active_gateway, input_modalities (text[]), output_modalities (text[]),
            // effective_from, effective_to, capability (jsonb), params (jsonb)
            const desiredProviderModels: Array<{
                id?: string;
                api_provider_id: string;
                model_id: string;
                provider_model_slug: string | null;
                endpoint: string;
                is_active_gateway: boolean;
                input_modalities: string;
                output_modalities: string;
                effective_from: string | null;
                effective_to: string | null;
                params: unknown[];
            }> = [];

            const desiredRules: Array<{
                model_key: string;
                pricing_plan: string;
                meter: string;
                unit: string;
                unit_size: number;
                price_per_unit: string; // stored as numeric(20,10) string
                currency: string;
                tiering_mode: string | null;
                note: string | null;
                match: unknown[];
                priority: number;
            }> = [];

            for (const mPath of modelDirs) {
                const j = await readJson<PricingJSON>(join(mPath, "pricing.json"));

                const provider_model_slug = (j.provider_model_slug ?? j.model_id ?? null);
                const computedKey = j.key && j.key.trim() ? j.key : `${j.api_provider_id}:${j.model_id}:${j.endpoint}`;
                const id = computedKey; // table requires an `id` primary key; use composed key

                providerModelIds.add(id);

                desiredProviderModels.push({
                    id,
                    api_provider_id: j.api_provider_id,
                    model_id: j.model_id,
                    provider_model_slug,
                    endpoint: j.endpoint,
                    is_active_gateway: !!j.is_active_gateway,
                    input_modalities: norm(j.input_modalities),
                    output_modalities: norm(j.output_modalities),
                    effective_from: j.effective_from ?? null,
                    effective_to: j.effective_to ?? null,
                    params: j.params ?? [],
                });

                // Per-file duplicate handling (exact dupes get :occur suffix; near-dupes differ by hash)
                const ruleRows = j.rules || [];
                if (ruleRows.length) {
                    pricingRuleKeys.add(computedKey);
                }

                const seenBuckets = new Map<string, number>(); // key: provider|model|ep|meter|prio|digest

                for (const r of ruleRows) {
                    const prio = r.priority ?? 100;
                    const digest = digestRule(r);
                    const bucket = `${j.api_provider_id}|${j.model_id}|${j.endpoint}|${r.meter}|${prio}|${digest}`;
                    const occur = (seenBuckets.get(bucket) ?? 0) + 1;
                    seenBuckets.set(bucket, occur);

                    // Construct a stable rule identifier (used for logging/debugging)
                    const rule_id_base = `${j.api_provider_id}:${j.model_id}:${j.endpoint}:${r.meter}:${prio}:${digest}`;
                    const rule_id = rule_id_base + (occur > 1 ? `:${occur}` : "");

                    // Map incoming fields to the DB schema
                    const pricing_plan = r.pricing_plan;
                    const unit = r.unit ?? "token";
                    const price_val = (r.price_per_unit ?? r.price_usd_per_unit ?? 0) as number;

                    desiredRules.push({
                        model_key: computedKey,
                        pricing_plan,
                        meter: r.meter,
                        unit: unit,
                        unit_size: r.unit_size ?? 1,
                        price_per_unit: toFixed10(price_val),
                        currency: r.currency ?? "USD",
                        tiering_mode: r.tiering_mode ?? null,
                        note: r.note ?? null,
                        match: r.match ?? [],
                        priority: prio,
                    });
                }
            }

            // ---- UPSERT provider_models in batches; now using `key` as PK; prune by (provider, endpoint) & key ----
            if (isDryRun()) {
                for (const r of desiredProviderModels) {
                    logWrite("public.data_api_provider_models", "UPSERT", r, {
                        onConflict: "api_provider_id,endpoint,model_id",
                    });
                }
            } else {
                for (const group of chunk(desiredProviderModels, 500)) {
                    assertOk(
                        await supa
                            .from("data_api_provider_models")
                            .upsert(group, { onConflict: "api_provider_id,endpoint,model_id" }),
                        "upsert data_api_provider_models"
                    );
                }

                const keepModelIds = [...new Set(desiredProviderModels.map(r => r.model_id))];

                if (keepModelIds.length) {
                    assertOk(
                        await supa
                            .from("data_api_provider_models")
                            .delete()
                            .eq("api_provider_id", api_provider_id)
                            .eq("endpoint", endpoint)
                            .not("model_id", "in", toInList(keepModelIds)),
                        "prune data_api_provider_models"
                    );
                } else {
                    assertOk(
                        await supa
                            .from("data_api_provider_models")
                            .delete()
                            .eq("api_provider_id", api_provider_id)
                            .eq("endpoint", endpoint),
                        "prune-all data_api_provider_models"
                    );
                }
            }

            // ---- INSERT pricing_rules; prune by model_key under the same scope ----
            if (isDryRun()) {
                for (const r of desiredRules) {
                    logWrite("public.data_api_pricing_rules", "INSERT", r, { onConflict: null });
                }
            } else {
                // Delete existing rules for the provider+endpoint scope by joining via model_key
                // We'll collect all model_keys we care about and delete rules whose model_key is
                // linked to models under this provider+endpoint.

                const keepModelKeys = [...new Set(desiredProviderModels.map(m => `${m.api_provider_id}:${m.model_id}:${m.endpoint}`))];

                if (keepModelKeys.length) {
                    // Delete rules where model_key is in the set of models for this provider+endpoint
                    assertOk(
                        await supa
                            .from("data_api_pricing_rules")
                            .delete()
                            .in("model_key", keepModelKeys),
                        "prune data_api_pricing_rules"
                    );
                } else {
                    // If no models, delete all rules for provider by matching model keys that start with provider id prefix
                    // This is a conservative fallback: delete where model_key LIKE 'provider:%'
                    assertOk(
                        await supa
                            .from("data_api_pricing_rules")
                            .delete()
                            .like("model_key", `${api_provider_id}:%`),
                        "prune-all data_api_pricing_rules"
                    );
                }

                // Insert new rules in chunks
                for (const group of chunk(desiredRules, 500)) {
                    assertOk(
                        await supa
                            .from("data_api_pricing_rules")
                            .insert(group),
                        "insert data_api_pricing_rules"
                    );
                }
            }
        }
    }

    await pruneRowsByColumn(
        supa,
        "data_api_provider_models",
        "id",
        providerModelIds,
        "data_api_provider_models"
    );
    await pruneRowsByColumn(
        supa,
        "data_api_pricing_rules",
        "model_key",
        pricingRuleKeys,
        "data_api_pricing_rules"
    );
}
