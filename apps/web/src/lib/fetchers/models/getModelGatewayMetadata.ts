import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@/utils/supabase/client";

export interface GatewayProviderDetails {
    api_provider_id: string;
    api_provider_name: string;
    link?: string | null;
    country_code?: string | null;
}

export interface GatewayProviderModel {
    id: string;
    api_provider_id: string;
    provider_model_slug?: string | null;
    model_id: string;
    endpoint: string;
    is_active_gateway: boolean;
    input_modalities: string;
    output_modalities: string;
    effective_from?: string | null;
    effective_to?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    provider?: GatewayProviderDetails | null;
}

export interface ModelGatewayMetadata {
    modelId: string;
    aliases: string[];
    providers: GatewayProviderModel[];
    activeProviders: GatewayProviderModel[];
    inactiveProviders: GatewayProviderModel[];
}

function isWithinEffectiveWindow(
    effectiveFrom?: string | null,
    effectiveTo?: string | null,
    now: Date = new Date()
): boolean {
    const from = effectiveFrom ? new Date(effectiveFrom) : null;
    const to = effectiveTo ? new Date(effectiveTo) : null;

    if (from && Number.isFinite(from.getTime()) && now < from) {
        return false;
    }

    if (to && Number.isFinite(to.getTime()) && now >= to) {
        return false;
    }

    return true;
}

export default async function getModelGatewayMetadata(
    modelId: string
): Promise<ModelGatewayMetadata> {
    const supabase = await createClient();

    const [providersResponse, aliasesResponse] = await Promise.all([
        supabase
            .from("data_api_provider_models")
            .select(`
                id,
                api_provider_id,
                provider_model_slug,
                model_id,
                endpoint,
                is_active_gateway,
                input_modalities,
                output_modalities,
                effective_from,
                effective_to,
                created_at,
                updated_at,
                provider:data_api_providers!data_api_provider_models_api_provider_id_fkey(
                    api_provider_id, api_provider_name, link, country_code
                )
            `)
            .eq("model_id", modelId),
        supabase
            .from("data_aliases")
            .select("alias_slug")
            .eq("resolved_model_id", modelId)
            .eq("is_enabled", true)
            .order("alias_slug", { ascending: true }),
    ]);

    if (providersResponse.error) {
        throw new Error(
            providersResponse.error.message ?? "Failed to load gateway providers"
        );
    }

    if (aliasesResponse.error) {
        throw new Error(
            aliasesResponse.error.message ?? "Failed to load model aliases"
        );
    }

    // Supabase returns related rows as arrays. Map `provider` arrays to single objects
    const rawProviders = (providersResponse.data ?? []) as any[];
    const providers: GatewayProviderModel[] =
        (providersResponse.data ?? []).map((p: any) => ({
            id: p.id,
            api_provider_id: p.api_provider_id,
            provider_model_slug: p.provider_model_slug,
            model_id: p.model_id,
            endpoint: p.endpoint,
            is_active_gateway: p.is_active_gateway,
            input_modalities: p.input_modalities,
            output_modalities: p.output_modalities,
            effective_from: p.effective_from,
            effective_to: p.effective_to,
            created_at: p.created_at,
            updated_at: p.updated_at,
            provider: p.provider
                ? {
                    api_provider_id: p.provider.api_provider_id,
                    api_provider_name: p.provider.api_provider_name,
                    link: p.provider.link ?? null,
                    country_code: p.provider.country_code ?? null,
                }
                : null,
        }));
    const aliasRows = (aliasesResponse.data ?? []) as { alias_slug: string }[];
    const aliases = aliasRows.map((alias) => alias.alias_slug);

    const now = new Date();

    const activeProviders = providers.filter(
        (provider) =>
            provider.is_active_gateway &&
            isWithinEffectiveWindow(
                provider.effective_from,
                provider.effective_to,
                now
            )
    );

    const inactiveProviders = providers.filter(
        (provider) =>
            !provider.is_active_gateway ||
            !isWithinEffectiveWindow(
                provider.effective_from,
                provider.effective_to,
                now
            )
    );

    return {
        modelId,
        aliases,
        providers,
        activeProviders,
        inactiveProviders,
    };
}

/**
 * Cached version of getModelGatewayMetadata.
 *
 * Usage: await getModelGatewayMetadataCached(modelId)
 *
 * This wraps the fetcher with `unstable_cache` for at least 1 week of caching.
 */
export async function getModelGatewayMetadataCached(modelId: string): Promise<ModelGatewayMetadata> {
    "use cache";

    cacheLife("days");
    cacheTag("data:models");
    cacheTag(`data:models:${modelId}`);
    cacheTag("data:api_provider_models");
    cacheTag("data:model_aliases");

    console.log("[fetch] HIT DB for model gateway metadata", modelId);
    return getModelGatewayMetadata(modelId);
}
