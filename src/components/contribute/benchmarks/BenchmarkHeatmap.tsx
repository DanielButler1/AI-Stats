"use client";

import { useMemo, useState } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	TooltipProvider,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ExtendedModel } from "@/data/types";

interface BenchmarkHeatmapProps {
	models: ExtendedModel[];
	allBenchmarks: any[];
}

export default function BenchmarkHeatmap({
	models,
	allBenchmarks,
}: BenchmarkHeatmapProps) {
	// State for search query
	const [searchQuery, setSearchQuery] = useState("");
	// State for sort method
	const [sortMethod, setSortMethod] = useState<
		"coverage-asc" | "coverage-desc" | "name"
	>("coverage-desc");

	// Get the count of unique benchmarks completed by a model
	const getUniqueCompletedBenchmarks = (model: ExtendedModel): number => {
		if (!model.benchmark_results) return 0;

		// Use a Set to track unique benchmark IDs
		const uniqueBenchmarks = new Set<string>();

		model.benchmark_results.forEach((result) => {
			if (result.benchmark && result.benchmark.id) {
				uniqueBenchmarks.add(result.benchmark.id);
			}
		});

		return uniqueBenchmarks.size;
	};

	// Sort benchmarks alphabetically
	const sortedBenchmarks = useMemo(() => {
		return [...allBenchmarks].sort((a, b) => a.name.localeCompare(b.name));
	}, [allBenchmarks]);

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

		// Helper to get release or announced date as a timestamp
		const getDateValue = (model: ExtendedModel) => {
			const dateStr = model.release_date || model.announced_date;
			return dateStr ? new Date(dateStr).getTime() : 0;
		};

		// Apply sorting
		return filtered.sort((a, b) => {
			const coverageA = getUniqueCompletedBenchmarks(a);
			const coverageB = getUniqueCompletedBenchmarks(b);
			const coveragePercentA = sortedBenchmarks.length
				? Math.round((coverageA / sortedBenchmarks.length) * 100)
				: 0;
			const coveragePercentB = sortedBenchmarks.length
				? Math.round((coverageB / sortedBenchmarks.length) * 100)
				: 0;

			if (sortMethod === "coverage-asc") {
				if (coveragePercentA !== coveragePercentB) {
					return coveragePercentA - coveragePercentB;
				} else {
					// Always secondary sort: newest release first
					return getDateValue(b) - getDateValue(a);
				}
			}
			if (sortMethod === "coverage-desc") {
				if (coveragePercentA !== coveragePercentB) {
					return coveragePercentB - coveragePercentA;
				} else {
					// Always secondary sort: newest release first
					return getDateValue(b) - getDateValue(a);
				}
			}
			if (sortMethod === "name") {
				const nameCompare = a.name.localeCompare(b.name);
				if (nameCompare !== 0) return nameCompare;
				// Secondary sort: newest release first
				return getDateValue(b) - getDateValue(a);
			}
			return getDateValue(b) - getDateValue(a);
		});
	}, [models, searchQuery, sortMethod, sortedBenchmarks.length]);

	// Calculate percentage of benchmark coverage for each model
	const getCoveragePercentage = (model: ExtendedModel) => {
		if (!model.benchmark_results || sortedBenchmarks.length === 0) return 0;
		const uniqueCount = getUniqueCompletedBenchmarks(model);
		return Math.round((uniqueCount / sortedBenchmarks.length) * 100);
	};

	// Check if a model has results for a specific benchmark
	const hasModelBenchmark = (model: ExtendedModel, benchmarkId: string) => {
		return (
			model.benchmark_results?.some(
				(result) => result.benchmark.id === benchmarkId
			) || false
		);
	};

	// Get score value for a specific benchmark result
	const getBenchmarkScore = (model: ExtendedModel, benchmarkId: string) => {
		const result = model.benchmark_results?.find(
			(result) => result.benchmark.id === benchmarkId
		);
		if (!result) return null;

		if (typeof result.score === "number") {
			return result.score.toFixed(1);
		}

		if (typeof result.score === "string") {
			// Remove % if present, parse to number, and format to 1 decimal place
			const score = parseFloat(result.score.replace("%", ""));
			return !isNaN(score) ? score.toFixed(1) : result.score;
		}

		return String(result.score);
	};

	// Get the score color class based on the score value
	const getScoreColorClass = (score: string | null) => {
		if (!score) return "";

		const numScore = parseFloat(score);
		if (isNaN(numScore)) return "";

		if (numScore > 80) {
			return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
		} else if (numScore > 60) {
			return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
		} else if (numScore > 40) {
			return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
		} else {
			return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
		}
	};

	return (
		<TooltipProvider>
			<div className="space-y-6">
				<Card>
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg font-semibold">
								Benchmark Coverage
								<span className="text-muted-foreground ml-2 text-sm font-normal">
									({filteredAndSortedModels.length} models,{" "}
									{sortedBenchmarks.length} benchmarks)
								</span>
							</CardTitle>

							{/* Additional actions can be added here if needed */}
						</div>
					</CardHeader>

					<CardContent>
						{/* Search and filters */}
						<div className="flex flex-col sm:flex-row gap-2 mb-4">
							<div className="relative flex-1">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Search models or providers..."
									className="pl-8"
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
								/>
							</div>
							<Select
								value={sortMethod}
								onValueChange={(value) =>
									setSortMethod(value as any)
								}
							>
								<SelectTrigger className="w-full sm:w-[180px]">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="coverage-desc">
										Highest Coverage
									</SelectItem>
									<SelectItem value="coverage-asc">
										Lowest Coverage
									</SelectItem>
									<SelectItem value="name">
										Model Name (A-Z)
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Card Grid View */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{filteredAndSortedModels.map((model) => (
								<Card
									key={model.id}
									className="overflow-hidden"
								>
									<CardHeader className="p-4 pb-0">
										<div className="flex items-center gap-2">
											<Link
												href={`/providers/${model.provider?.provider_id}`}
												className="w-6 h-6 relative flex-shrink-0 block"
											>
												<Image
													src={`/providers/${model.provider?.provider_id}.svg`}
													alt={
														model.provider?.name ||
														""
													}
													fill
													className="rounded-sm object-contain"
												/>
											</Link>
											<Tooltip delayDuration={0}>
												<TooltipTrigger asChild>
													<Link
														href={`/models/${model.id}`}
														className="hover:text-primary transition-colors font-medium"
													>
														{model.name}
													</Link>
												</TooltipTrigger>
												<TooltipContent>
													<p>Model ID: {model.id}</p>
												</TooltipContent>
											</Tooltip>
											{model.status === "Rumoured" && (
												<Badge
													variant="outline"
													className="text-xs"
												>
													Rumored
												</Badge>
											)}
										</div>
									</CardHeader>

									<CardContent className="p-4">
										{/* Coverage percentage */}
										<div className="flex justify-between items-center mb-4">
											<p className="text-sm font-medium">
												Coverage
											</p>
											<div className="flex items-center gap-2">
												<Badge
													className={cn(
														"px-2 py-0.5",
														getCoveragePercentage(
															model
														) > 60
															? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
															: getCoveragePercentage(
																	model
															  ) > 30
															? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
															: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
													)}
												>
													{getCoveragePercentage(
														model
													)}
													%
												</Badge>
												<Badge
													variant="outline"
													className="px-2 py-0.5 text-xs text-muted-foreground border-muted-foreground/30 bg-transparent"
												>
													{getUniqueCompletedBenchmarks(
														model
													)}
													/{sortedBenchmarks.length}
												</Badge>
											</div>
										</div>
									</CardContent>

									<CardFooter className="p-4 pt-0">
										<Accordion
											type="single"
											collapsible
											className="w-full"
										>
											<AccordionItem
												value="benchmarks"
												className="border-0"
											>
												<AccordionTrigger className="py-1 text-sm text-muted-foreground hover:text-foreground">
													View all benchmarks
												</AccordionTrigger>
												<AccordionContent>
													<div className="grid grid-cols-2 gap-2 pt-2">
														{sortedBenchmarks.map(
															(benchmark) => {
																const hasResult =
																	hasModelBenchmark(
																		model,
																		benchmark.id
																	);
																const score =
																	hasResult
																		? getBenchmarkScore(
																				model,
																				benchmark.id
																		  )
																		: null;

																return (
																	<div
																		key={
																			benchmark.id
																		}
																		className={cn(
																			"p-2 rounded-md flex flex-col items-center text-center",
																			hasResult
																				? "bg-green-50 dark:bg-green-950/20"
																				: "bg-gray-100 dark:bg-gray-800/20"
																		)}
																	>
																		<Tooltip>
																			<TooltipTrigger
																				asChild
																			>
																				<p
																					className="text-xs font-medium mb-1 truncate w-full"
																					title={
																						benchmark.name
																					}
																				>
																					{
																						benchmark.name
																					}
																				</p>
																			</TooltipTrigger>
																			{benchmark.description && (
																				<TooltipContent>
																					<p>
																						{
																							benchmark.description
																						}
																					</p>
																				</TooltipContent>
																			)}
																		</Tooltip>

																		{hasResult ? (
																			<Badge
																				variant="outline"
																				className={cn(
																					"text-xs font-mono",
																					getScoreColorClass(
																						score
																					)
																				)}
																			>
																				{
																					score
																				}
																			</Badge>
																		) : (
																			<span className="text-xs text-muted-foreground">
																				—
																			</span>
																		)}
																	</div>
																);
															}
														)}
													</div>
												</AccordionContent>
											</AccordionItem>
										</Accordion>
									</CardFooter>
								</Card>
							))}

							{filteredAndSortedModels.length === 0 && (
								<div className="p-8 text-center text-muted-foreground col-span-full">
									No models match your current filters
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</TooltipProvider>
	);
}
