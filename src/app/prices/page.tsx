import Header from "@/components/header";
import PriceProvidersDisplay from "@/components/prices/PriceProvidersDisplay";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";
import { fetchAggregateData } from "@/lib/fetchData";

export const metadata: Metadata = {
	title: "All Price Providers | AI Stats",
	description:
		"Browse all unique price providers and see how commonly they're used across AI models.",
	keywords: ["AI price providers", "model pricing", "token pricing"],
};

export default async function PricesPage() {
	try {
		const models = await fetchAggregateData();

		// Extract unique price providers and collect statistics
		const providerMap = new Map();
		const providerUsage: Record<string, number> = {};
		models.forEach((model: any) => {
			if (model.prices && model.prices.length > 0) {
				// Process each price provider for this model
				model.prices.forEach((price: any) => {
					let apiProviderId: string;
					let apiProviderName: string;

					// Extract the API provider ID and name
					if (typeof price.api_provider === "string") {
						// Old format: just a string ID
						apiProviderId = price.api_provider;
						apiProviderName = apiProviderId; // Fallback
					} else if (
						price.api_provider &&
						price.api_provider.api_provider_id
					) {
						// New format: full API provider object
						apiProviderId = price.api_provider.api_provider_id;
						apiProviderName =
							price.api_provider.api_provider_name ||
							apiProviderId;
					} else if (price.api_provider_id) {
						// Alternative format: just the ID field
						apiProviderId = price.api_provider_id;
						apiProviderName = apiProviderId; // Fallback
					} else {
						// No API provider information
						return;
					}

					// Skip if there's no input or output price
					if (!price.input_token_price && !price.output_token_price) {
						return;
					}

					// Count usage
					providerUsage[apiProviderId] =
						(providerUsage[apiProviderId] || 0) + 1;

					// Track providers and their prices
					if (!providerMap.has(apiProviderId)) {
						// First time seeing this provider
						providerMap.set(apiProviderId, {
							id: apiProviderId,
							name: apiProviderName,
							description:
								(typeof price.api_provider === "object" &&
									price.api_provider?.description) ||
								"",
							minInputPrice: price.input_token_price,
							minOutputPrice: price.output_token_price,
							allPrices: [
								{
									input: price.input_token_price,
									output: price.output_token_price,
									modelId: model.id,
								},
							],
						});
					} else {
						// Update provider data with this model's pricing
						const providerData = providerMap.get(apiProviderId);

						// Store all prices for statistical purposes
						providerData.allPrices = providerData.allPrices || [];
						providerData.allPrices.push({
							input: price.input_token_price,
							output: price.output_token_price,
							modelId: model.id,
						});

						// Keep track of minimum prices (still useful for sorting)
						if (
							price.input_token_price &&
							(providerData.minInputPrice === null ||
								price.input_token_price <
									providerData.minInputPrice)
						) {
							providerData.minInputPrice =
								price.input_token_price;
						}
						if (
							price.output_token_price &&
							(providerData.minOutputPrice === null ||
								price.output_token_price <
									providerData.minOutputPrice)
						) {
							providerData.minOutputPrice =
								price.output_token_price;
						}
					}
				});
			}
		});

		const providers = Array.from(providerMap.values());

		return (
			<main className="flex min-h-screen flex-col">
				<Header />
				<div className="container mx-auto px-4 py-8">
					<Card className="mb-4 shadow-lg p-4">
						<h2 className="text-3xl font-bold">
							All API Providers{" "}
							<span className="text-muted-foreground text-xl font-normal">
								({providers.length})
							</span>
						</h2>
					</Card>
					<PriceProvidersDisplay
						providers={providers}
						providerUsage={providerUsage}
					/>
				</div>
			</main>
		);
	} catch (error) {
		console.error("Error loading price providers:", error);
		return (
			<main className="flex min-h-screen flex-col">
				<Header />
				<div className="container mx-auto px-4 py-8">
					<h2 className="text-2xl font-bold text-red-600">
						Error loading price provider data
					</h2>
					<p>Please try refreshing the page.</p>
				</div>
			</main>
		);
	}
}
