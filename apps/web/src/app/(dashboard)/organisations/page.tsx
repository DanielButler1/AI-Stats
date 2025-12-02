import type { Metadata } from "next";
import OrganisationsDisplay from "@/components/(data)/organisations/OrganisationDisplay";
import {
	getAllOrganisationsCached,
	OrganisationCard,
} from "@/lib/fetchers/organisations/getAllOrganisations";

// Static SEO metadata for providers listing
const staticKeywords = [
	"AI providers",
	"AI companies",
	"AI models",
	"machine learning providers",
	"AI benchmarks",
	"AI pricing",
	"AI directory",
	"compare AI providers",
	"AI Stats",
];

export async function generateMetadata(): Promise<Metadata> {
	const organisations = await getAllOrganisationsCached();
	// Extract unique providers from organisations
	const providerMap = new Map();
	for (const organisation of organisations) {
		if (organisation.organisation_id) {
			providerMap.set(organisation.organisation_id, organisation);
		}
	}
	const providers = Array.from(providerMap.values());
	const providerNames = providers.map((p: any) => p.organisation_name);
	const keywords = Array.from(new Set([...staticKeywords, ...providerNames]));

	return {
		title: "AI Organisations - Compare Organisations and their AI Models",
		description:
			"Explore a comprehensive directory of AI organisations. Compare providers by their models, features, benchmarks, and pricing, and find the best fit for your use case with AI Stats.",
		keywords,
		alternates: {
			canonical: "/organisations",
		},
	};
}

export default async function Page() {
	const organisations =
		(await getAllOrganisationsCached()) as OrganisationCard[];

	return (
		<main className="flex flex-col">
			<div className="container mx-auto px-4 py-8">
				<OrganisationsDisplay organisations={organisations} />
			</div>
		</main>
	);
}
