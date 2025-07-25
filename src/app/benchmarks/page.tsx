import Header from "@/components/header";
import BenchmarksDisplay from "@/components/benchmarks/BenchmarksDisplay";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";
import { fetchBenchmarks, fetchAggregateData } from "@/lib/fetchData";

export const metadata: Metadata = {
	title: "AI Model Benchmarks | Compare Benchmark Scores Across Leading AI Models",
	description:
		"Explore a comprehensive directory of AI model benchmarks. Compare benchmark scores, see usage statistics, and discover which benchmarks are most popular across state-of-the-art AI models. Make informed decisions with AI Stats.",
	keywords: [
		"AI benchmarks",
		"AI model benchmarks",
		"benchmark scores",
		"compare AI models",
		"AI model evaluation",
		"machine learning benchmarks",
		"AI Stats",
	],
	alternates: {
		canonical: "https://ai-stats.phaseo.app/benchmarks",
	},
};

export default async function BenchmarksPage() {
	try {
		const benchmarks = await fetchBenchmarks();
		const models = await fetchAggregateData();

		// Count models with a glickoRating that isn't 1500
		const aiStatsScoreUsage = models.filter(
			(model) => model.glickoRating && model.glickoRating.rating !== 1500
		).length;

		// Extract usage counts and source link information from the benchmarks data
		const benchmarkUsage: Record<string, number> = {};
		const benchmarkLinks: Record<string, boolean> = {};

		benchmarks.forEach(
			(benchmark: {
				id: string;
				usage?: number;
				hasSourceLink?: boolean;
			}) => {
				benchmarkUsage[benchmark.id] = benchmark.usage || 0;
				benchmarkLinks[benchmark.id] = benchmark.hasSourceLink || false;
			}
		);

		// Insert a benchmark at the top of the benchmarks array with the title 'AI Stats Score'
		const aiStatsScoreBenchmark = {
			id: "ai-stats-score",
			name: "AI Stats Score",
			order: "0",
			description:
				"A composite score derived from Glicko-2 ratings across all benchmarks.",
			link: "",
			usage: aiStatsScoreUsage,
			hasSourceLink: false,
		};
		const benchmarksWithAIStats = [aiStatsScoreBenchmark, ...benchmarks];

		return (
			<main className="flex min-h-screen flex-col">
				<Header />
				<div className="container mx-auto px-4 py-8">
					<Card className="mb-4 shadow-lg p-4">
						<h1 className="text-3xl font-bold">
							All Benchmarks{" "}
							<span className="text-muted-foreground text-xl font-normal">
								({benchmarksWithAIStats.length})
							</span>
						</h1>
					</Card>
					<BenchmarksDisplay
						benchmarks={benchmarksWithAIStats}
						benchmarkUsage={{
							"ai-stats-score": aiStatsScoreUsage,
							...benchmarkUsage,
						}}
						benchmarkLinks={{
							"ai-stats-score": false,
							...benchmarkLinks,
						}}
					/>
				</div>
			</main>
		);
	} catch (error) {
		console.error("Error loading benchmarks:", error);
		return (
			<main className="flex min-h-screen flex-col">
				<Header />
				<div className="container mx-auto px-4 py-8">
					<h1 className="text-2xl font-bold text-red-600">
						Error loading benchmarks data
					</h1>
					<p>Please try refreshing the page.</p>
				</div>
			</main>
		);
	}
}
