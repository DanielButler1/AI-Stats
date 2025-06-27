import { ExtendedModel } from "@/data/types";
import React from "react";
import BenchmarkBarChart from "./BenchmarkBarChart";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

function getCommonBenchmarks(selectedModels: ExtendedModel[]): string[] {
	if (!selectedModels || selectedModels.length === 0) return [];
	// Deduplicate each model's benchmarks and intersect across models
	const setsOfNames = selectedModels.map((m) =>
		Array.from(
			new Set((m.benchmark_results || []).map((b) => b.benchmark.name))
		)
	);
	// Preserve order from first model
	return setsOfNames.reduce((a, b) => a.filter((x) => b.includes(x)));
}

function getScoresForBenchmarks(
	selectedModels: ExtendedModel[],
	benchmarks: string[]
) {
	return selectedModels.map((model) => {
		const scores: Record<string, number | null> = {};
		benchmarks.forEach((bench) => {
			// Filter all entries for this benchmark
			const results = (model.benchmark_results || []).filter(
				(b) => b.benchmark.name === bench
			);
			if (results.length === 0) {
				scores[bench] = null;
			} else {
				// Determine ordering rule
				const isLowerBetter = results[0].benchmark.order === "lower";
				let bestScore: number | null = null;
				results.forEach((r) => {
					let val = parseFloat(r.score.toString().replace("%", ""));
					if (!r.score.toString().includes("%")) val = val * 100;
					if (bestScore === null) {
						bestScore = val;
					} else if (
						isLowerBetter ? val < bestScore : val > bestScore
					) {
						bestScore = val;
					}
				});
				scores[bench] = bestScore;
			}
		});
		return { name: model.name, scores };
	});
}

function getBarChartData(
	models: { name: string; scores: Record<string, number | null> }[],
	benchmarks: string[]
) {
	return benchmarks.map((bench) => {
		const row: { [key: string]: string | number | null } = {
			benchmark: bench,
		};
		models.forEach((model) => {
			row[model.name] = model.scores[bench];
		});
		return row;
	});
}

// Removed unused getMaxScores helper

function CustomTooltip({
	active,
	payload,
	label,
}: {
	active?: boolean;
	payload?: any;
	label?: string;
}) {
	if (!active || !payload || payload.length === 0) return null;
	const scores: { name: string; value: number | null }[] = payload.map(
		(p: any) => ({
			name: p.name,
			value: p.value,
		})
	);
	const maxScore = Math.max(
		...scores.map((s: { value: number | null }) =>
			s.value != null ? s.value : -Infinity
		)
	);
	const leaders = scores.filter(
		(s: { value: number | null }) =>
			s.value === maxScore && maxScore !== -Infinity
	);
	let leadText = "";
	if (leaders.length === 1) {
		const leader = leaders[0];
		const others = scores.filter(
			(s: { name: string; value: number | null }) =>
				s.name !== leader.name && s.value != null
		);
		if (others.length > 0) {
			const diff =
				leader.value! -
				Math.max(
					...others.map((s: { value: number | null }) => s.value!)
				);
			leadText = `${leader.name} leads by ${diff.toFixed(2)}`;
		} else {
			leadText = `${leader.name} leads`;
		}
	} else if (leaders.length > 1) {
		leadText = `Tied: ${leaders
			.map((l: { name: string }) => l.name)
			.join(", ")}`;
	}
	return (
		<div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-3 border border-zinc-200 dark:border-zinc-800 min-w-[180px]">
			<div className="font-semibold text-sm mb-1">{label}</div>
			{scores.map((s: { name: string; value: number | null }) => (
				<div key={s.name} className="flex justify-between text-xs mb-1">
					<span>{s.name}</span>
					<span>{s.value != null ? s.value.toFixed(2) : "-"}</span>
				</div>
			))}
			<div className="mt-1 text-xs font-bold text-indigo-600">
				{leadText}
			</div>
		</div>
	);
}

