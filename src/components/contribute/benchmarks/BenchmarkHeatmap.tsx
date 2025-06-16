"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ExtendedModel } from "@/data/types";
import BenchmarkHeatmapHeader from "./BenchmarkHeatmapHeader";
import BenchmarkHeatmapControls from "./BenchmarkHeatmapControls";
import ModelGrid from "./ModelGrid";
import BenchmarkGrid from "./BenchmarkGrid";
import {
	getUniqueCompletedBenchmarks,
	getModelsCompletingBenchmark,
	getCoveragePercentage,
	getModelCoveragePercentage,
	hasModelBenchmark,
	getBenchmarkScore,
	getScoreColorClass,
} from "./benchmarkUtils";

interface BenchmarkHeatmapProps {
	models: ExtendedModel[];
	allBenchmarks: any[];
}

// Define view mode type
type ViewMode = "BENCHMARK" | "MODEL";

export default function BenchmarkHeatmap({
	models,
	allBenchmarks,
}: BenchmarkHeatmapProps) {
	// State for view mode
	const [viewMode, setViewMode] = useState<ViewMode>("BENCHMARK");
	// State for search query
	const [searchQuery, setSearchQuery] = useState("");
	// State for sort method (model view)
	const [modelSortMethod, setModelSortMethod] = useState<
		"coverage-asc" | "coverage-desc" | "name"
	>("coverage-desc");
	// State for sort method (benchmark view)
	const [benchmarkSortMethod, setBenchmarkSortMethod] = useState<
		"coverage-asc" | "coverage-desc" | "name"
	>("coverage-desc");

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

			if (modelSortMethod === "coverage-asc") {
				if (coveragePercentA !== coveragePercentB) {
					return coveragePercentA - coveragePercentB;
				} else {
					// Always secondary sort: newest release first
					return getDateValue(b) - getDateValue(a);
				}
			}
			if (modelSortMethod === "coverage-desc") {
				if (coveragePercentA !== coveragePercentB) {
					return coveragePercentB - coveragePercentA;
				} else {
					// Always secondary sort: newest release first
					return getDateValue(b) - getDateValue(a);
				}
			}
			if (modelSortMethod === "name") {
				const nameCompare = a.name.localeCompare(b.name);
				if (nameCompare !== 0) return nameCompare;
				// Secondary sort: newest release first
				return getDateValue(b) - getDateValue(a);
			}
			return getDateValue(b) - getDateValue(a);
		});
	}, [models, searchQuery, modelSortMethod, sortedBenchmarks.length]);

	// Filter and sort benchmarks based on search query and sort method
	const filteredAndSortedBenchmarks = useMemo(() => {
		let filtered = [...allBenchmarks];

		// Apply search filter for benchmark names
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter((benchmark) =>
				benchmark.name.toLowerCase().includes(query)
			);
		}

		// Apply sorting
		return filtered.sort((a, b) => {
			const coverageA = getModelsCompletingBenchmark(a.id, models);
			const coverageB = getModelsCompletingBenchmark(b.id, models);
			const coveragePercentA = models.length
				? Math.round((coverageA / models.length) * 100)
				: 0;
			const coveragePercentB = models.length
				? Math.round((coverageB / models.length) * 100)
				: 0;

			if (benchmarkSortMethod === "coverage-asc") {
				if (coveragePercentA !== coveragePercentB) {
					return coveragePercentA - coveragePercentB;
				} else {
					// Secondary sort: alphabetically by name
					return a.name.localeCompare(b.name);
				}
			}
			if (benchmarkSortMethod === "coverage-desc") {
				if (coveragePercentA !== coveragePercentB) {
					return coveragePercentB - coveragePercentA;
				} else {
					// Secondary sort: alphabetically by name
					return a.name.localeCompare(b.name);
				}
			}
			if (benchmarkSortMethod === "name") {
				return a.name.localeCompare(b.name);
			}
			return 0;
		});
	}, [allBenchmarks, models, searchQuery, benchmarkSortMethod]);

	return (
		<TooltipProvider>
			<div className="space-y-6">
				<Card>
					<CardHeader className="pb-3">
						<BenchmarkHeatmapHeader
							viewMode={viewMode}
							setViewMode={setViewMode}
							filteredAndSortedModels={filteredAndSortedModels}
							filteredAndSortedBenchmarks={
								filteredAndSortedBenchmarks
							}
							sortedBenchmarks={sortedBenchmarks}
							models={models}
						/>
					</CardHeader>

					<CardContent>
						<BenchmarkHeatmapControls
							viewMode={viewMode}
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
							modelSortMethod={modelSortMethod}
							setModelSortMethod={setModelSortMethod}
							benchmarkSortMethod={benchmarkSortMethod}
							setBenchmarkSortMethod={setBenchmarkSortMethod}
						/>

						{/* MODEL VIEW: Card Grid */}
						{viewMode === "MODEL" && (
							<ModelGrid
								filteredAndSortedModels={
									filteredAndSortedModels
								}
								sortedBenchmarks={sortedBenchmarks}
								getCoveragePercentage={(model) =>
									getCoveragePercentage(
										model,
										sortedBenchmarks.length
									)
								}
								getUniqueCompletedBenchmarks={
									getUniqueCompletedBenchmarks
								}
								hasModelBenchmark={hasModelBenchmark}
								getBenchmarkScore={getBenchmarkScore}
								getScoreColorClass={getScoreColorClass}
							/>
						)}

						{/* BENCHMARK VIEW: Card Grid */}
						{viewMode === "BENCHMARK" && (
							<BenchmarkGrid
								filteredAndSortedBenchmarks={
									filteredAndSortedBenchmarks
								}
								models={models}
								getModelCoveragePercentage={(benchmarkId) =>
									getModelCoveragePercentage(
										benchmarkId,
										models
									)
								}
								getModelsCompletingBenchmark={(benchmarkId) =>
									getModelsCompletingBenchmark(
										benchmarkId,
										models
									)
								}
								hasModelBenchmark={hasModelBenchmark}
								getBenchmarkScore={getBenchmarkScore}
								getScoreColorClass={getScoreColorClass}
							/>
						)}
					</CardContent>
				</Card>
			</div>
		</TooltipProvider>
	);
}
