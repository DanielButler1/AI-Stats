import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
import type { ExtendedModel, Price } from "@/data/types";
import { fetchAggregateData } from "@/lib/fetchData";
import fs from "fs/promises";
import path from "path";
import ProviderModelsDisplay from "@/components/prices/ProviderModelsDisplay";

interface ProviderModelInfo {
	model: ExtendedModel;
	providerPrices: {
		input_token_price: number | null;
		output_token_price: number | null;
	};
}

export async function generateMetadata(props: {
	params: Promise<{ provider: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const providerId = params.provider;
	const providerName =
		providerId.charAt(0).toUpperCase() + providerId.slice(1);

	return {
		title: `${providerName} API Pricing & Model Costs | AI Stats`,
		description: `Explore detailed pricing for ${providerName} API, including token costs and all available AI models. Compare ${providerName} with other AI API providers on AI Stats.`,
		keywords: [
			`${providerName} pricing`,
			`${providerName} API`,
			`${providerName} model costs`,
			"AI API pricing",
			"token pricing",
			"AI model pricing",
			"compare AI providers",
			"AI Stats",
		],
		alternates: {
			canonical: `https://ai-stats.phaseo.app/prices/${providerId}`,
		},
	};
}

export async function generateStaticParams() {
	const apiDir = path.join(process.cwd(), "src/data/api_providers");
	try {
		const ids = await fs.readdir(apiDir);
		return ids.map((id) => ({ provider: id }));
	} catch {
		return [];
	}
}

export default async function ProviderPricePage(props: {
	params: Promise<{ provider: string }>;
}) {
	const params = await props.params;

	try {
		const allModels = (await fetchAggregateData()) as ExtendedModel[];

		// Helper function to check if a price belongs to the current provider
		const isProviderPrice = (price: Price) => {
			if (typeof price.api_provider === "string") {
				return price.api_provider === params.provider;
			}
			return price.api_provider?.api_provider_id === params.provider;
		};

		// Filter models for this provider and get their prices
		const providerModels: ProviderModelInfo[] = allModels
			.filter((model) => model.prices?.some(isProviderPrice))
			.map((model) => {
				const providerPrice = model.prices?.find(isProviderPrice);
				return {
					model,
					providerPrices: {
						input_token_price:
							providerPrice?.input_token_price ?? null,
						output_token_price:
							providerPrice?.output_token_price ?? null,
					},
				};
			});

		if (providerModels.length === 0) {
			throw new Error("No models found for this provider");
		}

		// Get provider name from the first model's prices
		const firstModelPrice =
			providerModels[0].model.prices?.find(isProviderPrice);
		const providerName =
			(typeof firstModelPrice?.api_provider !== "string" &&
				firstModelPrice?.api_provider?.api_provider_name) ||
			params.provider.charAt(0).toUpperCase() + params.provider.slice(1);

		return (
			<main className="flex min-h-screen flex-col">
				<Header />
				<div className="container mx-auto px-4 py-8">
					<Card className="mb-8 shadow-lg p-4">
						<h1 className="text-3xl font-bold">
							Models offered by {providerName}{" "}
							<span className="text-muted-foreground text-xl font-normal">
								({providerModels.length})
							</span>
						</h1>
					</Card>
					<ProviderModelsDisplay providerModels={providerModels} />
				</div>
			</main>
		);
	} catch (error) {
		console.error("Error loading provider data:", error);
		return (
			<main className="flex min-h-screen flex-col">
				<Header />
				<div className="container mx-auto px-4 py-8">
					<h2 className="text-2xl font-bold text-red-600">
						Error loading provider data
					</h2>
					<p>Please try refreshing the page.</p>
				</div>
			</main>
		);
	}
}
