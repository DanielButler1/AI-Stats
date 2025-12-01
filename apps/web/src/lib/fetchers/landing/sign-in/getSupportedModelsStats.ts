import { unstable_cache } from 'next/cache';
import { createClient } from '@/utils/supabase/client';

export interface SupportedModelsStats {
    modelsCount: number;
    orgsCount: number;
    apiCount: number;
    recentCount: number;
}

async function fetchStats(): Promise<SupportedModelsStats> {
    const supabase = await createClient();

    const now = Date.now();
    const cutoff = new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString();

    const defaultStats: SupportedModelsStats = {
        modelsCount: 0,
        orgsCount: 0,
        apiCount: 0,
        recentCount: 0,
    };

    try {
        const [modelsRes, orgsRes, apiModelsRes, recentRes] = await Promise.all([
            supabase.from('data_models').select('*', { count: 'exact', head: true }),
            supabase.from('data_organisations').select('*', { count: 'exact', head: true }),
            supabase
                .from('data_api_provider_models')
                .select('*', { count: 'exact', head: true })
                .eq('is_active_gateway', true),
            supabase
                .from('data_models')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', cutoff),
        ]);

        const getCount = (res: { count: number | null; error: any } | any) => {
            if (res?.error) return 0;
            return res.count ?? 0;
        };

        return {
            modelsCount: getCount(modelsRes),
            orgsCount: getCount(orgsRes),
            apiCount: getCount(apiModelsRes),
            recentCount: getCount(recentRes),
        };
    } catch (err) {
        // swallow and return defaults; caller will handle fallback behaviour
        // Consider telemetry here
        return defaultStats;
    }
}

export const getSupportedModelsStatsCached = unstable_cache(
    async () => {
        console.log('[fetch] HIT for supported models stats');
        return await fetchStats();
    },
    ['data:sign-in:supported-models-stats:v1'],
    { revalidate: 60 * 60 * 24, tags: ['data:sign-in:supported-models-stats'] }
);
