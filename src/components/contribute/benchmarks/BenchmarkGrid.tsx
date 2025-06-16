"use client";

import BenchmarkCard from "./BenchmarkCard";
import type { ExtendedModel } from "@/data/types";

interface BenchmarkGridProps {
	filteredAndSortedBenchmarks: any[];
	models: ExtendedModel[];
	getModelCoveragePercentage: (benchmarkId: string) => number;
	getModelsCompletingBenchmark: (benchmarkId: string) => number;
	hasModelBenchmark: (model: ExtendedModel, benchmarkId: string) => boolean;
	getBenchmarkScore: (
		model: ExtendedModel,
		benchmarkId: string
	) => string | null;
	getScoreColorClass: (score: string | null) => string;
}

export default function BenchmarkGrid({
	filteredAndSortedBenchmarks,
	models,
	getModelCoveragePercentage,
	getModelsCompletingBenchmark,
	hasModelBenchmark,
	getBenchmarkScore,
	getScoreColorClass,
}: BenchmarkGridProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{filteredAndSortedBenchmarks.map((benchmark) => (
				<BenchmarkCard
					key={benchmark.id}
					benchmark={benchmark}
					models={models}
					getModelCoveragePercentage={getModelCoveragePercentage}
					getModelsCompletingBenchmark={getModelsCompletingBenchmark}
					hasModelBenchmark={hasModelBenchmark}
					getBenchmarkScore={getBenchmarkScore}
					getScoreColorClass={getScoreColorClass}
				/>
			))}

			{filteredAndSortedBenchmarks.length === 0 && (
				<div className="p-8 text-center text-muted-foreground col-span-full">
					No benchmarks match your current filters
				</div>
			)}
		</div>
	);
}
