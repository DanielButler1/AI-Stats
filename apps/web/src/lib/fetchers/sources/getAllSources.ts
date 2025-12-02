// lib/fetchers/sources/getAllSources.ts
import { unstable_cache } from "next/cache";

export interface SourceCard {
    api_provider_id: string;
    api_provider_name: string;
    country_code: string;
}

import { createClient } from '@/utils/supabase/client';

export async function getAllSources(): Promise<SourceCard[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('data_api_providers')
        .select('api_provider_id, api_provider_name, country_code')
        .order('api_provider_name', { ascending: true });

    if (error) {
        throw error;
    }

    if (!data || !Array.isArray(data)) return [];

    return data
        .map((r: any) => ({
            api_provider_id: r.api_provider_id,
            api_provider_name: r.api_provider_name ?? r.name ?? '',
            country_code: r.country_code ?? null,
        }))
        .filter((p) => p.api_provider_id);
}

export const getAllSourcesCached = unstable_cache(
    async () => {
        console.log("[fetch] HIT DB for sources");
        return await getAllSources();
    },
    ["data:sources:v1"],
    { revalidate: 60 * 60 * 24, tags: ["data:sources"] }
);