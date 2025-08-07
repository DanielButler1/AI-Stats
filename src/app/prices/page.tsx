import Header from "@/components/Header";
import PriceProvidersDisplay from "@/components/prices/Provider/PriceProvidersDisplay";
import type { Metadata } from "next";
import { fetchAggregateData } from "@/lib/fetchData";

export const metadata: Metadata = {
	title: "AI Pricing | Compare API Pricing for Leading AI Models",
	description:
		"Explore a comprehensive directory of AI price providers. Compare API pricing, token costs, and provider usage across AI models. Find the best API provider for your needs on AI Stats.",
	keywords: [
		"AI price providers",
		"API pricing",
		"token pricing",
		"AI model pricing",
		"AI API providers",
		"compare AI providers",
		"AI Stats",
	],
	alternates: {
		canonical: "https://ai-stats.phaseo.app/prices",
	},
};

// Helper function to extract provider info from price object
function extractProviderInfo(price: any) {
	// No price data
	if (!price.input_token_price && !price.output_token_price) {
		return null;
	}

	let id: string;
	let name: string;
	let description: string = "";

	// Handle different provider formats
	if (typeof price.api_provider === "string") {
		id = price.api_provider;
		name = id;
	} else if (price.api_provider && price.api_provider.api_provider_id) {
		id = price.api_provider.api_provider_id;
		name = price.api_provider.api_provider_name || id;
		description = price.api_provider.description || "";
	} else if (price.api_provider_id) {
		id = price.api_provider_id;
		name = id;
	} else {
		// No provider info
		return null;
	}

	return {
		id,
		name,
		description,
		inputPrice: price.input_token_price,
		outputPrice: price.output_token_price,
	};
}

export default async function PricesPage() {
	const models = await fetchAggregateData();

	const providerMap = new Map(); // Store provider data
	const providerToModelsMap = new Map<string, Set<string>>(); // Track unique models per provider

	// First pass: Collect all unique models and their base information
	const uniqueModelIds = new Set<string>();
	models.forEach((model: any) => {
		if (model.id) uniqueModelIds.add(model.id);
	});

	// Process all models and their prices
	models.forEach((model: any) => {
		if (!model.prices || !Array.isArray(model.prices)) return;

		// Track which providers we've seen for this model
		const processedProvidersForModel = new Set<string>();

		model.prices.forEach((price: any) => {
			// Extract provider info
			const providerInfo = extractProviderInfo(price);
			if (!providerInfo) return;

			const { id, name, description, inputPrice, outputPrice } =
				providerInfo;

			// Only track each unique model once per provider
			// This prevents counting the same model twice for a provider
			if (!processedProvidersForModel.has(id)) {
				processedProvidersForModel.add(id);

				// Add to unique models tracker
				if (!providerToModelsMap.has(id)) {
					providerToModelsMap.set(id, new Set([model.id]));
				} else {
					providerToModelsMap.get(id)!.add(model.id);
				}
			}

			// Create or update provider data
			if (!providerMap.has(id)) {
				// First time seeing this provider
				providerMap.set(id, {
					id,
					name,
					description,
					minInputPrice: inputPrice,
					minOutputPrice: outputPrice,
					allPrices: [
						{
							input: inputPrice,
							output: outputPrice,
							modelId: model.id,
						},
					],
				});
			} else {
				// Update existing provider data
				const providerData = providerMap.get(id);

				// Add this price to allPrices
				providerData.allPrices.push({
					input: inputPrice,
					output: outputPrice,
					modelId: model.id,
				});

				// Update minimum prices
				if (
					inputPrice &&
					(providerData.minInputPrice === null ||
						inputPrice < providerData.minInputPrice)
				) {
					providerData.minInputPrice = inputPrice;
				}
				if (
					outputPrice &&
					(providerData.minOutputPrice === null ||
						outputPrice < providerData.minOutputPrice)
				) {
					providerData.minOutputPrice = outputPrice;
				}
			}
		});
	});

	// Convert to arrays for rendering
	const providers = Array.from(providerMap.values());

	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<div className="container mx-auto px-4 py-8">
				<PriceProvidersDisplay providers={providers} />
			</div>
		</main>
	);
}
