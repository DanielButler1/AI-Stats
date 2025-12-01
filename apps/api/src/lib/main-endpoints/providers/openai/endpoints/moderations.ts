// lib/gateway/providers/openai/endpoints/moderations.ts
import type { ProviderExecuteArgs, AdapterResult } from "../../types";
import { ModerationsSchema, type ModerationsRequest } from "../../../../schemas";
import { sanitizePayload } from "../../utils";
import { getBindings } from "@/runtime/env";
import { loadByokKey } from "../../byok";
import { computeBill } from "../../../pricing/engine";

const BASE_URL = "https://api.openai.com";

type ResolvedKey = {
    key: string;
    source: "gateway" | "byok";
    byokId: string | null;
};

async function resolveApiKey(args: ProviderExecuteArgs): Promise<ResolvedKey> {
    const byok = await loadByokKey({
        teamId: args.teamId,
        providerId: args.providerId,
        metaList: args.byokMeta,
    });
    if (byok) {
        return { key: byok.key, source: "byok", byokId: byok.keyId };
    }
    const fallback = getBindings().OPENAI_API_KEY;
    if (!fallback) throw new Error("openai_key_missing");
    return { key: fallback, source: "gateway", byokId: null };
}

function baseHeaders(key: string) {
    return {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
    };
}

function mapGatewayToOpenAIModerations(body: ModerationsRequest) {
    return {
        input: body.input,
        model: body.model,
        // meta is only for gateway response shaping; not forwarded upstream
    };
}

type ModerationContext = {
    requestId?: string | null;
    providerId: string;
    model: string;
    generationMs: number | null;
    latencyMs: number | null;
};

function mapOpenAIToGatewayModerations(json: any, ctx: ModerationContext): any {
    const primary = Array.isArray(json?.results) ? json.results[0] : null;
    const categories = primary?.categories ?? {};
    const scores = primary?.category_scores ?? {};
    const appliedTypes = primary?.category_applied_input_types ?? {};
    const categoryKeys = new Set<string>([
        ...Object.keys(categories),
        ...Object.keys(scores),
        ...Object.keys(appliedTypes),
    ]);

    const combinedCategories = Object.fromEntries(
        Array.from(categoryKeys).map((name) => [
            name,
            {
                flagged: Boolean(categories?.[name]),
                score: typeof scores?.[name] === "number" ? scores[name] : null,
                input_types: appliedTypes?.[name] ?? null,
            },
        ])
    );

    return {
        requestId: ctx.requestId ?? json.id ?? null,
        created: Math.floor(Date.now() / 1000),
        model: ctx.model ?? json.model,
        provider: ctx.providerId,
        meta: {
            generation_ms: ctx.generationMs,
            latency_ms: ctx.latencyMs,
        },
        results: {
            flagged: Boolean(primary?.flagged),
            categories: combinedCategories,
        },
    };
}

export async function exec(args: ProviderExecuteArgs): Promise<AdapterResult> {
    const keyInfo = await resolveApiKey(args);
    const key = keyInfo.key;
    const sanitizedBody = sanitizePayload(ModerationsSchema, args.body);
    const modifiedBody: ModerationsRequest = {
        ...sanitizedBody,
        model: args.providerModelSlug || args.model,
    };
    const req = mapGatewayToOpenAIModerations(modifiedBody);
    const startedAt = Date.now();
    const res = await fetch(`${BASE_URL}/v1/moderations`, {
        method: "POST",
        headers: baseHeaders(key),
        body: JSON.stringify(req),
    });
    const latencyMs = Date.now() - startedAt;
    const generationHeader = res.headers.get("openai-processing-ms");
    const generationMs = Number.isFinite(Number(generationHeader)) ? Number(generationHeader) : latencyMs;
    const bill = {
        cost_cents: 0,
        currency: "USD" as const,
        usage: undefined as any,
        upstream_id: res.headers.get("x-request-id"),
        finish_reason: null,
    };
    const json = await res.clone().json().catch(() => null);
    const normalized = json
        ? mapOpenAIToGatewayModerations(json, {
            requestId: args.meta.requestId,
            providerId: args.providerId,
            model: args.model,
            generationMs: generationMs ?? null,
            latencyMs: latencyMs ?? null,
        })
        : undefined;
    
    // Calculate pricing
    if (normalized?.usage) {
        const pricedUsage = computeBill(normalized.usage, args.pricingCard);
        bill.cost_cents = pricedUsage.pricing.total_cents;
        bill.currency = pricedUsage.pricing.currency;
        bill.usage = pricedUsage;
    }
    
    return { kind: "completed", upstream: res, bill, normalized, keySource: keyInfo.source, byokKeyId: keyInfo.byokId };
}
