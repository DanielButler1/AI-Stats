import React from "react";
import { ExtendedModel } from "@/data/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Check, Star, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import Link from "next/link";

interface ComparisonTableProps {
	selectedModels: ExtendedModel[];
}

// Helper functions to get prices
function getModelPrices(model: ExtendedModel) {
	if (!model.prices || model.prices.length === 0) return null;
	// For now, just use the first pricing entry
	// TODO: Allow selecting specific API provider pricing if multiple exist
	return model.prices[0];
}

function getInputPrice(model: ExtendedModel): number | null {
	const prices = getModelPrices(model);
	return prices?.input_token_price ?? null;
}

function getOutputPrice(model: ExtendedModel): number | null {
	const prices = getModelPrices(model);
	return prices?.output_token_price ?? null;
}

function getLatency(model: ExtendedModel): number | string | null {
	const prices = getModelPrices(model);
	const latency = prices?.latency;
	if (latency === null || latency === undefined || latency === "")
		return null;
	return typeof latency === "string" ? parseFloat(latency) : latency;
}

function getThroughput(model: ExtendedModel): number | null {
	const prices = getModelPrices(model);
	const throughput = prices?.throughput;
	if (throughput === null || throughput === undefined || throughput === "")
		return null;
	return typeof throughput === "string" ? parseFloat(throughput) : throughput;
}

// Helper to map benchmark names to ids
function getBenchmarkNameToIdMap(
	selectedModels: ExtendedModel[]
): Record<string, string> {
	const map: Record<string, string> = {};
	selectedModels.forEach((model) => {
		(model.benchmark_results || []).forEach((b) => {
			if (b.benchmark && b.benchmark.name && b.benchmark.id) {
				map[b.benchmark.name] = b.benchmark.id;
			}
		});
	});
	return map;
}

