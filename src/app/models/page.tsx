import Header from "@/components/Header";
import { ExtendedModel } from "@/data/types";
import ModelsDisplay from "@/components/models/Models/ModelsDisplay";
import { fetchAggregateData } from "@/lib/fetchData";
import type { Metadata } from "next";

const now = new Date();
const month = now.toLocaleString("en-US", { month: "long" });
const year = now.getFullYear();

export const metadata: Metadata = {
	title: `AI Models | Compare State-of-the-Art Models, Benchmarks & Pricing - ${month} ${year}`,
	description:
		"Explore a comprehensive directory of AI models. Compare state-of-the-art models by benchmarks, features, providers, and pricing. Find the best AI model for your needs on AI Stats.",
	keywords: [
		"AI models",
		"machine learning models",
		"AI benchmarks",
		"compare AI models",
		"AI model pricing",
		"AI providers",
		"state-of-the-art models",
		"AI Stats",
	],
	alternates: {
		canonical: "https://ai-stats.phaseo.app/models",
	},
};

export default async function ModelsPage() {
	const models: ExtendedModel[] = await fetchAggregateData();

	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<div className="container mx-auto px-4 py-8">
				<ModelsDisplay models={models} />
			</div>
		</main>
	);
}
