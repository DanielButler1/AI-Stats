import Header from "@/components/header";
import { ExtendedModel } from "@/data/types";
import ModelsDisplay from "@/components/models/ModelsDisplay";
import { Card } from "@/components/ui/card";
import { fetchAggregateData } from "@/lib/fetchData";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "All Models",
	description:
		"Browse all state-of-the-art AI models, compare benchmarks, features, and pricing.",
	keywords: ["AI models", "benchmarks", "machine learning"],
};

export default async function ModelsPage() {
	try {
		const models: ExtendedModel[] = await fetchAggregateData();

		return (
			<main className="flex min-h-screen flex-col">
				<Header />
				<div className="container mx-auto px-4 py-8">
					<Card className="mb-4 shadow-lg p-4">
						<h2 className="text-3xl font-bold">All Models</h2>
					</Card>
					<ModelsDisplay models={models} />
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
