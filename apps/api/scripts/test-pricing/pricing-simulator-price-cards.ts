import { getSupabaseAdmin } from "../../src/runtime/env";
import type { PriceCard, PriceRule } from "../../src/lib/gateway/pricing/types";
import type { Combo } from "./pricing-simulator-types";

type RawPricingRow = {
    id: string;
    model_key: string;
    pricing_plan?: string | null;
    meter: string;
    unit?: string | null;
    unit_size?: number | null;
    price_per_unit?: string | number | null;
    currency?: string | null;
    tiering_mode?: string | null;
    match?: unknown;
    priority?: number | null;
    effective_from: string;
    effective_to?: string | null;
    updated_at: string;
};

const KEY_SEPARATOR = ":";

export function makeComboKey(combo: Combo): string {
    return [combo.provider, combo.model, combo.endpoint].join(KEY_SEPARATOR);
}

function parseComboKey(key: string): { provider: string; model: string; endpoint: string } {
    const [provider = "", model = "", endpoint = ""] = key.split(KEY_SEPARATOR);
    return { provider, model, endpoint };
}

function rowsToPriceCard(key: string, rows: RawPricingRow[]): PriceCard | null {
    if (!rows.length) return null;

    const rules: PriceRule[] = rows.map((row) => ({
        id: row.id,
        pricing_plan: row.pricing_plan ?? "standard",
        meter: row.meter,
        unit: row.unit ?? "unit",
        unit_size: Number(row.unit_size ?? 1),
        price_per_unit: row.price_per_unit === null || row.price_per_unit === undefined ? "0" : String(row.price_per_unit),
        currency: row.currency ?? "USD",
        tiering_mode: row.tiering_mode ?? null,
        match: Array.isArray(row.match) ? row.match : [],
        priority: Number(row.priority ?? 100),
    }));

    const version = new Date(Math.max(...rows.map((row) => new Date(row.updated_at).getTime()))).toISOString();
    const effectiveFrom = new Date(Math.min(...rows.map((row) => new Date(row.effective_from).getTime()))).toISOString();
    const effToCandidates = rows.map((row) => row.effective_to).filter(Boolean) as string[];
    const effectiveTo = effToCandidates.length
        ? new Date(Math.min(...effToCandidates.map((value) => new Date(value).getTime()))).toISOString()
        : null;

    const meta = parseComboKey(key);
    return {
        provider: meta.provider,
        model: meta.model,
        endpoint: meta.endpoint,
        effective_from: effectiveFrom,
        effective_to: effectiveTo,
        currency: "USD",
        version,
        rules,
    };
}

export async function loadPriceCardsForCombos(combos: Combo[]): Promise<Map<string, PriceCard>> {
    const keys = Array.from(new Set(combos.map(makeComboKey)));
    const cards = new Map<string, PriceCard>();
    if (!keys.length) return cards;

    const supabase = getSupabaseAdmin();
    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
        .from("data_api_pricing_rules")
        .select(
            "id, model_key, pricing_plan, meter, unit, unit_size, price_per_unit, currency, tiering_mode, note, match, priority, effective_from, effective_to, updated_at",
        )
        .in("model_key", keys)
        .lte("effective_from", nowIso)
        .or(`effective_to.is.null,effective_to.gt.${nowIso}`)
        .order("priority", { ascending: false })
        .order("effective_from", { ascending: false });

    if (error) {
        throw new Error(`Failed to load price cards: ${error.message}`);
    }

    const grouped = new Map<string, RawPricingRow[]>();
    for (const row of (data ?? []) as RawPricingRow[]) {
        if (!row?.model_key) continue;
        if (!grouped.has(row.model_key)) grouped.set(row.model_key, []);
        grouped.get(row.model_key)!.push(row);
    }

    for (const key of keys) {
        const rows = grouped.get(key);
        if (!rows?.length) continue;
        const card = rowsToPriceCard(key, rows);
        if (card) cards.set(key, card);
    }

    return cards;
}
