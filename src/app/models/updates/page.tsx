import Header from "@/components/Header";
import { fetchAggregateData } from "@/lib/fetchData";
import ModelUpdatesPage from "@/components/models/ModelUpdates/ModelUpdates";
import type { Metadata } from "next";

const now = new Date();
const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const currentMonthYear = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

export const metadata: Metadata = {
	title: `AI Model Updates - ${currentMonthYear}`,
	description:
		"Stay updated on the latest changes and improvements to AI models. Track new releases, features, and benchmarks for leading AI systems.",
	keywords: [
		"llm",
		"ai",
		"ai model updates",
		"llm updates",
		"ai releases",
		"ai benchmarks",
		"gpt-5",
		"claude 4",
		"gemini 2.5",
		"grok",
		"ai changelog",
		"ai features",
	],
	alternates: {
		canonical: "https://ai-stats.phaseo.app/models/updates",
	},
};

export default async function Page() {
	const models = await fetchAggregateData();
	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<div className="container mx-auto px-4 py-8">
				<ModelUpdatesPage models={models} />
			</div>
		</main>
	);
}
