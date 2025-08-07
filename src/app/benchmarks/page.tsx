import Header from "@/components/Header";
import BenchmarksDisplay from "@/components/benchmarks/BenchmarksDisplay";
import type { Metadata } from "next";
import { fetchBenchmarks } from "@/lib/fetchData";

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
	const benchmarks = await fetchBenchmarks();

	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<div className="container mx-auto px-4 py-8">
				<BenchmarksDisplay benchmarks={benchmarks} />
			</div>
		</main>
	);
}
