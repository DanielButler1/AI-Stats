import React from "react";
import Image from "next/image";
import { ExtendedModel } from "@/data/types";

import { ModelBenchmarksComparisonGrid } from "./ModelBenchmarksComparisonGrid";
import { ModelBenchmarksTable } from "./ModelBenchmarksTable";
import { ModelBenchmarksGrid } from "./ModelBenchmarksGrid";

// Extracted tooltip function

interface ModelBenchmarksComparisonProps {
	model: ExtendedModel;
	allModels: ExtendedModel[];
}

// Parse score function (same as ModelBenchmarkChart)
function parseScore(score: string | number): number | null {
	if (typeof score === "number") return score;
	if (typeof score === "string") {
		// Remove % and parse float
		const match = score.match(/([\d.]+)/);
		if (match) return parseFloat(match[1]);
	}
	return null;
}

export default function ModelBenchmarksComparison({
	model,
	allModels,
}: ModelBenchmarksComparisonProps) {
	// Prepare and combine benchmarks with the same name

	const rawBenchmarks = (model.benchmark_results || []).map((r: any) => {
		// Ensure self_reported is available on both the root and the benchmark object
		const bench = { ...r.benchmark };
		if (typeof r.is_self_reported !== "undefined") {
			bench.self_reported = r.is_self_reported;
		}
		return {
			benchmark_id: r.benchmark_id,
			benchmark: bench,
			score: parseScore(r.score),
			isPercentage: typeof r.score === "string" && r.score.includes("%"),
			other_info: r.other_info,
			source_link: r.source_link,
			is_self_reported: r.is_self_reported,
		};
	});

	// Group by benchmark name
	const grouped: Record<string, any[]> = {};
	rawBenchmarks.forEach((b) => {
		const name = b.benchmark?.name || "Unknown";
		if (!grouped[name]) grouped[name] = [];
		grouped[name].push(b);
	});

	// For chart, use the first score for each benchmark (for bar height), but keep all for tooltip
	const sortedBenchmarks = Object.entries(grouped)
		.map(([name, arr]) => {
			// For category and self_reported, aggregate all unique values as comma-separated
			const categories = Array.from(
				new Set(arr.map((x) => x.benchmark?.category).filter(Boolean))
			).join(", ");
			const selfReported = Array.from(
				new Set(
					arr.map((x) => (x.benchmark?.self_reported ? "Yes" : "No"))
				)
			).join(", ");
			// For score/max, try to show as score/max if max_score exists, else just score
			const scoreDisplay = arr
				.map((x) => {
					const score = x.score != null ? x.score.toFixed(2) : "-";
					const max = x.benchmark?.max_score;
					return max ? `${score}/${max}` : score;
				})
				.join(", ");
			return {
				benchmark_id: arr[0].benchmark_id,
				benchmark: arr[0].benchmark,
				score: arr[0].score,
				isPercentage: arr[0].isPercentage,
				other_info: arr[0].other_info,
				source_link: arr[0].source_link,
				allScores: arr,
				category: categories,
				self_reported: selfReported,
				scoreDisplay,
			};
		})
		.filter((b) => b.benchmark && b.benchmark.name);

	// Build a map: benchmark name -> number of models in allModels that have it
	const benchmarkModelCount: Record<string, number> = {};
	allModels.forEach((model) => {
		(model.benchmark_results || []).forEach((r: any) => {
			const name = r.benchmark?.name || "Unknown";
			if (!benchmarkModelCount[name]) benchmarkModelCount[name] = 0;
			benchmarkModelCount[name] += 1;
		});
	});

	// Sort for the grid: by number of models using the benchmark (descending), then alphabetically
	const sortedForGrid = [...sortedBenchmarks].sort((a, b) => {
		const aName = a.benchmark?.name || "";
		const bName = b.benchmark?.name || "";
		const aCount = benchmarkModelCount[aName] || 0;
		const bCount = benchmarkModelCount[bName] || 0;
		if (bCount !== aCount) return bCount - aCount;
		return aName.localeCompare(bName);
	});

	if (sortedBenchmarks.length === 0) {
		return (
			<div className="rounded-lg border border-dashed p-6 md:p-8 text-center bg-muted/30">
				<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
					<span className="text-xl">📊</span>
				</div>
				<p className="text-base font-medium">
					No benchmark data available yet
				</p>
				<p className="mt-1 text-sm text-muted-foreground">
					We&apos;re continuously adding benchmarks. Have benchmark
					scores to add?
				</p>
				<div className="mt-3">
					<a
						href="https://github.com/DanielButler1/AI-Stats"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
					>
						Contribute on GitHub
						<Image
							src="/social/github_light.svg"
							alt="GitHub Logo"
							width={16}
							height={16}
							className="inline dark:hidden"
						/>
						<Image
							src="/social/github_dark.svg"
							alt="GitHub Logo"
							width={16}
							height={16}
							className="hidden dark:inline"
						/>
					</a>
				</div>
			</div>
		);
	}

	// console.log("Sorted Grid Benchmarks:", sortedForGrid);

	return (
		<div className="w-full mx-auto mb-8">
			<section>
				<h2 className="text-xl font-semibold mb-2">
					Benchmarks & Performance
				</h2>
				<h3 className="text-lg font-medium mb-4">Benchmark Overview</h3>

				{/* Chart for current model */}
				{/* <ModelBenchmarksChart sortedBenchmarks={sortedBenchmarks} /> */}
				<ModelBenchmarksGrid
					sortedBenchmarks={sortedForGrid}
					allModels={allModels}
					currentModelId={model.id}
				/>

				<h3 className="text-lg font-medium mb-4">
					All Scores Achieved by {model.name}
				</h3>
				{/* Table of benchmark details */}
				<ModelBenchmarksTable grouped={grouped} />

				{/* Multi-model benchmark comparison grid */}
				<section className="mt-12">
					<h3 className="text-lg font-medium mb-4">
						Compare Across Models
					</h3>
					<ModelBenchmarksComparisonGrid
						model={model}
						allModels={allModels}
					/>
				</section>
			</section>
		</div>
	);
}
