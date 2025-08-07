import React from "react";
import { Badge } from "@/components/ui/badge";
import { BenchmarkDialog } from "@/components/model/benchmarks/BenchmarkDialog";
import { Expand, ArrowDown } from "lucide-react";
import Link from "next/link";
import {
	Tooltip as UITooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

function isEnrichedBenchmarkResult(
	b: any
): b is { benchmark: { name: string; order?: string }; benchmark_id: string } {
	return (
		b &&
		typeof b === "object" &&
		b.benchmark &&
		typeof b.benchmark.name === "string"
	);
}

function parseScore(score: string | number): number | null {
	if (typeof score === "number") return score;
	if (typeof score === "string") {
		const match = score.match(/([\d.]+)/);
		if (match) return parseFloat(match[1]);
	}
	return null;
}

function BenchmarkTooltip({ active, payload, showAllVariants }: any) {
	if (!active || !payload || !payload.length) return null;
	const d = payload[0].payload;
	return (
		<div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-3 border border-zinc-200 dark:border-zinc-800 min-w-[180px]">
			<div className="font-semibold text-sm mb-1">{d.modelName}</div>
			<div className="text-xs text-muted-foreground mb-1">
				{d.provider}
			</div>
			{showAllVariants && d.allResults && d.allResults.length > 1 ? (
				<div className="space-y-1">
					{d.allResults.map((r: any, i: number) => (
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
		</div>
	);
}

export function ModelBenchmarksComparisonGrid({
	model,
	allModels,
}: {
	model: any;
	allModels: any[];
}) {
	const currentModelBenchmarkIds = (model.benchmark_results || []).map(
		(r: any) => r.benchmark_id.toLowerCase()
	);
	const allBenchmarkResults = allModels.flatMap((m) =>
		(m.benchmark_results || []).map((r: any) => ({ ...r, model: m }))
	);
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
	const filteredBenchmarks = uniqueBenchmarks.filter(
		(b) => isEnrichedBenchmarkResult(b) && b.benchmark.name
	);
	const sortedBenchmarks = filteredBenchmarks.sort((a, b) => {
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
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{sortedBenchmarks.map((benchmark) => {
				const benchmarkId = benchmark.benchmark_id || "unknown";
				const benchmarkName = isEnrichedBenchmarkResult(benchmark)
					? benchmark.benchmark.name
					: benchmark.benchmark_id || "unknown";

				const isLowerBetter =
					benchmark.benchmark &&
					benchmark.benchmark.order === "lower";
				const modelsWithThisBenchmark = allModels
					.map((m) => {
						const results = (m.benchmark_results || []).filter(
							(b: any) =>
								b.benchmark_id.toLowerCase() ===
								benchmarkId.toLowerCase()
						);
						if (!results.length) return null;
						const parsedResults = results.map((result: any) => {
							const score = parseScore(result.score);
							const isPercentage =
								typeof result.score === "string" &&
								result.score.includes("%");
							return {
								score,
								isPercentage,
								other_info: result.other_info,
								source_link: result.source_link,
							};
						});
						const validResults = parsedResults.filter(
							(r: { score: null }) => r.score !== null
						);
						const best =
							validResults.length > 0
								? validResults.reduce(
										(
											a: { score: number },
											b: { score: number }
										) =>
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
						};
					})
					.filter((m): m is any => m !== null)
					.sort((a, b) =>
						isLowerBetter ? a.score - b.score : b.score - a.score
					);
				const currentIdx = modelsWithThisBenchmark.findIndex(
					(m) => m.isCurrent
				);
				const current = modelsWithThisBenchmark[currentIdx];
				return (
					<Card
						key={benchmarkId}
						className="p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 border-b-gray-300 dark:border-b-gray-600 rounded-lg bg-white relative"
					>
						<button
							type="button"
							className="absolute top-3 right-3 z-10 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-hidden hidden md:block"
							onClick={() => setDialogOpen(benchmarkId)}
							title="Expand benchmark comparison"
						>
							<Expand className="w-5 h-5 text-zinc-500 hover:text-indigo-600" />
						</button>
						<div className="w-full">
							<div className="flex items-center gap-2 mb-2">
								<Link
									href={`/benchmarks/${benchmarkId}`}
									className="text-primary text-base font-semibold"
								>
									<span className="truncate font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
										{benchmarkName}
									</span>
								</Link>
								<Badge variant="secondary">
									{current
										? current.score.toFixed(2) +
										  (current.isPercentage ? "%" : "")
										: "-"}
								</Badge>
								{isLowerBetter && (
									<TooltipProvider>
										<UITooltip delayDuration={0}>
											<TooltipTrigger asChild>
												<span>
													<Badge
														variant="outline"
														className="ml-1 text-xs text-blue-600 border-blue-400 flex items-center gap-1"
													>
														<ArrowDown className="w-3 h-3" />
													</Badge>
												</span>
											</TooltipTrigger>
											<TooltipContent
												side="top"
												align="center"
											>
												Lower Is Better
											</TooltipContent>
										</UITooltip>
									</TooltipProvider>
								)}
								{currentIdx !== -1 && (
									<Badge variant="outline">
										#{currentIdx + 1}/
										{modelsWithThisBenchmark.length}
									</Badge>
								)}
							</div>
							<div className="w-full">
								<ResponsiveContainer
									width="100%"
									height={
										36 *
										Math.max(
											Math.min(
												modelsWithThisBenchmark.length,
												10
											),
											5
										)
									}
								>
									<BarChart
										data={(() => {
											const idx =
												modelsWithThisBenchmark.findIndex(
													(m) => m.isCurrent
												);
											const before = 4;
											const after = 5;
											let start = idx - before;
											let end = idx + after + 1;

											// Adjust if out of bounds
											if (start < 0) {
												end += -start;
												start = 0;
											}
											if (
												end >
												modelsWithThisBenchmark.length
											) {
												start -=
													end -
													modelsWithThisBenchmark.length;
												end =
													modelsWithThisBenchmark.length;
												if (start < 0) start = 0;
											}
											return modelsWithThisBenchmark.slice(
												start,
												end
											);
										})()}
										layout="vertical"
										margin={{
											top: 0,
											right: 0,
											left: 0,
											bottom: 0,
										}}
									>
										<YAxis
											type="category"
											dataKey="modelName"
											width={100}
											axisLine={true}
											tick={{ fontSize: 12 }}
										/>
										<XAxis
											type="number"
											domain={(() => {
												const scores =
													modelsWithThisBenchmark.map(
														(m) => m.score
													);
												if (!scores.length)
													return isLowerBetter
														? [100, 0]
														: [0, 100];
												const min = Math.min(...scores);
												const max = Math.max(...scores);
												const range = max - min || 1;
												const pad = range * 0.1;
												const lower = Math.max(
													0,
													Math.floor(min - pad)
												);
												const upper = Math.ceil(
													max + pad
												);
												if (isLowerBetter) {
													return [upper, lower];
												} else {
													return [lower, upper];
												}
											})()}
											tickFormatter={(value) => {
												const scores =
													modelsWithThisBenchmark.map(
														(m) => m.score
													);
												const min = Math.min(...scores);
												const max = Math.max(...scores);
												const range = max - min || 1;
												if (range < 1) {
													return value.toFixed(2);
												} else if (range < 10) {
													return value.toFixed(1);
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
													showAllVariants={true}
												/>
											}
										/>
										<Bar
											dataKey="score"
											isAnimationActive={false}
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
															width={width}
															height={height}
															fill={fill}
															stroke={
																payload.isCurrent
																	? "#ff0000"
																	: undefined
															}
															strokeWidth={
																payload.isCurrent
																	? 2
																	: 0
															}
															rx={2}
														/>
													</g>
												);
											}}
										/>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
						<BenchmarkDialog
							open={dialogOpen === benchmarkId}
							onOpenChange={(open) =>
								setDialogOpen(open ? benchmarkId : null)
							}
							benchmarkName={benchmarkName}
							modelsWithThisBenchmark={modelsWithThisBenchmark}
							currentIdx={currentIdx}
							current={current}
						/>
					</Card>
				);
			})}
		</div>
	);
}
