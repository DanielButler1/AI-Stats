import Header from "@/components/Header";
import type { Metadata } from "next";
import type { ExtendedModel, Price } from "@/data/types";
import { fetchAggregateData } from "@/lib/fetchData";
import fs from "fs/promises";
import path from "path";
import ProviderModelsDisplay from "@/components/prices/Provider/[Provider]/ProviderModelsDisplay";

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

	// Try to fetch the proper provider name from the provider's metadata JSON
	let providerName: string | undefined;
	try {
		const providerJsonPath = path.join(
			process.cwd(),
			"src/data/api_providers",
			providerId,
			"api_provider.json"
		);
		const providerJsonRaw = await fs.readFile(providerJsonPath, "utf-8");
		const providerJson = JSON.parse(providerJsonRaw);
		providerName = providerJson.api_provider_name;
	} catch {
		// fallback if file or field is missing
		providerName = providerId.charAt(0).toUpperCase() + providerId.slice(1);
	}

	return {
		title: `${providerName} API Pricing & Model Costs`,
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
					input_token_price: providerPrice?.input_token_price ?? null,
					output_token_price:
						providerPrice?.output_token_price ?? null,
				},
			};
		});

	if (providerModels.length === 0) {
		const providerName =
			params.provider.charAt(0).toUpperCase() + params.provider.slice(1);
		return (
			<main className="flex min-h-screen flex-col">
				<Header />
				<div className="container mx-auto px-4 py-8">
					<div className="rounded-lg border border-dashed p-6 md:p-8 text-center bg-muted/30">
						<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
							<span className="text-xl">💸</span>
						</div>
						<p className="text-base font-medium">
							No pricing data found for {providerName}
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							We&apos;re continuously adding new providers and
							pricing data. Have a provider to suggest or
							contribute?
						</p>
						<div className="mt-3">
							<a
								href="https://github.com/DanielButler1/AI-Stats"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
							>
								Contribute on GitHub
							</a>
						</div>
					</div>
				</div>
			</main>
		);
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
				<ProviderModelsDisplay
					providerName={providerName}
					providerModels={providerModels}
				/>
			</div>
		</main>
	);
}
