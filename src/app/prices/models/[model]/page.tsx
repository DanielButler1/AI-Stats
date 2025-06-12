import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Crown, Info } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { ExtendedModel } from "@/data/types";
import { fetchAggregateData } from "@/lib/fetchData";
import fs from "fs/promises";
import path from "path";
import Image from "next/image";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModelPriceInfo {
	provider_id: string;
	provider_name: string;
	provider_link?: string;
	input_token_price: number | null;
	output_token_price: number | null;
	total_cost_1m: number | null;
	latency: number | null;
	throughput: number | null;
}

function extractPriceInfo(
	model: ExtendedModel
): (ModelPriceInfo & { other_info?: string | null })[] {
	if (!model.prices) return [];

	const priceInfo: (ModelPriceInfo & { other_info?: string | null })[] = [];

	for (const price of model.prices) {
		let providerId: string;
		let providerName: string;
		let providerLink: string | undefined;

		if (typeof price.api_provider === "string") {
			providerId = price.api_provider;
			providerName = providerId;
		} else if (price.api_provider?.api_provider_id) {
			providerId = price.api_provider.api_provider_id;
			providerName = price.api_provider.api_provider_name || providerId;
			providerLink = price.api_provider.link || undefined;
		} else if (price.api_provider_id) {
			providerId = price.api_provider_id;
			providerName = providerId;
		} else {
			continue;
		}

		// Calculate total cost for 1M tokens assuming 1:3 input:output ratio
		const totalCost =
			price.input_token_price !== null &&
			price.output_token_price !== null
				? ((price.input_token_price * 1 +
						price.output_token_price * 3) *
						1_000_000) /
				  4
				: null;

		priceInfo.push({
			provider_id: providerId,
			provider_name: providerName,
			provider_link: providerLink,
			input_token_price: price.input_token_price,
			output_token_price: price.output_token_price,
			total_cost_1m: totalCost,
			latency: price.latency ?? null,
			throughput: price.throughput ?? null,
			other_info: price.other_info ?? null,
		});
	}

	return priceInfo;
}

export async function generateMetadata(props: {
	params: Promise<{ model: string }>;
}): Promise<Metadata> {
	const params = await props.params;

	try {
		const allModels = (await fetchAggregateData()) as ExtendedModel[];
		const model = allModels.find((m) => m.id === params.model);

		if (!model) {
			return {
				title: `${params.model} Pricing | AI Stats`,
				description: `Compare pricing information across different providers`,
			};
		}

		return {
			title: `${model.name} Pricing | AI Stats`,
			description: `Compare pricing information for ${model.name} across different providers`,
		};
	} catch {
		return {
			title: `${params.model} Pricing | AI Stats`,
			description: `Compare pricing information across different providers`,
		};
	}
}

export async function generateStaticParams() {
	const modelsDir = path.join(process.cwd(), "src/data/models");
	const params: { model: string }[] = [];
	const providerFolders = await fs.readdir(modelsDir);
	for (const provider of providerFolders) {
		const providerPath = path.join(modelsDir, provider);
		const modelFolders = await fs.readdir(providerPath);
		for (const m of modelFolders) {
			const modelPath = path.join(providerPath, m, "model.json");
			try {
				const file = await fs.readFile(modelPath, "utf-8");
				const data = JSON.parse(file);
				params.push({ model: data.id });
			} catch {
				continue;
			}
		}
	}
	return params;
}

