import Header from "@/components/Header";
import type { Metadata } from "next";
import { fetchAggregateData } from "@/lib/fetchData";
import ProvidersDisplay from "@/components/providers/ProvidersDisplay";

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
	const models = await fetchAggregateData();
	// Extract unique providers from models
	const providerMap = new Map();
	for (const model of models) {
		if (model.provider && model.provider.provider_id) {
			providerMap.set(model.provider.provider_id, model.provider);
		}
	}
	const providers = Array.from(providerMap.values());
	const providerNames = providers.map((p: any) => p.name);
	const keywords = Array.from(new Set([...staticKeywords, ...providerNames]));
	return {
		title: "AI Providers | Compare AI Providers & Their Models",
		description:
			"Explore a comprehensive directory of AI providers. Compare top AI providers, their models, features, benchmarks, and pricing. Find the best AI provider for your needs on AI Stats.",
		keywords,
		alternates: {
			canonical: "https://ai-stats.phaseo.app/providers",
		},
	};
}

export default async function ProvidersPage() {
	const models = await fetchAggregateData();

	// Extract unique providers from models
	const providerMap = new Map();
	for (const model of models) {
		if (model.provider && model.provider.provider_id) {
			providerMap.set(model.provider.provider_id, model.provider);
		}
	}
	const providers = Array.from(providerMap.values());

	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<div className="container mx-auto px-4 py-8">
				<ProvidersDisplay providers={providers} />
			</div>
		</main>
	);
}