function getSummary(
	models: { name: string; scores: Record<string, number | null> }[],
	benchmarks: string[]
) {
	if (models.length < 2) return null;
	const [modelA, modelB] = models;
	const aBetter: string[] = [];
	const bBetter: string[] = [];
	benchmarks.forEach((bench) => {
		if (modelA.scores[bench] != null && modelB.scores[bench] != null) {
			if (modelA.scores[bench]! > modelB.scores[bench]!)
				aBetter.push(bench);
			else if (modelB.scores[bench]! > modelA.scores[bench]!)
				bBetter.push(bench);
		}
	});
	const aBenchmarks = aBetter.length > 0 ? ` (${aBetter.join(", ")})` : "";
	const bBenchmarks = bBetter.length > 0 ? ` (${bBetter.join(", ")})` : "";
	return `${modelA.name} outperforms in ${aBetter.length} benchmark${
		aBetter.length === 1 ? "" : "s"
	}${aBenchmarks}, while ${modelB.name} is better at ${
		bBetter.length
	} benchmark${bBetter.length === 1 ? "" : "s"}${bBenchmarks}.`;
}

function getSignificanceAnalysis(
	models: { name: string; scores: Record<string, number | null> }[],
	benchmarks: string[]
) {
	if (models.length !== 2) return null;
	const [modelA, modelB] = models;
	let aLeads = 0,
		bLeads = 0;
	let aMargin = 0,
		bMargin = 0;
	benchmarks.forEach((bench) => {
		const aScore = modelA.scores[bench];
		const bScore = modelB.scores[bench];
		if (aScore != null && bScore != null) {
			if (aScore > bScore) {
				aLeads++;
				aMargin += aScore - bScore;
			} else if (bScore > aScore) {
				bLeads++;
				bMargin += bScore - aScore;
			}
		}
	});
	const total = aLeads + bLeads;
	if (total === 0) return null;
	const aAvg = aLeads ? aMargin / aLeads : 0;
	const bAvg = bLeads ? bMargin / bLeads : 0;
	const aPct = aLeads / total;
	const bPct = bLeads / total;
	const thresholdPct = 0.6; // 60% of benchmarks
	const thresholdMargin = 10; // 10 points average margin
	let message = null;
	if (aPct > thresholdPct && aAvg > thresholdMargin) {
		message = `${modelA.name} significantly outperforms ${modelB.name} across most benchmarks`;
	} else if (bPct > thresholdPct && bAvg > thresholdMargin) {
		message = `${modelB.name} significantly outperforms ${modelA.name} across most benchmarks`;
	} else if (aLeads > bLeads) {
		message = `${modelA.name} slightly outperforms ${modelB.name})`;
	} else if (bLeads > aLeads) {
		message = `${modelB.name} slightly outperforms ${modelA.name}`;
	} else {
		message = `No significant performance difference between ${modelA.name} and ${modelB.name}.`;
	}
	return message;
}

