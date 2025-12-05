import type { SupabaseClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@/utils/supabase/client";

type ActiveGatewayModelRow = {
    model_id: string | null;
    api_provider_id: string | null;
    effective_from?: string | null;
    effective_to?: string | null;
};

export type GatewaySupportedModel = {
    modelId: string;
    providerId: string;
};

async function fetchActiveGatewayModels(
    client: SupabaseClient,
    now = new Date()
): Promise<ActiveGatewayModelRow[]> {
    const nowIso = now.toISOString();
    const effectiveClause = [
        "and(effective_from.is.null,effective_to.is.null)",
        `and(effective_from.is.null,effective_to.gt.${nowIso})`,
        `and(effective_from.lte.${nowIso},effective_to.is.null)`,
        `and(effective_from.lte.${nowIso},effective_to.gt.${nowIso})`,
    ].join(",");

    const { data, error } = await client
        .from("data_api_provider_models")
        .select("model_id, api_provider_id, effective_from, effective_to")
        .eq("is_active_gateway", true)
        .or(effectiveClause);

    if (error) {
        throw new Error(error.message ?? "Failed to load supported models");
    }

    return (data ?? []) as ActiveGatewayModelRow[];
}

export async function getGatewaySupportedModels(): Promise<GatewaySupportedModel[]> {
    "use cache";

    cacheLife("days");
    cacheTag("gateway-supported-models");

    const client = await createClient();
    const rows = await fetchActiveGatewayModels(client, new Date());
    const seen = new Set<string>();
    const models: GatewaySupportedModel[] = [];

    for (const row of rows) {
        if (!row.model_id || !row.api_provider_id) continue;
        const key = `${row.api_provider_id}:${row.model_id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        models.push({
            modelId: row.model_id,
            providerId: row.api_provider_id,
        });
    }

    models.sort((a, b) => {
        if (a.providerId === b.providerId) {
            return a.modelId.localeCompare(b.modelId);
        }
        return a.providerId.localeCompare(b.providerId);
    });

    return models;
}
