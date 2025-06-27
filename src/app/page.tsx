import Header from "@/components/header";
import { ExtendedModel } from "@/data/types";
import { fetchAggregateData } from "@/lib/fetchData";
import HomePage from "@/components/homePage/homePage";
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
	title: `AI Leaderboard and Rankings - ${currentMonthYear}`,
	description:
		"Compare state-of-the-art AI models with detailed benchmarks, features, and pricing. Track AI progress, find the best models for your needs, and stay updated on the latest releases.",
	keywords: [
		"AI models",
		"AI leaderboard",
		"model comparison",
		"benchmarks",
		"GPT",
		"Claude",
		"LLM",
		"Gemini",
		"Grok",
		"machine learning",
		"model tracker",
		"AI pricing",
		"AI features",
		"SOTA models",
		"AI performance",
	],
	alternates: {
		canonical: "https://ai-stats.phaseo.app/",
	},
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
