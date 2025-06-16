"use client";

import ModelCard from "./ModelCard";
import type { ExtendedModel } from "@/data/types";

interface ModelGridProps {
	filteredAndSortedModels: ExtendedModel[];
	sortedBenchmarks: any[];
	getCoveragePercentage: (model: ExtendedModel) => number;
	getUniqueCompletedBenchmarks: (model: ExtendedModel) => number;
	hasModelBenchmark: (model: ExtendedModel, benchmarkId: string) => boolean;
	getBenchmarkScore: (
		model: ExtendedModel,
		benchmarkId: string
	) => string | null;
	getScoreColorClass: (score: string | null) => string;
}

export default function ModelGrid({
	filteredAndSortedModels,
	sortedBenchmarks,
	getCoveragePercentage,
	getUniqueCompletedBenchmarks,
	hasModelBenchmark,
	getBenchmarkScore,
	getScoreColorClass,
}: ModelGridProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{filteredAndSortedModels.map((model) => (
				<ModelCard
					key={model.id}
					model={model}
					sortedBenchmarks={sortedBenchmarks}
					getCoveragePercentage={getCoveragePercentage}
					getUniqueCompletedBenchmarks={getUniqueCompletedBenchmarks}
					hasModelBenchmark={hasModelBenchmark}
					getBenchmarkScore={getBenchmarkScore}
					getScoreColorClass={getScoreColorClass}
				/>
			))}

			{filteredAndSortedModels.length === 0 && (
				<div className="p-8 text-center text-muted-foreground col-span-full">
					No models match your current filters
				</div>
			)}
		</div>
	);
}
