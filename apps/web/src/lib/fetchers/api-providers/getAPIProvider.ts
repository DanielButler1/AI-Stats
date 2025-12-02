// lib/fetchers/api-providers/getAPIProvider.ts
import { unstable_cache } from "next/cache";

export interface APIProvider {
    api_provider_id: string;
    api_provider_name: string;
}

import { createClient } from '@/utils/supabase/client';

export async function getAPIProvider(): Promise<APIProvider[]> {
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

export const getAPIProviderPricesCached = unstable_cache(
    async () => {
        console.log("[fetch] HIT JSON for API providers");
        return await getAPIProvider();
    },
    ["data:api_providers:v1"],
    { revalidate: 60 * 60 * 24, tags: ["data:api_providers"] }
);

// -------------------------- GET MODELS BY TYPE -------------------------- //

export interface APIProviderModels {
    model_id: string;
    model_name: string;
    provider_model_slug?: string | null;
    endpoint: string;
    is_active_gateway: boolean;
    input_modalities: string;
    output_modalities: string;
    release_date?: string | null;
}
export type ModelOutputType = 'text' | 'image' | 'video' | 'audio' | 'embeddings' | 'moderations';

/**
 * Generic function for fetching models for a provider filtered by output modality.
 * Supports: text, image, video, audio, embeddings
 */
export async function getAPIProviderModels(apiProviderId: string, outputType: ModelOutputType): Promise<APIProviderModels[]> {
    const modalityLookup: Record<ModelOutputType, string> = {
        text: 'text',
        image: 'image',
        video: 'video',
        audio: 'audio',
        // DB column likely stores singular/partial token like "embedding"
        embeddings: 'embedding',
        moderations: 'moderations'
    };

    const modality = modalityLookup[outputType];
    if (!modality) {
        throw new Error(`Unsupported output type: ${outputType}`);
    }

    const supabase = await createClient();
    const { data: modelsData, error: modelsError } = await supabase
        .from('data_api_provider_models')
        .select(`
            model_id,
            provider_model_slug,
            endpoint,
            is_active_gateway,
            input_modalities,
            output_modalities,
            data_models (name, release_date)
        `)
        .eq('api_provider_id', apiProviderId)
        .or(`output_modalities.ilike.%${modality}%`);

    if (modelsError) {
        throw modelsError;
    }

    if (!modelsData || !Array.isArray(modelsData)) return [];

    // Client-side sort: release_date desc (newest first), then model name asc
    modelsData.sort((a: any, b: any) => {
        const aDate = a.data_models?.release_date ?? null;
        const bDate = b.data_models?.release_date ?? null;

        const aTime = aDate ? new Date(aDate).getTime() : Number.NEGATIVE_INFINITY;
        const bTime = bDate ? new Date(bDate).getTime() : Number.NEGATIVE_INFINITY;

        if (aTime === bTime) {
            const aName = (a.data_models?.name ?? a.model_name ?? '').toString();
            const bName = (b.data_models?.name ?? b.model_name ?? '').toString();
            return aName.localeCompare(bName);
        }

        // Descending by date
        return bTime - aTime;
    });

    const results: APIProviderModels[] = (modelsData as any[])
        .map((r: any) => ({
            model_id: r.model_id,
            model_name: r.data_models?.name ?? r.model_name ?? '',
            provider_model_slug: r.provider_model_slug ?? null,
            endpoint: r.endpoint ?? '',
            is_active_gateway: Boolean(r.is_active_gateway),
            input_modalities: r.input_modalities ?? '',
            output_modalities: r.output_modalities ?? '',
            release_date: r.data_models?.release_date ?? null,
        }))
        .filter((m) => m.model_id);

    return results;
}

export const getAPIProviderModelsCached = unstable_cache(
    async (apiProviderId: string, outputType: ModelOutputType) => {
        console.log(`[fetch] HIT JSON for API providers - ${apiProviderId} / ${outputType}`);
        return await getAPIProviderModels(apiProviderId, outputType);
    },
    ["data:api_providers:v1"],
    { revalidate: 60 * 60 * 24, tags: ["data:api_providers"] }
);

// Backwards-compatible wrappers for previous specific functions
export async function getAPIProviderTextModels(apiProviderId: string): Promise<APIProviderModels[]> {
    return getAPIProviderModels(apiProviderId, 'text');
}

export const getAPIProviderTextModelsCached = unstable_cache(
    async (apiProviderId: string) => {
        return await getAPIProviderModelsCached(apiProviderId, 'text');
    },
    ["data:api_providers:v1"],
    { revalidate: 60 * 60 * 24, tags: ["data:api_providers"] }
);

export async function getAPIProviderImageModels(apiProviderId: string): Promise<APIProviderModels[]> {
    return getAPIProviderModels(apiProviderId, 'image');
}

export const getAPIProviderImageModelsCached = unstable_cache(
    async (apiProviderId: string) => {
        return await getAPIProviderModelsCached(apiProviderId, 'image');
    },
    ["data:api_providers:v1"],
    { revalidate: 60 * 60 * 24, tags: ["data:api_providers"] }
);
