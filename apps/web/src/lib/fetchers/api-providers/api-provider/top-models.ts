import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";

export type ModelStats = {
    model_id: string;
    model_name: string;
    request_count: number;
    median_latency_ms: number | null;
    median_throughput: number | null;
    total_tokens?: number | null;
};

export async function getTopModels(apiProviderId: string, count: number = 6): Promise<ModelStats[]> {
    const supabase = createAdminClient();
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    try {
        const { data, error } = await supabase
            .rpc('get_top_models_stats_tokens', {
                p_provider: apiProviderId,
                p_since: since,
                p_limit: count
            });

        if (error) {
            console.error("Error fetching top models:", error);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        return data.map((row: any) => ({
            model_id: row.model_id,
            model_name: row.model_name,
            request_count: Number(row.request_count),
            total_tokens:
                row.total_tokens != null ? Number(row.total_tokens) : null,
            median_latency_ms: row.median_latency_ms
                ? Math.round(Number(row.median_latency_ms))
                : null,
            median_throughput: row.median_throughput
                ? Math.round(Number(row.median_throughput) * 100) / 100
                : null,
        }));
    } catch (err) {
        console.error("Unexpected error fetching top models:", err);
        return [];
    }
}

export const getTopModelsCached = unstable_cache(
    async (apiProviderId: string, count: number = 6) => {
        console.log(`[fetch] HIT JSON for top models - ${apiProviderId}`);
        return await getTopModels(apiProviderId, count);
    },
    ["data:top_models:v1"],
    { revalidate: 60 * 60 * 24, tags: ["data:top_models"] }
);