export default function ComparisonTable({
	selectedModels,
}: ComparisonTableProps) {
	if (!selectedModels || selectedModels.length === 0) return null;

	// Get all unique benchmark names across all models
	const allBenchmarks = Array.from(
		new Set(
			selectedModels.flatMap(
				(model) =>
					model.benchmark_results?.map((b) => b.benchmark.name) || []
			)
		)
	).sort();

	const benchmarkNameToId = getBenchmarkNameToIdMap(selectedModels);

	// Helper function to find the best (lowest) price
	const findBestPrice = (metric: "input" | "output") => {
		const prices = selectedModels
			.map((model) =>
				metric === "input"
					? getInputPrice(model)
					: getOutputPrice(model)
			)
			.filter((price) => price !== null) as number[];
		return prices.length > 0 ? Math.min(...prices) : null;
	};

	// Helper function to find the best latency and throughput
	const findBestMetric = (metric: "latency" | "throughput") => {
		const values = selectedModels
			.map((model) =>
				metric === "latency" ? getLatency(model) : getThroughput(model)
			)
			.filter((value) => value !== null) as number[];
		return values.length > 0
			? metric === "latency"
				? Math.min(...values)
				: Math.max(...values)
			: null;
	};

	// Get best values
	const bestInputPrice = findBestPrice("input");
	const bestOutputPrice = findBestPrice("output");
	const bestLatency = findBestMetric("latency");
	const bestThroughput = findBestMetric("throughput");

	return (
		<>
			{/* Desktop Table View */}
			<div className="hidden md:block">
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Model Comparison</CardTitle>
					</CardHeader>
					<CardContent className="max-h-[800px] overflow-auto relative">
						<Table className="table-fixed relative">
							<TableHeader className="sticky top-0 bg-white dark:bg-zinc-950 z-20 shadow-sm">
								<TableRow>
									<TableHead className="w-[200px] bg-white dark:bg-zinc-950 sticky left-0 z-30" />
									{selectedModels.map((model) => (
										<TableHead
											key={model.id}
											className="text-center bg-white dark:bg-zinc-950"
											style={{
												width: `calc((100% - 200px) / ${selectedModels.length})`,
											}}
										>
											<div className="flex items-center gap-3 justify-center mb-4">
												<Link
													href={`/organisations/${model.provider.provider_id}`}
													className="focus:outline-none"
												>
													<Logo
														id={model.provider.provider_id}
														alt={model.provider.name}
														width={32}
														height={32}
														className="h-8 w-8 rounded-full border bg-white object-contain"
													/>
												</Link>
												<div className="flex flex-col items-start">
													<Link
														href={`/models/${model.id}`}
														className="group"
													>
														<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full font-medium text-black">
															{model.name}
														</span>
													</Link>
													<Link
														href={`/organisations/${model.provider.provider_id}`}
														className="group text-xs text-muted-foreground"
													>
														<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
															{
																model.provider
																	.name
															}
														</span>
													</Link>
												</div>
											</div>
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{/* General Info Section */}
								<TableRow className="bg-zinc-100/50 dark:bg-zinc-800/50">
									<TableCell
										colSpan={selectedModels.length + 1}
										className="font-semibold sticky left-0 bg-zinc-100/50 dark:bg-zinc-800/50 z-10"
									>
										General Information
									</TableCell>
								</TableRow>

								{/* Context Window */}
								<TableRow>
									<TableCell className="font-medium sticky left-0 bg-white dark:bg-zinc-950 z-10">
										Context Window
									</TableCell>
									{selectedModels.map((model) => (
										<TableCell
											key={model.id}
											className="text-center"
										>
											Input:{" "}
											{model.input_context_length?.toLocaleString() ||
												"-"}
											<br />
											Output:{" "}
											{model.output_context_length?.toLocaleString() ||
												"-"}
										</TableCell>
									))}
								</TableRow>

								{/* Multimodal */}
								<TableRow>
									<TableCell className="font-medium sticky left-0 bg-white dark:bg-zinc-950 z-10">
										Multimodal
									</TableCell>
									{selectedModels.map((model) => (
										<TableCell
											key={model.id}
											className="text-center"
										>
											{model.multimodal ? (
												<Check className="mx-auto" />
											) : (
												<X className="mx-auto" />
											)}
										</TableCell>
									))}
								</TableRow>

								{/* Parameters */}
								<TableRow>
									<TableCell className="font-medium sticky left-0 bg-white dark:bg-zinc-950 z-10">
										Parameters
									</TableCell>
									{selectedModels.map((model) => (
										<TableCell
											key={model.id}
											className="text-center"
										>
											{model.parameter_count
												? `${(
														model.parameter_count /
														1e9
												  ).toFixed(1)}B`
												: "-"}
										</TableCell>
									))}
								</TableRow>

								{/* Training Tokens */}
								<TableRow>
									<TableCell className="font-medium sticky left-0 bg-white dark:bg-zinc-950 z-10">
										Training Tokens
									</TableCell>
									{selectedModels.map((model) => (
										<TableCell
											key={model.id}
											className="text-center"
										>
											{model.training_tokens
												? `${(
														model.training_tokens /
														1e12
												  ).toFixed(1)}T`
												: "-"}
										</TableCell>
									))}
								</TableRow>

								{/* License */}
								<TableRow>
									<TableCell className="font-medium sticky left-0 bg-white dark:bg-zinc-950 z-10">
										License
									</TableCell>
									{selectedModels.map((model) => (
										<TableCell
											key={model.id}
											className="text-center"
										>
											{model.license || "-"}
										</TableCell>
									))}
								</TableRow>

								{/* Knowledge Cutoff */}
								<TableRow>
									<TableCell className="font-medium sticky left-0 bg-white dark:bg-zinc-950 z-10">
										Knowledge Cutoff
									</TableCell>
									{selectedModels.map((model) => (
										<TableCell
											key={model.id}
											className="text-center"
										>
											{model.knowledge_cutoff
												? new Date(
														model.knowledge_cutoff
												  ).toLocaleString("en-US", {
														month: "short",
														year: "numeric",
												  })
												: "-"}
										</TableCell>
									))}
								</TableRow>

								{/* Operational Metrics Section */}
								<TableRow className="bg-zinc-100/50 dark:bg-zinc-800/50">
									<TableCell
										colSpan={selectedModels.length + 1}
										className="font-semibold sticky left-0 bg-zinc-100/50 dark:bg-zinc-800/50 z-10"
									>
										Operational Metrics
									</TableCell>
								</TableRow>

								{/* Cost per 1M Tokens */}
								<TableRow>
									<TableCell className="font-medium sticky left-0 bg-white dark:bg-zinc-950 z-10">
										Cost per 1M Tokens
									</TableCell>
									{selectedModels.map((model) => {
										const inputPrice = getInputPrice(model);
										const outputPrice =
											getOutputPrice(model);
										return (
											<TableCell
												key={model.id}
												className="text-center"
											>
												<div className="flex items-center justify-center gap-1">
													Input:{" "}
													{inputPrice !== null
														? `$${(
																inputPrice *
																1_000_000
														  ).toFixed(2)}`
														: "-"}
													{inputPrice ===
														bestInputPrice &&
														bestInputPrice !==
															null && (
															<Star className="h-4 w-4 text-pink-400 fill-pink-400" />
														)}
												</div>
												<div className="flex items-center justify-center gap-1">
													Output:{" "}
													{outputPrice !== null
														? `$${(
																outputPrice *
																1_000_000
														  ).toFixed(2)}`
														: "-"}
													{outputPrice ===
														bestOutputPrice &&
														bestOutputPrice !==
															null && (
															<Star className="h-4 w-4 text-pink-400 fill-pink-400" />
														)}
												</div>
											</TableCell>
										);
									})}
								</TableRow>

								{/* Latency */}
								<TableRow>
									<TableCell className="font-medium sticky left-0 bg-white dark:bg-zinc-950 z-10">
										Latency
									</TableCell>
									{selectedModels.map((model) => {
										const latency = getLatency(model);
										return (
											<TableCell
												key={model.id}
												className="text-center"
											>
												<div className="flex items-center justify-center gap-1">
													{latency !== null &&
													latency !== undefined
														? `${latency}ms`
														: "-"}
													{latency === bestLatency &&
														bestLatency !==
															null && (
															<Star className="h-4 w-4 text-pink-400 fill-pink-400" />
														)}
												</div>
											</TableCell>
										);
									})}
								</TableRow>

								{/* Throughput */}
								<TableRow>
									<TableCell className="font-medium sticky left-0 bg-white dark:bg-zinc-950 z-10">
										Throughput
									</TableCell>
									{selectedModels.map((model) => {
										const throughput = getThroughput(model);
										return (
											<TableCell
												key={model.id}
												className="text-center"
											>
												<div className="flex items-center justify-center gap-1">
													{throughput !== null &&
													throughput !== undefined
														? `${throughput} tokens/s`
														: "-"}
													{throughput ===
														bestThroughput &&
														bestThroughput !==
															null && (
															<Star className="h-4 w-4 text-pink-400 fill-pink-400" />
														)}
												</div>
											</TableCell>
										);
									})}
								</TableRow>

								{/* Benchmarks Section */}
								<TableRow className="bg-zinc-100/50 dark:bg-zinc-800/50">
									<TableCell
										colSpan={selectedModels.length + 1}
										className="font-semibold sticky left-0 bg-zinc-100/50 dark:bg-zinc-800/50 z-10"
									>
										Benchmarks
									</TableCell>
								</TableRow>

								{/* Dynamic Benchmark Scores */}
								{allBenchmarks.map((benchmarkName) => {
									// Gather all scores and check if any score is a string with a %
									const rawScores = selectedModels.map(
										(model) => {
											const score =
												model.benchmark_results?.find(
													(b) =>
														b.benchmark.name ===
														benchmarkName
												)?.score;
											return score;
										}
									);

									const isPercent = rawScores.some(
										(score) =>
											typeof score === "string" &&
											String(score).trim().endsWith("%")
									);

									// Parse all scores to numbers (strip % if needed)
									const scores = rawScores.map((score) => {
										if (
											score === undefined ||
											score === null
										)
											return null;
										if (typeof score === "string") {
											const s = score.trim();
											if (s.endsWith("%"))
												return parseFloat(
													s.replace("%", "")
												);
											return parseFloat(s);
										}
										return score;
									});

									// Find the best score (max for both % and numeric)
									const validScores = scores.filter(
										(s) =>
											typeof s === "number" && !isNaN(s)
									) as number[];
									const bestScore =
										validScores.length > 0
											? Math.max(...validScores)
											: null;

									return (
										<TableRow key={benchmarkName}>
											<TableCell className="font-medium sticky left-0 bg-white dark:bg-zinc-950 z-10">
												{benchmarkNameToId[
													benchmarkName
												] ? (
													<Link
														href={`/benchmarks/${encodeURIComponent(
															benchmarkNameToId[
																benchmarkName
															]
														)}`}
														className="group"
													>
														<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
															{benchmarkName}
														</span>
													</Link>
												) : (
													<span>{benchmarkName}</span>
												)}
											</TableCell>
											{selectedModels.map(
												(model, idx) => {
													const numericScore =
														scores[idx];
													const hasScore =
														numericScore !== null &&
														!isNaN(
															Number(numericScore)
														);
													// Only normalise to 100% if NOT percent-based
													const percentOfBest =
														!isPercent &&
														bestScore &&
														hasScore
															? (numericScore /
																	bestScore) *
															  100
															: isPercent &&
															  hasScore
															? numericScore
															: 0;

													return (
														<TableCell
															key={model.id}
															className="text-center"
														>
															{hasScore ? (
																<div className="flex items-center gap-2">
																	<div className="flex-grow">
																		<Progress
																			value={
																				isPercent
																					? numericScore
																					: percentOfBest
																			}
																			className={cn(
																				"h-2 w-full",
																				numericScore ===
																					bestScore
																					? "[&>div]:bg-pink-400"
																					: "[&>div]:bg-zinc-200 dark:[&>div]:bg-zinc-700"
																			)}
																		/>
																	</div>
																	<span
																		className={cn(
																			"text-sm tabular-nums",
																			numericScore ===
																				bestScore
																				? "text-pink-500 dark:text-pink-400 font-medium"
																				: "text-zinc-500 dark:text-zinc-400"
																		)}
																	>
																		{isPercent
																			? `${numericScore.toFixed(
																					2
																			  )}%`
																			: numericScore.toLocaleString(
																					undefined,
																					{
																						maximumFractionDigits: 2,
																					}
																			  )}
																	</span>
																</div>
															) : (
																"-"
															)}
														</TableCell>
													);
												}
											)}
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>

			{/* Mobile Cards View */}
			<div className="md:hidden space-y-4">
				{selectedModels.map((model) => {
					const inputPrice = getInputPrice(model);
					const outputPrice = getOutputPrice(model);
					const latency = getLatency(model);
					const throughput = getThroughput(model);
					return (
						<Card key={model.id}>
							<CardHeader>
								<div className="flex items-center gap-3">
									<Link
										href={`/organisations/${model.provider.provider_id}`}
										className="focus:outline-none"
									>
										<Logo
											id={model.provider.provider_id}
											alt={model.provider.name}
											width={32}
											height={32}
											className="h-8 w-8 rounded-full border bg-white object-contain"
										/>
									</Link>
									<div className="flex flex-col">
										<Link
											href={`/models/${model.id}`}
											className="font-medium hover:underline focus:outline-none"
										>
											{model.name}
										</Link>
										<Link
											href={`/organisations/${model.provider.provider_id}`}
											className="text-xs text-muted-foreground hover:underline focus:outline-none"
										>
											{model.provider.name}
										</Link>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<h3 className="font-semibold">
									General Information
								</h3>
								{/* General Information */}
								<div className="border-b pb-2">
									<div className="space-y-1">
										<div className="flex flex-col">
											<span className="font-medium">
												Context Window:
											</span>
											<div className="flex justify-between pl-4">
												<span>Input:</span>
												<span>
													{model.input_context_length?.toLocaleString() ||
														"-"}
												</span>
											</div>
											<div className="flex justify-between pl-4">
												<span>Output:</span>
												<span>
													{model.output_context_length?.toLocaleString() ||
														"-"}
												</span>
											</div>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">
												Multimodal:
											</span>
											<span>
												{model.multimodal ? (
													<Check className="inline" />
												) : (
													<X className="inline" />
												)}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">
												Parameters:
											</span>
											<span>
												{model.parameter_count
													? `${(
															model.parameter_count /
															1e9
													  ).toFixed(1)}B`
													: "-"}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">
												Train Tokens:
											</span>
											<span>
												{model.training_tokens
													? `${(
															model.training_tokens /
															1e12
													  ).toFixed(1)}T`
													: "-"}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">
												License:
											</span>
											<span>{model.license || "-"}</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">
												Knowledge Cutoff:
											</span>
											<span>
												{model.knowledge_cutoff
													? new Date(
															model.knowledge_cutoff
													  ).toLocaleString(
															"en-US",
															{
																month: "short",
																year: "numeric",
															}
													  )
													: "-"}
											</span>
										</div>
									</div>
								</div>
								{/* Operational Metrics */}
								<h3 className="font-semibold pt-2">
									Operational Metrics
								</h3>
								<div className="border-b pb-2 pt-2">
									<div className="space-y-1">
										<div className="flex flex-col">
											<span className="font-medium">
												Cost per 1M Tokens:
											</span>
											<div className="flex justify-between pl-4">
												<span>Input:</span>
												<span className="flex items-center gap-1">
													{inputPrice !== null
														? `$${(
																inputPrice *
																1_000_000
														  ).toFixed(2)}`
														: "-"}
													{inputPrice ===
														bestInputPrice && (
														<Star className="inline h-4 w-4 text-pink-400 fill-pink-400" />
													)}
												</span>
											</div>
											<div className="flex justify-between pl-4">
												<span>Output:</span>
												<span className="flex items-center gap-1">
													{outputPrice !== null
														? `$${(
																outputPrice *
																1_000_000
														  ).toFixed(2)}`
														: "-"}
													{outputPrice ===
														bestOutputPrice && (
														<Star className="inline h-4 w-4 text-pink-400 fill-pink-400" />
													)}
												</span>
											</div>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">
												Latency:
											</span>
											<span>
												{latency !== null &&
												latency !== undefined
													? `${latency}ms`
													: "-"}
												{latency === bestLatency && (
													<Star className="inline h-4 w-4 text-pink-400 fill-pink-400" />
												)}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">
												Throughput:
											</span>
											<span>
												{throughput !== null &&
												throughput !== undefined
													? `${throughput} tokens/s`
													: "-"}
												{throughput ===
													bestThroughput && (
													<Star className="inline h-4 w-4 text-pink-400 fill-pink-400" />
												)}
											</span>
										</div>
									</div>
								</div>
								{/* Benchmarks */}
								<h3 className="font-semibold pt-2">
									Benchmarks
								</h3>
								<div className="pt-2">
									<div className="space-y-1">
										{allBenchmarks
											.filter((benchmarkName) =>
												model.benchmark_results?.some(
													(b) =>
														b.benchmark.name ===
														benchmarkName
												)
											)
											.map((benchmarkName) => {
												const rawScore =
													model.benchmark_results?.find(
														(b) =>
															b.benchmark.name ===
															benchmarkName
													)?.score;
												let num = null;
												if (rawScore != null)
													num =
														typeof rawScore ===
														"string"
															? parseFloat(
																	rawScore.replace(
																		"%",
																		""
																	)
															  )
															: rawScore;
												const bestScores =
													selectedModels
														.map((m) => {
															const r =
																m.benchmark_results?.find(
																	(b) =>
																		b
																			.benchmark
																			.name ===
																		benchmarkName
																)?.score;
															return r == null
																? NaN
																: typeof r ===
																  "string"
																? parseFloat(
																		r.replace(
																			"%",
																			""
																		)
																  )
																: r;
														})
														.filter(
															(n) => !isNaN(n)
														) as number[];
												const bestVal =
													bestScores.length
														? Math.max(
																...bestScores
														  )
														: null;
												const disp =
													num != null
														? `${num.toLocaleString(
																undefined,
																{
																	maximumFractionDigits: 2,
																}
														  )}${
																typeof rawScore ===
																	"string" &&
																String(rawScore)
																	.trim()
																	.endsWith(
																		"%"
																	)
																	? "%"
																	: ""
														  }`
														: "-";
												return (
													<div
														key={benchmarkName}
														className="flex items-center gap-1"
													>
														<span className="flex-1">
															{benchmarkNameToId[
																benchmarkName
															] ? (
																<Link
																	href={`/benchmarks/${encodeURIComponent(
																		benchmarkNameToId[
																			benchmarkName
																		]
																	)}`}
																	className="group"
																>
																	<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full font-semibold">
																		{
																			benchmarkName
																		}
																	</span>
																</Link>
															) : (
																<span>
																	{
																		benchmarkName
																	}
																</span>
															)}
														</span>
														<span className="tabular-nums">
															{disp}
														</span>
														{num === bestVal && (
															<Star className="inline h-4 w-4 text-pink-400 fill-pink-400" />
														)}
													</div>
												);
											})}
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</>
	);
}
