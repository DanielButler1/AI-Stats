// lib/fetchers/api-providers/getAPIProviderHeader.ts
import { createClient } from "@/utils/supabase/client";
import { unstable_cache } from "next/cache";

export interface APIProviderHeader {
    api_provider_id: string;
    api_provider_name: string;
    country_code: string;
}

export async function fetchAPIProviderHeader(
    apiProviderId: string
): Promise<APIProviderHeader> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("data_api_providers")
        .select(
            `
            api_provider_id,
            api_provider_name,
            country_code
            `
        )
        .eq("api_provider_id", apiProviderId)
        .single();

    console.log("[fetch] HIT DB for API Provider header", apiProviderId);

    console.log("Data:", data);

    if (error) throw error;

    return {
        api_provider_id: data.api_provider_id,
        api_provider_name: data.api_provider_name,
        country_code: data.country_code,
    };
}

// --- Cached wrapper (default export) ---
// capture organisationId in both key and tags to retain the per-ID tag
export default function getAPIProviderHeader(
    apiProviderId: string
): Promise<APIProviderHeader> {
    const cached = unstable_cache(
        async (id: string) => {
            console.log("[cache] COMPUTE getAPIProviderHeader", id);
            return fetchAPIProviderHeader(id);
        },
        ["api_provider:header", apiProviderId], // per-ID cache key
        { revalidate: 60 * 60 * 24, tags: [`api_provider:header:${apiProviderId}`] } // per-ID tag
    );

    return cached(apiProviderId);
}
