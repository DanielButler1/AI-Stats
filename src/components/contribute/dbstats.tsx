// filepath: z:\AI Stats\src\components\contribute\dbstats.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExtendedModel } from "@/data/types";

interface DbStatsProps {
	models: ExtendedModel[];
}

export default function DbStats({ models }: DbStatsProps) {
	// Unique providers
	const providers = new Set(
		models.map((m) => m.provider?.name || m.provider.provider_id)
	);
	// Unique benchmarks from models
	const modelBenchmarks = models.flatMap(
		(m) => m.benchmark_results?.map((b) => b.benchmark.name) || []
	);
	const uniqueBenchmarks = new Set(modelBenchmarks);

	// Total benchmark results
	const totalBenchmarkResults = models.reduce(
		(acc, m) => acc + (m.benchmark_results?.length || 0),
		0
	);

	// Total price providers (providers with at least one model with a price)
	const priceProviders = new Set(
		models.flatMap((m) =>
			m.prices &&
			m.prices.some(
				(p) =>
					p.input_token_price != null || p.output_token_price != null
			)
				? [m.provider?.name || m.provider.provider_id]
				: []
		)
	);

	// Calculate model field completeness percentage
	const getTotalCoverage = () => {
		try {
			// If there are no models, return 0
			if (!models || models.length === 0) return 0;

			// Track total fields and completed fields
			let totalFields = 0;
			let completedFields = 0;

			// Define all model fields that should be checked
			const modelFields = [
				"id",
				"name",
				"release_date",
				"status",
				"description",
				"announced_date",
				"input_context_length",
				"output_context_length",
				"license",
				"multimodal",
				"input_types",
				"output_types",
				"previous_model_id",
				"web_access",
				"reasoning",
				"fine_tunable",
				"knowledge_cutoff",
				"api_reference_link",
				"playground_link",
				"paper_link",
				"announcement_link",
				"repository_link",
				"weights_link",
				"parameter_count",
				"training_tokens",
			];

			// Calculate field completeness for each model
			models.forEach((model) => {
				// Check regular model fields
				modelFields.forEach((field) => {
					totalFields++;
					if ((model as any)[field] !== null) {
						completedFields++;
					}
				});

				// Count benchmark completeness
				// For each model, check how many benchmarks it has results for
				// compared to all possible benchmarks
				if (uniqueBenchmarks.size > 0) {
					// For each unique benchmark, this model should have a result
					const totalPossibleBenchmarks = uniqueBenchmarks.size;
					totalFields += totalPossibleBenchmarks;

					// Count how many benchmarks this model actually has results for
					const modelBenchmarkCount =
						model.benchmark_results?.length || 0;
					completedFields += modelBenchmarkCount;
				}
			});

			// Calculate percentage and ensure it's within 0-100 range
			const percentage =
				totalFields > 0
					? Math.round((completedFields / totalFields) * 100)
					: 0;
			return Math.min(100, Math.max(0, percentage));
		} catch {
			// Silent error handling
			return 0; // Return 0 if there's an error
		}
	};

	const totalCoveragePercent = getTotalCoverage();
	return (
		<TooltipProvider>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
				<Card className="p-0">
					<CardHeader className="min-h-[56px] flex items-center">
						<CardTitle>
							<span className="inline-flex items-center whitespace-nowrap truncate w-full">
								Total Providers
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="text-3xl font-bold flex items-center justify-center min-h-[64px]">
						{providers.size}
					</CardContent>
				</Card>
				<Card className="p-0">
					<CardHeader className="min-h-[56px] flex items-center">
						<CardTitle>
							<span className="inline-flex items-center whitespace-nowrap truncate w-full">
								Total Models
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="text-3xl font-bold flex items-center justify-center min-h-[64px]">
						{models.length}
					</CardContent>
				</Card>
				<Card className="p-0">
					<CardHeader className="min-h-[56px] flex items-center">
						<CardTitle>
							<span className="inline-flex items-center whitespace-nowrap truncate w-full">
								Total Benchmarks
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="text-3xl font-bold flex items-center justify-center min-h-[64px]">
						{uniqueBenchmarks.size}
					</CardContent>
				</Card>
				<Card className="p-0">
					<CardHeader className="min-h-[56px] flex items-center">
						<CardTitle>
							<span className="inline-flex items-center whitespace-nowrap truncate w-full">
								Total Benchmark Results
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="text-3xl font-bold flex items-center justify-center min-h-[64px]">
						{totalBenchmarkResults}
					</CardContent>
				</Card>
				<Card className="p-0">
					<CardHeader className="min-h-[56px] flex items-center">
						<CardTitle>
							<span className="inline-flex items-center whitespace-nowrap truncate w-full">
								Total Price Providers
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="text-3xl font-bold flex items-center justify-center min-h-[64px]">
						{priceProviders.size}
					</CardContent>
				</Card>{" "}
				<Card className="p-0">
					<CardHeader className="min-h-[56px] flex items-center">
						<CardTitle>
							{" "}
							<span className="inline-flex items-center whitespace-nowrap truncate w-full">
								Data Completeness
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger>
											<Info className="h-4 w-4 ml-1 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent
											side="top"
											className="max-w-sm"
										>
											<p className="font-semibold mb-1">
												Model field completeness
											</p>
											<p className="text-sm">
												Percentage of non-null fields
												across all models and benchmarks
											</p>
											<p className="text-xs mt-1">
												This shows what percentage of
												all model fields and benchmark
												data are populated across the
												database, comparing what data we
												have versus what is missing.
												Each model is expected to have
												data for all benchmark types.
											</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</span>
						</CardTitle>
					</CardHeader>{" "}
					<CardContent className="text-3xl font-bold flex items-center justify-center min-h-[64px]">
						<span
							className={cn(
								totalCoveragePercent > 80
									? "text-green-600 dark:text-green-400"
									: totalCoveragePercent > 60
									? "text-emerald-600 dark:text-emerald-400"
									: totalCoveragePercent > 40
									? "text-amber-600 dark:text-amber-400"
									: "text-red-600 dark:text-red-400"
							)}
						>
							{totalCoveragePercent}%
						</span>
					</CardContent>
				</Card>{" "}
			</div>
		</TooltipProvider>
	);
}
