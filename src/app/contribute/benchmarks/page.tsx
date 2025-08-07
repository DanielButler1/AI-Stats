import Header from "@/components/header";
import type { ExtendedModel } from "@/data/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { fetchAggregateData, fetchBenchmarks } from "@/lib/fetchData";
import BenchmarkHeatmap from "@/components/contribute/benchmarks/BenchmarkHeatmap";
import { ArrowUpRight, Tag, FilePlus2, Building2 } from "lucide-react";

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
				<section className="mx-auto max-w-4xl text-center">
					<h1 className="text-4xl font-semibold tracking-tight">
						Benchmark Coverage & Contributions
					</h1>
					<p className="mt-3 text-base text-muted-foreground">
						See which models have been evaluated on which
						benchmarks. Fill in missing results and help keep the
						database comprehensive and up to date.
					</p>
				</section>

				{/* Primary actions */}
				<section className="mt-8">
					<div className="flex flex-col items-stretch sm:items-center gap-3 sm:flex-row sm:justify-center">
						<Link
							href="https://github.com/DanielButler1/AI-Stats"
							className="w-full sm:w-auto"
							aria-label="Submit a new provider on GitHub"
						>
							<Button className="w-full sm:w-auto gap-2">
								<Building2 className="h-4 w-4" />
								<span>Submit a New Provider</span>
								<ArrowUpRight className="h-4 w-4 opacity-80" />
							</Button>
						</Link>
						<Link
							href="https://github.com/DanielButler1/AI-Stats"
							className="w-full sm:w-auto"
							aria-label="Submit a new model on GitHub"
						>
							<Button className="w-full sm:w-auto gap-2">
								<FilePlus2 className="h-4 w-4" />
								<span>Submit a New Model</span>
								<ArrowUpRight className="h-4 w-4 opacity-80" />
							</Button>
						</Link>
					</div>
					<div className="mt-3 flex flex-col items-stretch sm:items-center gap-3 sm:flex-row sm:justify-center">
						<Link
							href="contribute"
							className="w-full sm:w-auto"
							aria-label="Back to model contributions"
						>
							<Button
								className="w-full sm:w-auto gap-2"
								variant="secondary"
							>
								<span>Back to Model Contributions</span>
							</Button>
						</Link>
						<Link
							href="contribute/prices"
							className="w-full sm:w-auto"
							aria-label="View pricing coverage"
						>
							<Button
								className="w-full sm:w-auto gap-2"
								variant="secondary"
							>
								<Tag className="h-4 w-4" />
								<span>View Pricing Coverage</span>
							</Button>
						</Link>
					</div>
				</section>

				{/* Benchmark heatmap */}
				<section className="mt-8">
					{errorMsg ? (
						<div className="text-red-600 font-bold">{errorMsg}</div>
					) : (
						<BenchmarkHeatmap
							models={models}
							allBenchmarks={benchmarks}
						/>
					)}
				</section>
			</div>
		</main>
	);
}
