import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface ModelBenchmarksGridProps {
	sortedBenchmarks: any[];
	allModels: any[];
	currentModelId: string;
}

export function ModelBenchmarksGrid(props: ModelBenchmarksGridProps) {
	const { sortedBenchmarks, allModels, currentModelId } = props;
	// Helper to get rank for a benchmark
	function getRank(
		benchmarkId: string,
		score: number,
		isPercentage: boolean,
		order: string | undefined
	) {
		if (!benchmarkId) return { rank: 0, total: 0 };
		// Gather all scores for this benchmark from all models
		const allScores = allModels
			.map((m) => {
				const results = (m.benchmark_results || []).filter((r: any) => {
					// Use benchmark_id for matching, fallback to name if missing
					if (r.benchmark_id && benchmarkId) {
						return (
							(r.benchmark_id || "").toLowerCase() ===
							(benchmarkId || "").toLowerCase()
						);
					}
					// fallback: match by name if id missing
					if (!r.benchmark_id && m.benchmark?.name && benchmarkId) {
						return (
							(m.benchmark?.name || "").toLowerCase() ===
							(benchmarkId || "").toLowerCase()
						);
					}
					return false;
				});
				if (!results.length) return null;
				// Use best score (lower or higher is better)
				const parsed = results
					.map((r: any) => {
						let s = r.score;
						if (typeof s === "string") {
							const match = s.match(/([\d.]+)/);
							s = match ? parseFloat(match[1]) : null;
						}
						return {
							score: s,
							isPercentage:
								typeof r.score === "string" &&
								r.score.includes("%"),
							modelId: m.id,
						};
					})
					.filter((r: any) => r.score !== null);
				if (!parsed.length) return null;
				// Pick best
				return parsed.reduce((a: any, b: any) => {
					if (order === "lower") return a.score < b.score ? a : b;
					return a.score > b.score ? a : b;
				});
			})
			.filter((x) => x !== null);
		// Sort
		const sorted = [...allScores].sort((a: any, b: any) => {
			if (order === "lower") return a.score - b.score;
			return b.score - a.score;
		});
		// Find rank of current model
		const idx = sorted.findIndex((x: any) => x.modelId === currentModelId);
		return { rank: idx + 1, total: sorted.length };
	}

	return (
		<div className="w-full mb-8">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
				{sortedBenchmarks.map((b: any, idx: number) => {
					let topScore, isPercentage, order, benchmarkId;
					if (b.allScores && b.allScores.length > 0) {
						const [first] = b.allScores;
						topScore = first.score;
						isPercentage = first.isPercentage;
						order = first.benchmark?.order;
						benchmarkId = first.benchmark_id || b.benchmark_id;
					} else {
						topScore = b.score;
						isPercentage = b.isPercentage;
						order = b.benchmark?.order;
						benchmarkId = b.benchmark_id;
					}
					const { rank } = getRank(
						benchmarkId,
						topScore,
						isPercentage,
						order
					);
					// Defensive: ensure rank is a valid number
					const safeRank =
						typeof rank === "number" && rank > 0 ? rank : "-";
					let rankColor =
						"bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
					if (safeRank === 1)
						rankColor = "bg-yellow-400 text-yellow-900";
					else if (safeRank === 2)
						rankColor = "bg-gray-300 text-gray-800";
					else if (safeRank === 3)
						rankColor = "bg-amber-700 text-amber-100";
					return (
						<Card
							key={idx}
							className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700 border-b-2 border-b-gray-300 dark:border-b-gray-600 p-2 flex flex-col justify-center min-h-0 "
							style={{ minHeight: 0 }}
						>
							<div className="flex flex-col gap-0.5 px-1 py-1">
								<div className="truncate font-semibold text-xs text-zinc-800 dark:text-zinc-100 leading-tight">
									<Link
										href={`/benchmarks/${b.benchmark_id}`}
									>
										<span className="truncate font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
											{b.benchmark?.name ||
												"Unnamed Benchmark"}
										</span>
									</Link>
								</div>
								<div className="flex items-center justify-between text-base font-mono">
									<span>
										{topScore !== undefined &&
										topScore !== null
											? topScore.toFixed(2)
											: "-"}
										{isPercentage ? "%" : ""}
									</span>
									<span
										className={`ml-2 px-2 py-0.5 rounded font-bold text-xs ${rankColor}`}
										style={{
											minWidth: 36,
											textAlign: "center",
										}}
									>
										#{safeRank}
									</span>
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
