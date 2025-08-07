"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
	TooltipProvider,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ExtendedModel } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import PricingHeatmapControls from "./PricingHeatmapControls";

interface PricingHeatmapProps {
	models: ExtendedModel[];
}

export default function PricingHeatmap({ models }: PricingHeatmapProps) {
	// State for search query
	const [searchQuery, setSearchQuery] = useState("");
	// State for sort method
	const [sortMethod, setSortMethod] = useState<
		"release-desc" | "coverage-desc" | "coverage-asc" | "name"
	>("release-desc");
	// Helper to check if a model has any input token prices
	const hasInputPrice = (model: ExtendedModel) => {
		return model.prices?.some((p) => p.input_token_price !== null) ?? false;
	};

	// Helper to check if a model has cached input token prices
	const hasCachedInputPrice = (model: ExtendedModel) => {
		return (
			model.prices?.some((p) => p.cached_input_token_price !== null) ??
			false
		);
	};

	// Helper to check if a model has any output token prices
	const hasOutputPrice = (model: ExtendedModel) => {
		return (
			model.prices?.some((p) => p.output_token_price !== null) ?? false
		);
	};

	// Helper to check if a model has performance metrics
	const hasPerformanceInfo = (model: ExtendedModel) => {
		return (
			model.prices?.some(
				(p) => p.throughput !== null || p.latency !== null
			) ?? false
		);
	};

	// Filter and sort models based on search query and sort method
	const filteredAndSortedModels = useMemo(() => {
		let filtered = [...models];

		// Always filter out rumoured models
		filtered = filtered.filter((model) => model.status !== "Rumoured");

		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(model) =>
					model.name.toLowerCase().includes(query) ||
					model.provider.name.toLowerCase().includes(query)
			);
		}

		// Helper to get coverage percentage
		const getPricingCoverage = (model: ExtendedModel) => {
			let coverage = 0;
			if (hasInputPrice(model)) coverage++;
			if (hasOutputPrice(model)) coverage++;
			if (hasPerformanceInfo(model)) coverage++;
			if (model.training_tokens !== null) coverage++;
			return coverage;
		};

		// Apply sorting
		return filtered.sort((a, b) => {
			if (sortMethod === "release-desc") {
				// Sort by release date descending (fallback to announced date)
				const dateA = new Date(a.release_date || a.announced_date || 0);
				const dateB = new Date(b.release_date || b.announced_date || 0);
				if (dateA.getTime() !== dateB.getTime()) {
					return dateB.getTime() - dateA.getTime();
				}
			}
			const coverageA = getPricingCoverage(a);
			const coverageB = getPricingCoverage(b);
			if (sortMethod === "coverage-desc") {
				if (coverageA !== coverageB) {
					return coverageB - coverageA;
				}
			}
			if (sortMethod === "coverage-asc") {
				if (coverageA !== coverageB) {
					return coverageA - coverageB;
				}
			}
			if (sortMethod === "name") {
				return a.name.localeCompare(b.name);
			}
			// Secondary sort by name
			return a.name.localeCompare(b.name);
		});
	}, [models, searchQuery, sortMethod]); // Function to calculate overall coverage percentage
	const getOverallCoverage = (model: ExtendedModel) => {
		let covered = 0;
		const total = 4; // input price, cached input price, output price, performance metrics
		if (hasInputPrice(model)) covered++;
		if (hasCachedInputPrice(model)) covered++;
		if (hasOutputPrice(model)) covered++;
		if (hasPerformanceInfo(model)) covered++;
		return Math.round((covered / total) * 100);
	};

	// Function to get color class based on coverage
	const getCoverageColorClass = (coverage: number) => {
		if (coverage === 0) return "bg-gray-100 dark:bg-gray-800";
		if (coverage <= 25) return "bg-red-100 dark:bg-red-900/20";
		if (coverage <= 50) return "bg-yellow-100 dark:bg-yellow-900/20";
		if (coverage <= 75) return "bg-blue-100 dark:bg-blue-900/20";
		return "bg-green-100 dark:bg-green-900/20";
	};

	return (
		<TooltipProvider>
			<div className="space-y-6">
				<Card>
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<div>
								<div className="font-semibold">
									Pricing Coverage
								</div>
								<div className="text-sm text-muted-foreground">
									{filteredAndSortedModels.length} models
								</div>
							</div>
						</div>
					</CardHeader>{" "}
					<CardContent>
						<PricingHeatmapControls
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
							sortMethod={sortMethod as any}
							setSortMethod={setSortMethod}
						/>

						{/* Model Grid */}
						<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							{filteredAndSortedModels.map((model) => {
								const coverage = getOverallCoverage(model);
								return (
									<Card
										key={model.id}
										className="overflow-hidden dark:bg-zinc-950"
									>
										<div className="p-4">
											<div className="font-semibold mb-2 flex items-center justify-between">
												<Tooltip delayDuration={0}>
													<TooltipTrigger asChild>
														<span>
															{model.name}
														</span>
													</TooltipTrigger>
													<TooltipContent side="top">
														Model ID: {model.id}
													</TooltipContent>
												</Tooltip>
												<Badge
													variant="secondary"
													className={getCoverageColorClass(
														coverage
													)}
												>
													{coverage}% Complete
												</Badge>
											</div>
											<div className="text-sm text-muted-foreground mb-4">
												{model.provider.name}
											</div>{" "}
											<div className="space-y-2">
												<div className="text-sm flex justify-between">
													<span>Input Price</span>
													<Badge
														variant="outline"
														className={
															hasInputPrice(model)
																? "bg-green-100 dark:bg-green-900/20"
																: "bg-gray-100 dark:bg-gray-800"
														}
													>
														{hasInputPrice(model)
															? "Present"
															: "Missing"}
													</Badge>
												</div>
												<div className="text-sm flex justify-between">
													<span>
														Cached Input Price
													</span>
													<Badge
														variant="outline"
														className={
															hasCachedInputPrice(
																model
															)
																? "bg-green-100 dark:bg-green-900/20"
																: "bg-gray-100 dark:bg-gray-800"
														}
													>
														{hasCachedInputPrice(
															model
														)
															? "Present"
															: "Missing"}
													</Badge>
												</div>
												<div className="text-sm flex justify-between">
													<span>Output Price</span>
													<Badge
														variant="outline"
														className={
															hasOutputPrice(
																model
															)
																? "bg-green-100 dark:bg-green-900/20"
																: "bg-gray-100 dark:bg-gray-800"
														}
													>
														{hasOutputPrice(model)
															? "Present"
															: "Missing"}
													</Badge>
												</div>
												<div className="text-sm flex justify-between">
													<span>
														Throughput & Latency
													</span>
													<Badge
														variant="outline"
														className={
															hasPerformanceInfo(
																model
															)
																? "bg-green-100 dark:bg-green-900/20"
																: "bg-gray-100 dark:bg-gray-800"
														}
													>
														{hasPerformanceInfo(
															model
														)
															? "Present"
															: "Missing"}
													</Badge>
												</div>
											</div>
										</div>
									</Card>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</div>
		</TooltipProvider>
	);
}
