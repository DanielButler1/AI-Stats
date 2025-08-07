import Header from "@/components/Header";
import type { ExtendedModel } from "@/data/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { fetchAggregateData } from "@/lib/fetchData";
import PricingHeatmap from "@/components/contribute/prices/PricingHeatmap";
import { ArrowUpRight, FilePlus2, Building2, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
	title: "AI Model Pricing Coverage",
	description:
		"Discover which AI models have available pricing and compute cost data. Find gaps in pricing information and contribute to building the most complete AI model pricing database.",
	keywords: [
		"AI pricing",
		"model costs",
		"compute pricing",
		"AI Stats",
		"pricing coverage",
		"contribute pricing",
	],
};

async function getModels(): Promise<ExtendedModel[]> {
	const allModels = await fetchAggregateData();
	return allModels.filter((model) => model.status !== "Rumoured");
}

export default async function PricesContributePage() {
	let models: ExtendedModel[] = [];
	let errorMsg = "";
	try {
		models = await getModels();
	} catch (e: any) {
		errorMsg = e?.message || "Unknown error";
	}

	// Sort by release date - if not release date, announced date
	models.sort((a, b) => {
		const dateA = new Date(a.release_date || a.announced_date || 0);
		const dateB = new Date(b.release_date || b.announced_date || 0);
		return dateB.getTime() - dateA.getTime();
	});

	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<div className="container mx-auto px-4 py-8">
				<section className="mx-auto max-w-4xl text-center">
					<h1 className="text-4xl font-semibold tracking-tight">
						Pricing Coverage & Contributions
					</h1>
					<p className="mt-3 text-base text-muted-foreground">
						See which models have pricing and compute cost
						information. Fill in missing data and help keep the
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
							href="contribute/benchmarks"
							className="w-full sm:w-auto"
							aria-label="View benchmark coverage"
						>
							<Button
								className="w-full sm:w-auto gap-2"
								variant="secondary"
							>
								<BarChart3 className="h-4 w-4" />
								<span>View Benchmark Coverage</span>
							</Button>
						</Link>
					</div>
				</section>

				{/* Pricing heatmap */}
				<section className="mt-8">
					{errorMsg ? (
						<div className="text-red-600 font-bold">{errorMsg}</div>
					) : (
						<PricingHeatmap models={models} />
					)}
				</section>
			</div>
		</main>
	);
}
