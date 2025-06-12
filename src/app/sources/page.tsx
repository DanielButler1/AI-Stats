import { ExtendedModel } from "@/data/types";
import Header from "@/components/header";
import SourcesDisplay from "@/components/sources/SourcesDisplay";
import type { Metadata } from "next";
import { fetchAggregateData } from "@/lib/fetchData";

export const metadata: Metadata = {
	title: "Sources | AI Model Tracker",
	description:
		"View data sources and references powering the AI Model Tracker database.",
	keywords: ["AI data sources", "model sources", "data references"],
};

async function getData(): Promise<ExtendedModel[]> {
	return fetchAggregateData();
}

export default async function SourcesPage() {
	const models = await getData();

	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<SourcesDisplay models={models} />
		</main>
	);
}