export default function PerformanceBenchmarkGraph({
	selectedModels,
}: {
	selectedModels: ExtendedModel[];
}) {
	const commonBenchmarks = getCommonBenchmarks(selectedModels);
	if (commonBenchmarks.length === 0) {
		return (
			<Card className="bg-white dark:bg-zinc-950 rounded-lg">
				<CardHeader className="flex flex-col items-start justify-between border-b border-b-zinc-200">
					<CardTitle className="text-lg font-semibold mb-2">
						Performance Benchmarks
					</CardTitle>
					<div className="text-muted-foreground text-sm">
						Comparative analysis across standard metrics
					</div>
				</CardHeader>
				<CardContent className="text-red-500 p-6">
					No benchmarks are available that all selected models have in
					common.
				</CardContent>
			</Card>
		);
	}
	const models = getScoresForBenchmarks(selectedModels, commonBenchmarks);
	const chartData = getBarChartData(models, commonBenchmarks);
	const summary =
		models.length === 2 ? getSummary(models, commonBenchmarks) : null;
	const significance =
		models.length === 2
			? getSignificanceAnalysis(models, commonBenchmarks)
			: null;
	return (
		<Card className="mb-6 bg-white dark:bg-zinc-950 rounded-lg">
			<CardHeader className="flex flex-row items-start justify-between border-b border-b-zinc-200">
				<div className="flex flex-col">
					<CardTitle className="text-lg font-semibold">
						Performance Benchmarks
					</CardTitle>
					<CardDescription className="text-muted-foreground text-sm">
						Comparative analysis across standard metrics
					</CardDescription>
				</div>
				<div className="flex flex-col items-end flex-shrink-0">
					<Badge className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium mt-1 transition-colors duration-150 hover:bg-pink-500/80 hover:text-white cursor-pointer">
						<span className="relative flex size-2 mr-2">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75"></span>
							<span className="relative inline-flex size-2 rounded-full bg-pink-500"></span>
						</span>
						{commonBenchmarks.length} Benchmark
						{commonBenchmarks.length === 1 ? "" : "s"}
					</Badge>
				</div>
			</CardHeader>
			<div className="p-6">
				{summary && <div className="mb-4 text-sm">{summary}</div>}
				{significance && (
					<div className="mb-4">
						<Card className="border-none shadow-lg">
							<CardContent className="py-4 text-sm text-center">
								<div className="flex items-center justify-start">
									<span className="relative flex h-4 w-4 items-center justify-center mr-4 shrink-0">
										{/* Soft background circle */}
										<span className="absolute h-6 w-6 rounded-full bg-pink-400/30" />

										{/* Star icon */}
										<Star className="relative h-full w-full text-pink-500 fill-pink-500 " />
									</span>
									<span>{significance}</span>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
				{/* Desktop bar chart rendered above the table */}
				<div className="hidden md:block bg-muted p-4 rounded-lg text-center mb-4">
					<BenchmarkBarChart
						chartData={chartData}
						models={models}
						CustomTooltip={CustomTooltip}
					/>
				</div>
				{/* Table for desktop */}
				<div className="hidden md:block overflow-x-auto">
					<table className="min-w-full text-sm border rounded">
						<tbody>
							{commonBenchmarks.map((bench) => (
								<tr key={bench} className="border-t">
									<td className="px-3 py-2 font-medium whitespace-nowrap">
										{bench}
									</td>
									<td className="px-3 py-2 text-right">
										{models.flatMap((model, idx) => {
											const value = model.scores[bench];
											const color = [
												"#f472b6",
												"#60a5fa",
												"#fb7185",
												"#34d399",
											][idx % 4];
											const span = (
												<span
													key={model.name}
													className="inline-flex items-center font-mono font-semibold px-3 py-0.5 rounded min-w-[56px] justify-end"
													style={{
														background: color,
														color: "#fff",
														textAlign: "right",
													}}
												>
													{value != null
														? `${value.toFixed(1)}%`
														: "-"}
												</span>
											);
											if (idx > 0) {
												return [
													<span
														key={`vs-${idx}`}
														className="mx-0 text-muted-foreground font-normal px-2"
													>
														vs
													</span>,
													span,
												];
											}
											return [span];
										})}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="md:hidden space-y-4">
					{commonBenchmarks.map((bench) => (
						<div
							key={bench}
							className="bg-white dark:bg-zinc-900 shadow rounded-lg p-4"
						>
							<div className="font-medium mb-2">{bench}</div>
							{models.map((model, idx) => {
								const value = model.scores[bench];
								const color = [
									"#f472b6",
									"#60a5fa",
									"#fb7185",
									"#34d399",
								][idx % 4];
								return (
									<div
										key={model.name}
										className="flex justify-between items-center mb-1"
									>
										<span className="font-medium text-sm">
											{model.name}
										</span>
										<span
											className="text-sm inline-flex items-center font-mono font-semibold px-3 py-0.5 rounded"
											style={{
												background: color,
												color: "#fff",
											}}
										>
											{value != null
												? `${value.toFixed(1)}%`
												: "-"}
										</span>
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>
		</Card>
	);
}
