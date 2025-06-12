import CompareDashboard from "@/components/compare/CompareDashboard";
import CompareMiniHeader from "@/components/compare/CompareMiniHeader";
import Header from "@/components/header";
import { ExtendedModel } from "@/data/types";
import { fetchAggregateData } from "@/lib/fetchData";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Compare Models",
	description:
		"Compare AI models side-by-side, explore benchmarks and key metrics.",
	keywords: [
		"AI model comparison",
		"benchmarks",
		"compare AI models",
		"machine learning",
	],
};

export default async function Page() {
	try {
		const models: ExtendedModel[] = await fetchAggregateData();

		return (
			<main className="flex min-h-screen flex-col">
				<Header />
				<CompareMiniHeader models={models} />
				<div className="container mx-auto px-4 py-8">
					<CompareDashboard models={models} />
				</div>
			</main>
		);
	} catch {
		return (
			<main className="flex min-h-screen flex-col">
				<Header />
				<div className="container mx-auto px-4 py-8">
					<h2 className="text-2xl font-bold text-red-600">
						Error loading models
					</h2>
					<p>Please try refreshing the page.</p>
				</div>
			</main>
		);
	}
}
