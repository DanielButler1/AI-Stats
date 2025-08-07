"use client";

import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	LabelList,
	Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Expand } from "lucide-react";
import { BenchmarkDialog } from "@/components/model/benchmarks/BenchmarkDialog";
import { useIsMobile } from "@/hooks/use-mobile";

// Custom tooltip component
type TooltipProps = {
	active?: boolean;
	payload?: any[];
	label?: string;
};

function BenchmarkTooltip({ active, payload }: TooltipProps) {
	if (!active || !payload || !payload.length) return null;
	const model = payload[0].payload;
	return (
		<Card className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-3 border border-zinc-200 dark:border-zinc-800 min-w-[180px]">
			<CardHeader className="p-0 pb-2">
				<CardTitle className="font-semibold text-sm mb-1">
					{model.name}
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<div className="text-xs text-muted-foreground mb-1">
					{model.provider}
				</div>{" "}
				{model.allResults && model.allResults.length > 1 ? (
					<div className="space-y-1">
						{model.allResults.map((r: any, i: number) => (
							<div key={i} className="flex items-center gap-2">
								<span className="font-mono text-base">
									{r.score?.toFixed(2)}
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
						{model.score?.toFixed(2) +
							(model.isPercentage !== false ? "%" : "")}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

interface ModelBenchmarkChartProps {
	models: Array<{
		id: string;
		name: string;
		provider?: { name?: string; colour?: string | null };
		benchmark_results: Array<{
			benchmark_id?: string;
			benchmark?: { id?: string; name?: string; order?: string | null };
			name?: string;
			score: string | number;
			is_self_reported?: boolean | number;
			other_info?: string | null;
		}>;
	}>;
	benchmarkName: string;
}

function parseScore(score: string | number): number | null {
	if (typeof score === "number") return score;
	if (typeof score === "string") {
		// Remove % and parse float
		const match = score.match(/([\d.]+)/);
		if (match) return parseFloat(match[1]);
	}
	return null;
}

export default function ModelBenchmarkChart({
	models,
	benchmarkName,
}: ModelBenchmarkChartProps) {
	// State for dialog
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const isMobile = useIsMobile();

	// Find the first matching benchmark result to determine order
	const isLowerBetter = React.useMemo(() => {
		for (const model of models) {
			const result = model.benchmark_results.find(
				(br) =>
					(br.name &&
						br.name.toLowerCase() ===
							benchmarkName.toLowerCase()) ||
					(br.benchmark?.name &&
						br.benchmark.name.toLowerCase() ===
							benchmarkName.toLowerCase())
			);
			if (
				result &&
				result.benchmark &&
				result.benchmark.order === "lower"
			) {
				return true;
			}
		}
		return false;
	}, [models, benchmarkName]);

	// Prepare data for the chart
	const data = models
		.map((model) => {
			const results = model.benchmark_results.filter((br) => {
				return (
					(br.name &&
						br.name.toLowerCase() ===
							benchmarkName.toLowerCase()) ||
					(br.benchmark?.name &&
						br.benchmark.name.toLowerCase() ===
							benchmarkName.toLowerCase())
				);
			});
			if (!results.length) return null;
			const parsedResults = results
				.map((result) => {
					const score = parseScore(result.score);
					return {
						score,
						isPercentage:
							typeof result.score === "string" &&
							result.score.includes("%"),
						other_info: result.other_info ?? null,
						is_self_reported: Boolean(result.is_self_reported),
					};
				})
				.filter((r) => typeof r.score === "number" && r.score !== null);
			if (!parsedResults.length) return null; // Guard: if parsedResults is empty, skip this model
			if (!parsedResults[0]) return null;
			const best =
				parsedResults.length === 1
					? parsedResults[0]
					: parsedResults.reduce((a, b) =>
							isLowerBetter
								? (a.score as number) < (b.score as number)
									? a
									: b
								: (a.score as number) > (b.score as number)
								? a
								: b
					  );
			return {
				name: model.name,
				provider: model.provider?.name || "Unknown",
				providerColor: model.provider?.colour || null,
				score: best.score as number,
				is_self_reported: best.is_self_reported,
				isPercentage: best.isPercentage,
				allResults: parsedResults,
			};
		})
		.filter((d) => d && typeof d.score === "number") as Array<{
		name: string;
		provider: string;
		providerColor: string | null;
		score: number;
		is_self_reported: boolean;
		isPercentage: boolean;
		allResults: Array<{
			score: number;
			isPercentage: boolean;
			other_info?: string | null;
			is_self_reported: boolean;
		}>;
	}>;

	// Sort data by score (descending for higher is better, ascending for lower is better)
	if (isLowerBetter) {
		data.sort((a, b) => a.score - b.score);
	} else {
		data.sort((a, b) => b.score - a.score);
	}

	// Limit to top 20 models for the main chart
	const topModels = data.slice(0, 10);

	if (data.length === 0) {
		return (
			<div className="text-muted-foreground">
				No performance data available for this benchmark.
			</div>
		);
	}

	// Get a map of unique providers for color coding
	const uniqueProviders: string[] = Array.from(
		new Set(data.map((item) => item.provider))
	);
	const providerColors: Record<string, string> = {};
	const providerBaseColors = [
		"#f472b6", // pink-300
		"#60a5fa", // blue-400
		"#fb7185", // rose-400
		"#34d399", // emerald-400
		"#a78bfa", // violet-400
		"#fbbf24", // amber-400
		"#6ee7b7", // emerald-300
	];

	// Assign colors to providers (fallback if provider.colour is null)
	uniqueProviders.forEach((provider, index) => {
		const ExtendedModel = data.find((m) => m.provider === provider);
		providerColors[provider] =
			ExtendedModel?.providerColor ||
			providerBaseColors[index % providerBaseColors.length] ||
			"#9ca3af"; // Gray fallback color
	});

	return (
		<div className="flex flex-col w-full">
			<div className="w-full">
				<div className="flex items-center gap-2 mb-2">
					<h1 className="text-xl font-bold">
						Top 10 Model Performance
					</h1>
					<Badge variant="secondary">
						{data.length > 10
							? `Top 10 of ${data.length}`
							: `${data.length} models`}
					</Badge>
					{isLowerBetter && (
						<Badge
							variant="outline"
							className="ml-1 text-xs text-blue-600 border-blue-400"
						>
							Lower is better
						</Badge>
					)}
				</div>
				<ResponsiveContainer width="100%" height={400}>
					<BarChart
						data={topModels}
						layout="vertical"
						margin={{ top: 16, right: 48, left: 80, bottom: 40 }}
					>
						<YAxis
							dataKey="name"
							type="category"
							width={isMobile ? 80 : 120}
							tick={{ fontSize: isMobile ? 10 : 12 }}
							axisLine={true}
							tickLine={false}
						/>
						<XAxis
							type="number"
							domain={
								isLowerBetter
									? [
											Math.min(
												0,
												Math.floor(
													Math.min(
														...topModels.map(
															(d) => d.score
														)
													) * 0.9
												)
											),
											Math.max(
												100,
												Math.ceil(
													Math.max(
														...topModels.map(
															(d) => d.score
														)
													) * 1.1
												)
											),
									  ]
									: [
											0,
											Math.max(
												100,
												Math.ceil(
													Math.max(
														...topModels.map(
															(d) => d.score
														)
													) * 1.1
												)
											),
									  ]
							}
							tick={{ fontSize: 12 }}
							axisLine={true}
							tickLine={false}
						/>
						<Tooltip
							content={<BenchmarkTooltip />}
							wrapperStyle={{ zIndex: 1000 }}
						/>
						<Bar dataKey="score" radius={[0, 4, 4, 0]}>
							{topModels.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={
										entry.providerColor ||
										providerColors[entry.provider] ||
										"#9ca3af"
									}
								/>
							))}
							{/* No labels on top of bars */}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
			<BenchmarkDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				benchmarkName={benchmarkName}
				modelsWithThisBenchmark={data.slice(0, 20).map((d) => ({
					modelName: d.name,
					provider: d.provider,
					score: d.score,
					isCurrent: false,
					isPercentage: d.isPercentage,
					fill:
						d.providerColor ||
						providerColors[d.provider] ||
						"#9ca3af",
					allResults: d.allResults,
				}))}
				currentIdx={-1}
				current={null}
			/>
		</div>
	);
}
