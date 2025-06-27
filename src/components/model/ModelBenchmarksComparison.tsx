// ModelBenchmarksComparison.tsx
"use client";

import React from "react";
import { ExtendedModel } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { BenchmarkDialog } from "./BenchmarkDialog";
import { Expand } from "lucide-react";
import Link from "next/link";

interface BenchmarkPayload {
	modelName: string;
	provider: string;
	score: number;
	benchmarkId: string;
	isCurrent: boolean;
	fill: string;
	isPercentage: boolean;
}

type TooltipProps = {
	active?: boolean;
	payload?: any[];
	label?: string;
};

// Extracted tooltip function
function BenchmarkTooltip({
	active,
	payload,
	showAllVariants,
}: TooltipProps & { showAllVariants?: boolean }) {
	if (!active || !payload || !payload.length) return null;
	const d = payload[0].payload as BenchmarkPayload & { allResults?: any[] };
	return (
		<Card className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-3 border border-zinc-200 dark:border-zinc-800 min-w-[180px]">
			<CardHeader className="p-0 pb-2">
				<CardTitle className="font-semibold text-sm mb-1">
					{d.modelName}
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<div className="text-xs text-muted-foreground mb-1">
					{d.provider}
				</div>
				{showAllVariants && d.allResults && d.allResults.length > 1 ? (
					<div className="space-y-1">
						{d.allResults.map((r, i) => (
							<div key={i} className="flex items-center gap-2">
								<span className="font-mono text-base">
									{r.score.toFixed(2)}
									{r.isPercentage ? "%" : ""}
								</span>
								{r.other_info && (
									<span className="text-xs text-zinc-500">
										({r.other_info})
									</span>
								)}
							</div>
						))}
					</div>
				) : (
					<div className="font-mono text-base">
						{d.score.toFixed(2) + (d.isPercentage ? "%" : "")}
					</div>
				)}
				{d.isCurrent && (
					<div className="mt-1 text-xs text-indigo-600 font-bold">
						Selected Model
					</div>
				)}
			</CardContent>
		</Card>
	);
}

interface ModelBenchmarksComparisonProps {
	model: ExtendedModel;
	allModels: ExtendedModel[];
}

