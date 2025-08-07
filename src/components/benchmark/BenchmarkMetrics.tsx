import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BenchmarkMetricsProps {
	modelsWithBenchmark: any[];
	benchmarkId: string;
}

export default function BenchmarkMetrics({
	modelsWithBenchmark,
	benchmarkId,
}: BenchmarkMetricsProps) {
	// Calculate stats
	const scores = modelsWithBenchmark
		.map((model: any) => {
			const result = model.benchmark_results?.find(
				(br: any) =>
					br.benchmark_id === benchmarkId ||
					(br.benchmark && br.benchmark.id === benchmarkId)
			);
			return result
				? parseFloat(String(result.score || "0").replace("%", ""))
				: null;
		})
		.filter((score: number | null) => score !== null) as number[];

	const avgScore = scores.length
		? scores.reduce((a, b) => a + b, 0) / scores.length
		: 0;
	const minScore = scores.length ? Math.min(...scores) : 0;
	const maxScore = scores.length ? Math.max(...scores) : 0;
	const totalModels = modelsWithBenchmark.length;
	const maxScoreAchievable = 1;

	const stats = [
		{
			label: "Total Models",
			value: totalModels,
		},
		{
			label: "Average Score",
			value: avgScore.toFixed(2),
		},
		{
			label: "Score Range",
			value: `${minScore.toFixed(2)} - ${maxScore.toFixed(2)}`,
		},
		{
			label: "Max Score Achievable",
			value: maxScoreAchievable,
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
			{stats.map((stat) => (
				<Card
					key={stat.label}
					className="p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 border-b-gray-300 dark:border-b-gray-600 shadow-xs"
				>
					<CardHeader className="text-center p-0 flex flex-col items-center">
						<CardTitle className="text-3xl font-bold mb-1">
							{stat.value}
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col items-center justify-center p-0">
						<span className="text-sm font-medium text-center text-gray-500">
							{stat.label}
						</span>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
