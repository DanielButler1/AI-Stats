import type { Metadata } from "next";

import CountryTrendsView from "@/components/(data)/countries/CountryTrendsView";
import {
    buildCountryModelEvents,
    getCountrySummaryByIso,
    getUniqueCountryModels,
    normaliseIso,
} from "@/lib/fetchers/countries/getCountrySummary";
import { buildMetadata } from "@/lib/seo";

function buildOrgContributionData(
    country?: Awaited<ReturnType<typeof getCountrySummaryByIso>>
) {
    if (!country) return [] as Array<{ name: string; count: number; fill: string }>;

    return country.organisations
        .map((org) => ({
            name: org.organisation_name ?? org.organisation_id,
            count: org.modelCount,
            fill: org.colour ?? "hsl(222 89% 53%)",
        }))
        .filter((entry) => entry.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ iso: string }>;
}): Promise<Metadata> {
    const { iso } = await params;
    const isoNormalized = normaliseIso(iso);
    const country = await getCountrySummaryByIso(isoNormalized);
    const name = (country?.countryName ?? isoNormalized) || "Unknown";

    return buildMetadata({
        title: `${name} - Model Trends & Releases`,
        description: `Release calendar, cadence, and organisation share for AI models from ${name}.`,
        path: `/countries/${isoNormalized.toLowerCase()}/trends`,
        keywords: [name, "model releases", "AI Stats", "calendar"],
    });
}

export default async function CountryTrendsPage({
    params,
}: {
    params: Promise<{ iso: string }>;
}) {
    const { iso } = await params;
    const isoNormalized = normaliseIso(iso);
    const country = await getCountrySummaryByIso(isoNormalized);

    if (!country) {
        return (
            <CountryTrendsView
                iso={isoNormalized}
                country={{
                    iso: isoNormalized,
                    countryName: isoNormalized,
                    totalOrganisations: 0,
                    totalModels: 0,
                    recentModels: [],
                    latestModel: null,
                    organisations: [],
                }}
                releasesCount={0}
                announcementsCount={0}
                modelsCount={0}
                orgData={[]}
                recentEvents={[]}
            />
        );
    }

    const events = buildCountryModelEvents(country);
    const recentEvents = events.slice(-220);
    const releases = events.filter((event) => event.types.includes("Released"));
    const announcements = events.filter((event) => event.types.includes("Announced"));
    const models = getUniqueCountryModels(country);
    const orgData = buildOrgContributionData(country);

    return (
        <CountryTrendsView
            iso={isoNormalized}
            country={country}
            releasesCount={releases.length}
            announcementsCount={announcements.length}
            modelsCount={models.length}
            orgData={orgData}
            recentEvents={recentEvents}
        />
    );
}