// Type guard for EnrichedBenchmarkResult
function isEnrichedBenchmarkResult(
	b: any
): b is { benchmark: { name: string }; benchmark_id: string } {
	return (
		b &&
		typeof b === "object" &&
		b.benchmark &&
		typeof b.benchmark.name === "string"
	);
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
	// Get benchmarks that the current model has scores for
	const currentModelBenchmarkIds = (model.benchmark_results || []).map(
		(r: any) => r.benchmark_id.toLowerCase()
	);

	// Group all benchmark results by benchmark_id
	const allBenchmarkResults = allModels.flatMap((m) =>
		(m.benchmark_results || []).map((r: any) => ({ ...r, model: m }))
	);

	// Filter to only include benchmarks that the current model has scores for
	const uniqueBenchmarks = Array.from(
		new Map(
			allBenchmarkResults
				.filter((r) =>
					currentModelBenchmarkIds.includes(
						r.benchmark_id.toLowerCase()
					)
				)
				.map((r) => [r.benchmark_id.toLowerCase(), r])
		).values()
	);

	// Add AI Stats Score as a synthetic benchmark
	const aiStatsBenchmark = {
		benchmark_id: "ai-stats-score",
		benchmark: {
			name: "AI Stats Score",
			description: "AI Stats score derived from Glicko rating",
		},
		score: model.glickoRating?.rating || 0,
		is_self_reported: false,
		source_link: null,
		model: model,
	};

	// Add AI Stats Score to uniqueBenchmarks if the model has a glicko rating
	if (model.glickoRating) {
		uniqueBenchmarks.push(aiStatsBenchmark);
	}

	// Sort benchmarks alphabetically by name
	const sortedBenchmarks = uniqueBenchmarks.sort((a, b) => {
		const nameA = isEnrichedBenchmarkResult(a)
			? a.benchmark.name
			: a.benchmark_id;
		const nameB = isEnrichedBenchmarkResult(b)
			? b.benchmark.name
			: b.benchmark_id;
		return nameA.localeCompare(nameB);
	});

	const [dialogOpen, setDialogOpen] = React.useState<string | null>(null);

	if (sortedBenchmarks.length === 0) {
		return null;
	}

	return (
		<div className="space-y-8 mt-8">
			<Card className="shadow-lg">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						Benchmarks & Performance Comparison
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{sortedBenchmarks.map((benchmark) => {
							const benchmarkId =
								benchmark.benchmark_id || "unknown";
							const benchmarkName = isEnrichedBenchmarkResult(
								benchmark
							)
								? benchmark.benchmark.name
								: benchmark.benchmark_id || "unknown";

							// Handle AI Stats Score differently since it's using glicko rating
							const isAiStatsScore =
								benchmarkId === "ai-stats-score";

							// Check if this benchmark prefers lower scores
							const isLowerBetter =
								benchmark.benchmark &&
								benchmark.benchmark.order === "lower";

							// For each model, collect all results for this benchmark
							const modelsWithThisBenchmark = allModels
								.map((m) => {
									if (isAiStatsScore) {
										if (!m.glickoRating) return null;
										return {
											modelName: m.name,
											provider: m.provider.name,
											score: m.glickoRating.rating,
											benchmarkId: benchmarkId,
											isCurrent: m.id === model.id,
											fill:
												m.provider.colour || "#6366f1",
											isPercentage: false,
											allResults: [
												{
													score: m.glickoRating
														.rating,
													isPercentage: false,
													other_info: `RD: ${m.glickoRating.rd.toFixed(
														2
													)}`,
													source_link: null,
												},
											],
										};
									}

									const results = (
										m.benchmark_results || []
									).filter(
										(b: any) =>
											b.benchmark_id.toLowerCase() ===
											benchmarkId.toLowerCase()
									);
									if (!results.length) return null;

									// For chart: pick the best score (highest or lowest depending on order)
									const parsedResults = results.map(
										(result: any) => {
											const score = parseScore(
												result.score
											);
											const isPercentage =
												typeof result.score ===
													"string" &&
												result.score.includes("%");
											return {
												score,
												isPercentage,
												other_info: result.other_info,
												source_link: result.source_link,
											};
										}
									);

									// Filter out null scores
									const validResults = parsedResults.filter(
										(r) => r.score !== null
									);

									const best =
										validResults.length > 0
											? validResults.reduce(
													(a, b) =>
														isLowerBetter
															? (a.score as number) <
															  (b.score as number)
																? a
																: b
															: (a.score as number) >
															  (b.score as number)
															? a
															: b,
													validResults[0]
											  )
											: null;

									if (best === null) return null;

									return {
										modelName: m.name,
										provider: m.provider.name,
										score: best.score as number,
										benchmarkId: benchmarkId,
										isCurrent: m.id === model.id,
										fill: m.provider.colour || "#6366f1",
										isPercentage: best.isPercentage,
										allResults: validResults,
									} satisfies BenchmarkPayload & {
										allResults: any[];
									};
								})
								.filter(
									(
										m
									): m is BenchmarkPayload & {
										allResults: any[];
									} => m !== null
								)
								.sort((a, b) =>
									isLowerBetter
										? a.score - b.score
										: b.score - a.score
								);

							const currentIdx =
								modelsWithThisBenchmark.findIndex(
									(m) => m.isCurrent
								);
							const current = modelsWithThisBenchmark[currentIdx];

							return (
								<div key={benchmarkId}>
									<Card className="shadow border-none flex flex-col justify-between relative transition-all dark:bg-zinc-950 dark:border-zinc-800">
										<button
											type="button"
											className="absolute top-3 right-3 z-10 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none hidden md:block"
											onClick={() =>
												setDialogOpen(benchmarkId)
											}
											title="Expand benchmark comparison"
										>
											<Expand className="w-5 h-5 text-zinc-500 hover:text-indigo-600" />
										</button>{" "}
										<CardHeader className="pb-2">
											<CardTitle className="text-base font-semibold flex items-center gap-2">
												<Link
													href={`/benchmarks/${benchmarkId}`}
													className="hover:underline text-primary"
												>
													{benchmarkName}
												</Link>
												<Badge variant="secondary">
													{current
														? current.score.toFixed(
																2
														  ) +
														  (current.isPercentage
																? "%"
																: "")
														: "-"}
												</Badge>
												{isLowerBetter && (
													<Badge
														variant="outline"
														className="ml-1 text-xs text-blue-600 border-blue-400"
													>
														Lower is better
													</Badge>
												)}
												{currentIdx !== -1 && (
													<Badge variant="outline">
														#{currentIdx + 1}/
														{
															modelsWithThisBenchmark.length
														}
													</Badge>
												)}
											</CardTitle>
										</CardHeader>
										<CardContent className="p-0">
											<ResponsiveContainer
												width="100%"
												height={200}
											>
												<BarChart
													data={(() => {
														const idx =
															modelsWithThisBenchmark.findIndex(
																(m) =>
																	m.isCurrent
															);
														const start = Math.max(
															0,
															idx - 5
														);
														const end = Math.min(
															modelsWithThisBenchmark.length,
															idx + 6
														);
														return modelsWithThisBenchmark.slice(
															start,
															end
														);
													})()}
													layout="horizontal"
													margin={{
														top: 0,
														right: 0,
														left: 0,
														bottom: 0,
													}}
												>
													{" "}
													<XAxis
														dataKey="modelName"
														tick={false}
														axisLine={true}
													/>
													<YAxis
														type="number"
														domain={(() => {
															const scores =
																modelsWithThisBenchmark.map(
																	(m) =>
																		m.score
																);
															if (!scores.length)
																return isLowerBetter
																	? [100, 0]
																	: [0, 100];
															const min =
																Math.min(
																	...scores
																);
															const max =
																Math.max(
																	...scores
																);
															const range =
																max - min || 1;
															const pad =
																range * 0.1;
															const lower =
																Math.max(
																	0,
																	Math.floor(
																		min -
																			pad
																	)
																); // Ensure min is 0
															const upper =
																Math.ceil(
																	max + pad
																);
															if (isLowerBetter) {
																return [
																	upper,
																	lower,
																];
															} else {
																return [
																	lower,
																	upper,
																];
															}
														})()}
														tickFormatter={(
															value
														) => {
															const scores =
																modelsWithThisBenchmark.map(
																	(m) =>
																		m.score
																);
															const min =
																Math.min(
																	...scores
																);
															const max =
																Math.max(
																	...scores
																);
															const range =
																max - min || 1;
															if (range < 1) {
																return value.toFixed(
																	2
																);
															} else if (
																range < 10
															) {
																return value.toFixed(
																	1
																);
															} else {
																return Math.round(
																	value
																).toString();
															}
														}}
													/>
													<Tooltip
														content={
															<BenchmarkTooltip
																showAllVariants={
																	true
																}
															/>
														}
													/>
													<Bar
														dataKey="score"
														isAnimationActive={
															false
														}
														barSize={18}
														fill="#6366f1"
														shape={(props: any) => {
															const {
																x,
																y,
																width,
																height,
																fill,
																payload,
															} = props;
															return (
																<g>
																	<rect
																		x={x}
																		y={y}
																		width={
																			width
																		}
																		height={
																			height
																		}
																		fill={
																			fill
																		}
																		stroke={
																			payload.isCurrent
																				? "#ff0000"
																				: undefined
																		}
																		strokeWidth={
																			payload.isCurrent
																				? 4
																				: 0
																		}
																		rx={4}
																	/>
																</g>
															);
														}}
													/>
												</BarChart>
											</ResponsiveContainer>
										</CardContent>
									</Card>
									<BenchmarkDialog
										open={dialogOpen === benchmarkId}
										onOpenChange={(open) =>
											setDialogOpen(
												open ? benchmarkId : null
											)
										}
										benchmarkName={benchmarkName}
										modelsWithThisBenchmark={
											modelsWithThisBenchmark
										}
										currentIdx={currentIdx}
										current={current}
									/>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
