import Header from "@/components/header";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import type { ExtendedModel } from "@/data/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { fetchAggregateData, fetchBenchmarks } from "@/lib/fetchData";
import BenchmarkHeatmap from "@/components/contribute/benchmarks/BenchmarkHeatmap";

export const metadata: Metadata = {
	title: "AI Model Benchmark Coverage",
	description:
		"Explore comprehensive coverage of AI model benchmarks. Identify which models have been evaluated, spot missing data, and help improve benchmark completeness in the AI Stats Database.",
	keywords: [
		"AI benchmarks",
		"model evaluation",
		"benchmark gaps",
		"AI Stats",
		"contribute benchmarks",
		"model comparison",
	],
};

async function getModels(): Promise<ExtendedModel[]> {
	return fetchAggregateData();
}

async function getAllBenchmarks() {
	return fetchBenchmarks();
}

export default async function BenchmarksContributePage() {
	let models: ExtendedModel[] = [];
	let benchmarks: any[] = [];
	let errorMsg = "";
	try {
		const [modelsData, benchmarksData] = await Promise.all([
			getModels(),
			getAllBenchmarks(),
		]);
		models = modelsData;
		benchmarks = benchmarksData;
	} catch (e: any) {
		errorMsg = e?.message || "Unknown error";
	}

	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<div className="container mx-auto px-4 py-8">
				<Card className="mb-4 shadow-lg">
					<CardHeader className="flex flex-col space-y-4 text-3xl font-bold">
						<div className="flex flex-col">
							<CardTitle>Benchmark Coverage Map</CardTitle>{" "}
							<CardDescription>
								See which models have been evaluated on which
								benchmarks. Missing data is shown in gray. Help
								us improve coverage by contributing benchmark
								results!
							</CardDescription>
						</div>
						<div className="flex flex-col sm:flex-row gap-2">
							<Link href="https://github.com/DanielButler1/AI-Stats">
								<Button className="w-full sm:w-auto">
									Submit New Benchmark Results
								</Button>
							</Link>
							<Link href="/benchmarks">
								<Button
									className="w-full sm:w-auto"
									variant="outline"
								>
									View All Benchmarks
								</Button>
							</Link>
						</div>
					</CardHeader>
				</Card>{" "}
				{errorMsg ? (
					<div className="text-red-600 font-bold">{errorMsg}</div>
				) : (
					<BenchmarkHeatmap
						models={models}
						allBenchmarks={benchmarks}
					/>
				)}
			</div>
		</main>
	);
}
