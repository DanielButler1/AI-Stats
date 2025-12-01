import type { CLIOptions, Combo } from "./pricing-simulator-types";
import { getSupabaseAdmin } from "../src/runtime/env";

export async function loadCombos(options: CLIOptions): Promise<Combo[]> {
    const supabase = getSupabaseAdmin();
    const nowIso = new Date().toISOString();

    let query = supabase
        .from("data_api_provider_models")
        .select("api_provider_id, model_id, endpoint, is_active_gateway, effective_from, effective_to");

    if (options.provider?.length) query = query.in("api_provider_id", options.provider);
    if (options.model?.length) query = query.in("model_id", options.model);
    if (options.endpoint) query = query.eq("endpoint", options.endpoint);

    const { data, error } = await query;
    if (error) {
        throw new Error(`Failed to load provider models: ${error.message}`);
    }

    const rows = (data ?? []).filter((row: any) => {
        if (options.includeInactive) return true;
        if (row.is_active_gateway !== true) return false;

        const from = row.effective_from ? new Date(row.effective_from).toISOString() : null;
        const to = row.effective_to ? new Date(row.effective_to).toISOString() : null;
        if (from && from > nowIso) return false;
        if (to && to <= nowIso) return false;
        return true;
    });

    const uniqueKeys = new Set<string>();
    const combos: Combo[] = [];

    for (const row of rows as any[]) {
        const key = `${row.api_provider_id}:${row.model_id}:${row.endpoint}`;
        if (uniqueKeys.has(key)) continue;
        uniqueKeys.add(key);
        combos.push({
            provider: row.api_provider_id,
            model: row.model_id,
            endpoint: row.endpoint,
        });
    }

    return combos;
}