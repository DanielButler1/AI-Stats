// lib/fetchers/landing/sign-in/getMainModels.ts
import { unstable_cache } from "next/cache";
import { createClient } from '@/utils/supabase/client';

export interface SignInModel {
    model_id: string;
    name: string;
    release_date?: string | number;
    data_organisations: { organisation_id: string; name: string; colour?: string };
}

/**
 * Fetch model records for the provided model IDs from the `data_models` table.
 * Returns a minimal ExtendedModel[] and surfaces DB errors to the caller.
 */
export async function getMainModels(modelIds: string[]): Promise<SignInModel[]> {
    if (!modelIds || modelIds.length === 0) return [];
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('data_models')
        .select('model_id, name, release_date, data_organisations (organisation_id, name, colour)')
        .in('model_id', modelIds);

    console.log('[fetch] Fetched main models', { modelIds, count: data?.length, error });

    if (error) throw error;
    if (!data || !Array.isArray(data)) return [];

    return data.map((r: any) => ({ ...r } as SignInModel));
}

export const getMainModelsCached = unstable_cache(
    async (modelIds: string[]) => {
        console.log('[fetch] HIT for main models', modelIds);
        return await getMainModels(modelIds);
    },
    ['data:sign-in:models:v1'],
    { revalidate: 60 * 60 * 24, tags: ['data:sign-in:models'] }
);
