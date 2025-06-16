"use client";

import { CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ExtendedModel } from "@/data/types";

type ViewMode = "BENCHMARK" | "MODEL";

interface BenchmarkHeatmapHeaderProps {
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;
	filteredAndSortedModels: ExtendedModel[];
	filteredAndSortedBenchmarks: any[];
	sortedBenchmarks: any[];
	models: ExtendedModel[];
}

export default function BenchmarkHeatmapHeader({
	viewMode,
	setViewMode,
	filteredAndSortedModels,
	filteredAndSortedBenchmarks,
	sortedBenchmarks,
	models,
}: BenchmarkHeatmapHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<CardTitle className="text-lg font-semibold">
				Benchmark Coverage
				<span className="text-muted-foreground ml-2 text-sm font-normal">
					{viewMode === "MODEL" ? (
						<>
							{filteredAndSortedModels.length} models,{" "}
							{sortedBenchmarks.length} benchmarks
						</>
					) : (
						<>
							{filteredAndSortedBenchmarks.length} benchmarks,{" "}
							{
								models.filter((m) => m.status !== "Rumoured")
									.length
							}{" "}
							models
						</>
					)}
				</span>
			</CardTitle>

			{/* View mode toggle */}
			<Tabs
				value={viewMode}
				onValueChange={(value) => setViewMode(value as ViewMode)}
				className="ml-auto mr-2"
			>
				<TabsList>
					<TabsTrigger value="BENCHMARK">Benchmark View</TabsTrigger>
					<TabsTrigger value="MODEL">Model View</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	);
}
