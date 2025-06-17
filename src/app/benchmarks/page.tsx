import Header from "@/components/header";
import BenchmarksDisplay from "@/components/benchmarks/BenchmarksDisplay";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";
import { fetchBenchmarks } from "@/lib/fetchData";

export const metadata: Metadata = {
	title: "AI Model Benchmarks Directory | Compare Benchmark Scores & Usage - AI Stats",
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

		return (
			<main className="flex min-h-screen flex-col">
				<Header />
				<div className="container mx-auto px-4 py-8">
					<Card className="mb-4 shadow-lg p-4">
						<h2 className="text-3xl font-bold">
							All Benchmarks{" "}
							<span className="text-muted-foreground text-xl font-normal">
								({benchmarks.length})
							</span>
						</h2>
					</Card>
					<BenchmarksDisplay
						benchmarks={benchmarks}
						benchmarkUsage={benchmarkUsage}
						benchmarkLinks={benchmarkLinks}
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
					<h2 className="text-2xl font-bold text-red-600">
						Error loading benchmarks data
					</h2>
					<p>Please try refreshing the page.</p>
				</div>
			</main>
		);
	}
}