export default async function ModelPricePage(props: {
	params: Promise<{ model: string }>;
}) {
	const params = await props.params;

	try {
		const allModels = (await fetchAggregateData()) as ExtendedModel[];
		const model = allModels.find((m) => m.id === params.model);

		if (!model) {
			throw new Error("Model not found");
		}

		// Extract and sort pricing information from all providers
		const providerPrices = extractPriceInfo(model).sort(
			(a, b) =>
				(a.total_cost_1m ?? Infinity) - (b.total_cost_1m ?? Infinity)
		);

		// Find cheapest provider
		const cheapestProvider = providerPrices[0];

		return (
			<main className="flex min-h-screen flex-col">
				<Header />
				<div className="container mx-auto px-4 py-8">
					{/* Model overview */}
					<Card className="mb-8 shadow-lg">
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
									<div className="flex flex-col md:flex-row items-center w-full gap-2 md:gap-0">
										{/* Provider logo */}
										<div className="flex-shrink-0 flex flex-col items-center justify-center h-full mb-2 md:mb-0 md:mr-6">
											<Image
												src={`/providers/${model.provider.provider_id}.svg`}
												alt={model.provider.name}
												width={48}
												height={48}
												className="rounded-full border bg-white object-contain w-12 h-12 p-0.5 md:w-24 md:h-24"
											/>
										</div>
										{/* Model and provider info */}
										<div className="flex flex-col items-center md:items-start justify-center flex-1">
											<Link
												href={`/models/${model.id}`}
												className="text-3xl md:text-5xl font-bold mb-1 text-center md:text-left"
											>
												{model.name}
											</Link>
											<Link
												href={`/providers/${model.provider.provider_id}`}
												className="text-base md:text-lg font-semibold text-primary hover:font-bold flex items-center gap-2 w-fit text-center md:text-left"
												aria-label={`View ${model.provider.name} details`}
											>
												{model.provider.name}
											</Link>
										</div>
									</div>
								</div>
							</div>
						</CardHeader>
					</Card>

					{/* Provider pricing comparison */}
					<Card className="shadow-lg">
						<CardHeader>
							<CardTitle>
								Compare Pricing Across Providers
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="relative overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b dark:border-zinc-700">
											<th className="text-left p-4">
												Provider
											</th>
											<th className="text-center p-4">
												Input Cost
												<br />
												(per 1M tokens)
											</th>
											<th className="text-center p-4">
												Output Cost
												<br />
												(per 1M tokens)
											</th>
											<th className="text-center p-4">
												Blended Cost
												<br />
												(1:3 ratio)
											</th>
											<th className="text-center p-4">
												Latency
											</th>
											<th className="text-center p-4">
												Throughput
											</th>
											<th className="p-4"></th>
										</tr>
									</thead>
									<tbody>
										{providerPrices.map((price) => (
											<tr
												key={price.provider_id}
												className="border-b dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
											>
												<td className="p-4">
													<Link
														href={`/prices/${price.provider_id}`}
														className="flex items-center gap-2 hover:text-primary"
													>
														<div className="h-6 w-6 relative">
															<Image
																src={`/providers/${price.provider_id}.svg`}
																alt={
																	price.provider_name
																}
																fill
																className="object-contain bg-white rounded-full p-0.5"
															/>
														</div>
														<span className="flex items-center gap-2">
															{
																price.provider_name
															}
															{price ===
																cheapestProvider && (
																<Crown className="h-4 w-4 text-yellow-400" />
															)}
														</span>
													</Link>
												</td>
												<td className="p-4 text-center font-mono">
													{price.input_token_price
														? `$${(
																price.input_token_price *
																1_000_000
														  ).toFixed(2)}`
														: "-"}
												</td>
												<td className="p-4 text-center font-mono">
													{price.output_token_price
														? `$${(
																price.output_token_price *
																1_000_000
														  ).toFixed(2)}`
														: "-"}
												</td>
												<td className="p-4 text-center font-mono">
													{price.total_cost_1m
														? `$${price.total_cost_1m.toFixed(
																2
														  )}`
														: "-"}
												</td>
												<td className="p-4 text-center font-mono">
													{price.latency !== null
														? `${price.latency}ms`
														: "-"}
												</td>
												<td className="p-4 text-center font-mono">
													{price.throughput !== null
														? `${price.throughput}/s`
														: "-"}
												</td>
												<td className="p-4 text-center">
													{price.provider_link && (
														<Link
															href={
																price.provider_link
															}
															target="_blank"
															rel="noopener noreferrer"
														>
															<Button
																variant="outline"
																size="icon"
																className="h-8 w-8"
															>
																<ExternalLink className="h-4 w-4" />
															</Button>
														</Link>
													)}
													{price.other_info && (
														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger
																	asChild
																>
																	<Button
																		variant="outline"
																		size="icon"
																		className="h-8 w-8 ml-2"
																	>
																		<Info className="h-4 w-4 text-muted-foreground" />
																	</Button>
																</TooltipTrigger>
																<TooltipContent className="max-w-xs whitespace-pre-line break-words">
																	{
																		price.other_info
																	}
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		);
	} catch (error) {
		console.error("Error loading model data:", error);
		return (
			<main className="flex min-h-screen flex-col">
				<Header />
				<div className="container mx-auto px-4 py-8">
					<h2 className="text-2xl font-bold text-red-600">
						Error loading model data
					</h2>
					<p>Please try refreshing the page.</p>
				</div>
			</main>
		);
	}
}
