// lib/fetchers/models/getModel.ts
import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@/utils/supabase/client";

export interface ModelPage {
    model_id: string;
    name: string;
    organisation_id: string;
    status?: string | null;
    previous_model_id?: string | null;
    announcement_date?: string | null;
    release_date?: string | null;
    deprecation_date?: string | null;
    retirement_date?: string | null;
    license?: string | null;
    input_types?: string | null;
    output_types?: string | null;
    family_id?: string | null;
    timeline?: any;
    updated_at?: string | null;
    organisation: { name: string, country_code?: string | null };
    model_links: { url: string; platform: string }[];
    model_family?: { display_name: string } | null;
    model_details: { detail_name: string; detail_value: string | number | null }[];
    pricing?: PricingRule[];
    benchmark_results: {
        id: number;
        score: string | number;
        is_self_reported: boolean;
        other_info: string | null;
        source_link: string | null;
        created_at: string;
        updated_at: string;
        benchmark: {
            id: number;
            name: string;
            category: string | null;
            ascending_order: boolean;
            link: string | null;
        };
    }[];
}

export interface PricingRule {
    uuid: string;
    rule_id?: string | null;
    provider_id: string;
    model_id: string;
    endpoint: string;
    meter: string;
    unit_size: number;
    price_usd_per_unit: string | number;
    bill_mode: string;
    bill_from_exclusive?: number | null;
    bill_to_inclusive?: number | null;
    bill_source?: string | null;
    priority: number;
    effective_from: string;
    effective_to?: string | null;
    conditions: any;
}

export default async function getModel(modelId: string): Promise<ModelPage> {
    const supabase = await createClient(); // must allow read via RLS for these tables

    console.log("[getModel] Fetching model", modelId);
    const { data: models, error } = await supabase.from("data_models").select(`
        model_id,
        name,
        status,
        previous_model_id,
        organisation_id,
        announcement_date,
        release_date,
        deprecation_date,
        retirement_date,
        license,
        input_types,
        output_types,
        family_id,
        timeline,
        updated_at,
        organisation: data_organisations!data_models_organisation_id_fkey(name, country_code),
        model_links: data_model_links(url, platform),
        model_family: data_model_families(family_name),
        model_details: data_model_details(detail_name, detail_value),
        benchmark_results: data_benchmark_results (
            id,
            score,
            is_self_reported,
            other_info,
            source_link,
            created_at,
            updated_at,
            benchmark:data_benchmarks (
                id,
                name,
                category,
                ascending_order,
                link
            )
        )
    `).eq("model_id", modelId);

    if (error) {
        console.error("[getModel] Supabase error", { modelId, error });
        throw new Error(error.message || "Failed to fetch models");
    }

    const model = models[0] as unknown as ModelPage;
    console.log("[getModel] Raw row", {
        modelId,
        rows: models?.length ?? 0,
        hasBenchmarks: !!model?.benchmark_results?.length,
        hasDetails: !!model?.model_details?.length,
    });

    // Ensure model_details exists and, if a license was returned, move it into model_details
    if (model) {
        if (!model.model_details) {
            model.model_details = [];
        }

        // If a license was provided at top-level, add it to model_details and clear the top-level field
        if (model.license) {
            model.model_details.push({ detail_name: "license", detail_value: model.license });
            // Clear top-level license to avoid duplication; keep the shape consistent with ModelPage
            model.license = null;
        }
    }

    // Fetch pricing rules for this model_id and attach to the response
    try {
        const { data: pricing, error: pricingError } = await supabase
            .from("data_api_pricing_rules")
            .select(`
                uuid,
                rule_id,
                provider_id,
                model_id,
                endpoint,
                meter,
                unit_size,
                price_usd_per_unit,
                bill_mode,
                bill_from_exclusive,
                bill_to_inclusive,
                bill_source,
                priority,
                effective_from,
                effective_to,
                conditions
            `)
            .eq("model_id", modelId)
            .order("priority", { ascending: true })
            .order("effective_from", { ascending: false });

        if (pricingError) {
            console.warn(
                "[getModel] Failed to fetch pricing rules",
                modelId,
                pricingError.message
            );
        } else {
            console.log("[getModel] Pricing rows", {
                modelId,
                count: pricing?.length ?? 0,
            });
            model.pricing = pricing as unknown as PricingRule[];
        }
    } catch (err) {
        console.warn(
            "[getModel] Pricing lookup threw, continuing without pricing",
            modelId,
            err
        );
    }

    return model;
}

type ModelStatus = "Rumoured" | "Announced" | "Available" | "Deprecated" | "Retired" | null;

export interface ModelOverviewPage {
    model_id: string;
    name: string;
    organisation_id: string;
    status: ModelStatus;
    announcement_date?: string | null;
    release_date?: string | null;
    deprecation_date?: string | null;
    retirement_date?: string | null;
    license?: string | null;
    input_types?: string | null;
    output_types?: string | null;
    family_id?: string | null;
    updated_at?: string | null;
    organisation: { name: string, country_code?: string | null };
    model_links: { url: string; platform: string }[];
    model_family?: { display_name: string } | null;
    model_details: { detail_name: string; detail_value: string | number | null }[];
    pricing?: PricingRule[];
}

export async function getModelOverview(modelId: string): Promise<ModelOverviewPage | null> {
    const supabase = await createClient();

    const { data: models, error } = await supabase.from("data_models").select(`
        model_id,
        name,
        status,
        organisation_id,
        announcement_date,
        release_date,
        deprecation_date,
        retirement_date,
        license,
        input_types,
        output_types,
        family_id,
        updated_at,
        organisation: data_organisations!data_models_organisation_id_fkey(name, country_code),
        model_links: data_model_links(url, platform),
        model_family: data_model_families(family_name),
        model_details: data_model_details(detail_name, detail_value)
    `).eq("model_id", modelId);

    if (error) {
        throw new Error(error.message || "Failed to fetch models");
    }

    // Move license into model_details if present
    if (models && models.length > 0) {
        const model = models[0] as unknown as ModelOverviewPage;
        if (!model.model_details) {
            model.model_details = [];
        }
        if (model.license) {
            model.model_details.push({ detail_name: "license", detail_value: model.license });
            model.license = null;
        }
        return model;
    }

    return models[0] as unknown as ModelOverviewPage;
}

/**
 * Cached version of getModel.
 *
 * Usage: await getModelCached(modelId)
 *
 * Uses `use cache` with a ~1-day-ish lifetime and tagging.
 */
export async function getModelCached(modelId: string): Promise<ModelPage> {
    "use cache";

    // Rough equivalent of "revalidate: 1 day".
    // You can tune this or move to a named profile later.
    cacheLife("days");

    cacheTag("data:models");
    cacheTag(`data:models:${modelId}`);

    console.log("[getModelCached] Cache-aware fetch for model", modelId);
    return getModel(modelId);
}

/**
 * Cached version of getModelOverview.
 *
 * Usage: await getModelOverviewCached(modelId)
 *
 * Uses `use cache` with a ~1-day-ish lifetime and tagging.
 */
export async function getModelOverviewCached(
    modelId: string,
): Promise<ModelOverviewPage | null> {
    "use cache";

    cacheLife({
        stale: 60 * 60,
        revalidate: 60 * 60 * 24,
        expire: 60 * 60 * 24 * 7,
    });

    cacheTag("data:models");
    cacheTag(`data:models:${modelId}`);

    console.log("[getModelOverviewCached] Cache-aware fetch for model overview", modelId);
    return getModelOverview(modelId);
}
