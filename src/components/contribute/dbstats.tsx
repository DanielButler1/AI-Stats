/* eslint-disable no-console */
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
import type { ExtendedModel, Benchmark } from "@/data/types";
import { getDataCompleteness } from "@/lib/dataCompleteness";

interface DbStatsProps {
	models: ExtendedModel[];
	benchmarks: Benchmark[];
}

export default function DbStats({ models, benchmarks }: DbStatsProps) {
	// Unique providers
	const providers = new Set(
		models.map(
			(m: ExtendedModel) => m.provider?.name || m.provider.provider_id
		)
	);
	// We now use the benchmarks prop directly instead of deriving from models
	// Total benchmark results
	const totalBenchmarkResults = models.reduce(
		(acc: number, m: ExtendedModel) =>
			acc + (m.benchmark_results?.length || 0),
		0
	);

	// Total price providers (providers with at least one model with a price)
	const priceProviders = new Set(
		models.flatMap((m: ExtendedModel) =>
			m.prices &&
			m.prices.some(
				(p: any) =>
					p.input_token_price != null || p.output_token_price != null
			)
				? [m.provider?.name || m.provider.provider_id]
				: []
		)
	);

	// Overall data completeness percentage via helper
	const { percent: totalCoveragePercent } = getDataCompleteness(
		models,
		benchmarks
	);

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
					</CardHeader>{" "}
					<CardContent className="text-3xl font-bold flex items-center justify-center min-h-[64px]">
						{benchmarks.length}
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
												Data Completeness approximately
												tells us how much of the
												expected data is available
												across our entire database.
											</p>
											<p className="text-xs mt-1">
												It measures the percentage of
												fields that are filled in,
												compared to those that are
												missing. This helps us track
												progress as we work toward a
												more complete and comprehensive
												dataset.
											</p>
											<p className="font-bold mt-2">
												It is an estimate.
											</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</span>
						</CardTitle>
					</CardHeader>
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
							{totalCoveragePercent.toFixed(2)}%
						</span>
					</CardContent>
				</Card>
			</div>
		</TooltipProvider>
	);
}
