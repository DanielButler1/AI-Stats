import Header from "@/components/header";
import { ExtendedModel } from "@/data/types";
import { fetchAggregateData } from "@/lib/fetchData";
import HomePage from "@/components/homePage/homePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Home",
	description:
		"Browse the latest state-of-the-art AI models and compare benchmarks, features, and pricing all in one place.",
	keywords: [
		"AI models",
		"benchmarks",
		"comparison",
		"GPT",
		"machine learning",
		"model tracker",
	],
};

export default async function Home() {
	try {
		const models: ExtendedModel[] = await fetchAggregateData();
		return <HomePage models={models} />;
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
