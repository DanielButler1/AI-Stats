import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type SearchResultType = "model" | "organisation" | "benchmark" | "api-provider" | "plan" | "country";

interface SearchResult {
    id: string;
    title: string;
    subtitle?: string | null;
    href: string;
    icon: SearchResultType;
    logoId?: string;
}

interface SearchGroup {
    type: SearchResultType;
    label: string;
    items: SearchResult[];
}

interface SearchResponse {
    groups: SearchGroup[];
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
        return NextResponse.json({ groups: [] });
    }

    try {
        const supabase = await createClient();

        // Search models
        const { data: modelsData, error: modelsError } = await supabase
            .from("data_models")
            .select(`
                model_id,
                name,
                organisation: data_organisations (organisation_id, name)
            `)
            .ilike("name", `%${query}%`)
            .order("release_date", { ascending: false, nullsFirst: false })
            .limit(9);

        if (modelsError) {
            console.error("Models search error:", modelsError);
        }

        // Search organisations
        const { data: orgsData, error: orgsError } = await supabase
            .from("data_organisations")
            .select("organisation_id, name, description")
            .ilike("name", `%${query}%`)
            .limit(9);

        if (orgsError) {
            console.error("Organisations search error:", orgsError);
        }

        // Search benchmarks
        const { data: benchmarksData, error: benchmarksError } = await supabase
            .from("data_benchmarks")
            .select("id, name")
            .ilike("name", `%${query}%`)
            .limit(9);

        if (benchmarksError) {
            console.error("Benchmarks search error:", benchmarksError);
        }

        // Search API providers
        const { data: providersData, error: providersError } = await supabase
            .from("data_api_providers")
            .select("api_provider_id, api_provider_name, description")
            .ilike("api_provider_name", `%${query}%`)
            .limit(9);

        if (providersError) {
            console.error("API providers search error:", providersError);
        }

        // Search subscription plans
        const { data: plansData, error: plansError } = await supabase
            .from("data_subscription_plans")
            .select(`
                plan_id,
                name,
                organisation_id,
                data_organisations!inner (
                    organisation_id,
                    name
                )
            `)
            .ilike("name", `%${query}%`)
            .limit(9);

        if (plansError) {
            console.error("Subscription plans search error:", plansError);
        }

        // Search countries (hardcoded list)
        const countries = [
            { id: "us", name: "United States", flagIso: "us" },
            { id: "cn", name: "China", flagIso: "cn" },
            { id: "fr", name: "France", flagIso: "fr" },
            { id: "ca", name: "Canada", flagIso: "ca" },
            { id: "kr", name: "South Korea", flagIso: "kr" },
            { id: "il", name: "Israel", flagIso: "il" },
        ];
        const countriesData = countries.filter(country =>
            country.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 9);

        const groups: SearchGroup[] = [];

        // Process models
        if (modelsData && modelsData.length > 0) {
            const modelItems: SearchResult[] = modelsData.map((model: any) => ({
                id: model.model_id,
                title: model.name,
                subtitle: model.organisation?.name || null,
                href: `/models/${model.model_id}`,
                icon: "model" as const,
                logoId: model.organisation?.organisation_id,
            }));

            groups.push({
                type: "model",
                label: "Models",
                items: modelItems,
            });
        }

        // Process organisations
        if (orgsData && orgsData.length > 0) {
            const orgItems: SearchResult[] = orgsData.map((org: any) => ({
                id: org.organisation_id,
                title: org.name,
                subtitle: org.description || null,
                href: `/organisations/${org.organisation_id}`,
                icon: "organisation" as const,
                logoId: org.organisation_id,
            }));

            groups.push({
                type: "organisation",
                label: "Organisations",
                items: orgItems,
            });
        }

        // Process benchmarks
        if (benchmarksData && benchmarksData.length > 0) {
            const benchmarkItems: SearchResult[] = benchmarksData.map((benchmark: any) => ({
                id: benchmark.id,
                title: benchmark.name,
                subtitle: benchmark.description || null,
                href: `/benchmarks/${benchmark.id}`,
                icon: "benchmark" as const,
            }));

            groups.push({
                type: "benchmark",
                label: "Benchmarks",
                items: benchmarkItems,
            });
        }

        // Process API providers
        if (providersData && providersData.length > 0) {
            const providerItems: SearchResult[] = providersData.map((provider: any) => ({
                id: provider.api_provider_id,
                title: provider.api_provider_name,
                subtitle: provider.description || null,
                href: `/api-providers/${provider.api_provider_id}`,
                icon: "api-provider" as const,
                logoId: provider.api_provider_id,
            }));

            groups.push({
                type: "api-provider",
                label: "API Providers",
                items: providerItems,
            });
        }

        // Process subscription plans
        if (plansData && plansData.length > 0) {
            // Dedupe by plan_id
            const uniquePlans = plansData.filter((plan, index, self) =>
                index === self.findIndex(p => p.plan_id === plan.plan_id)
            );

            const planItems: SearchResult[] = uniquePlans.map((plan: any) => ({
                id: plan.plan_id,
                title: plan.name,
                subtitle: plan.data_organisations?.name || null,
                href: `/subscription-plans/${plan.plan_id}`,
                icon: "plan" as const,
                logoId: plan.organisation_id,
            }));

            groups.push({
                type: "plan",
                label: "Subscription Plans",
                items: planItems,
            });
        }

        // Process countries
        if (countriesData && countriesData.length > 0) {
            const countryItems: SearchResult[] = countriesData.map((country: any) => ({
                id: country.id,
                title: country.name,
                subtitle: null,
                href: `/countries/${country.id}`,
                icon: "country" as const,
                flagIso: country.flagIso,
            }));

            groups.push({
                type: "country",
                label: "Countries",
                items: countryItems,
            });
        }

        return NextResponse.json({ groups });

    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json(
            { error: "Search failed" },
            { status: 500 }
        );
    }
}