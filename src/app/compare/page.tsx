import CompareDashboard from "@/components/compare/CompareDashboard";
import CompareMiniHeader from "@/components/compare/CompareMiniHeader";
import Header from "@/components/header";
import { ExtendedModel } from "@/data/types";
import { fetchAggregateData } from "@/lib/fetchData";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Compare AI Models Side-by-Side | Benchmarks, Features & Pricing",
	description:
		"Compare state-of-the-art AI models side-by-side. Explore detailed benchmarks, features, providers, and pricing to find the best AI model for your needs. Make informed decisions with AI Stats.",
	keywords: [
		"AI model comparison",
		"compare AI models",
		"AI benchmarks",
		"AI model pricing",
		"machine learning models",
		"AI providers",
		"state-of-the-art models",
		"AI Stats",
	],
	alternates: {
		canonical: "https://ai-stats.phaseo.app/compare",
	},
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
