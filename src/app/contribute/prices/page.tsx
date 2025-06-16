import Header from "@/components/header";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import type { ExtendedModel } from "@/data/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { fetchAggregateData } from "@/lib/fetchData";
import PricingHeatmap from "@/components/contribute/prices/PricingHeatmap";

export const metadata: Metadata = {
	title: "Pricing Coverage",
	description:
		"View which AI models have pricing and compute information available and identify gaps in coverage.",
	keywords: [
		"AI pricing",
		"model prices",
		"AI costs",
		"model costs",
		"pricing coverage",
		"compute costs",
	],
};

async function getModels(): Promise<ExtendedModel[]> {
	return fetchAggregateData();
}

export default async function PricesContributePage() {
	let models: ExtendedModel[] = [];
	let errorMsg = "";
	try {
		models = await getModels();
	} catch (e: any) {
		errorMsg = e?.message || "Unknown error";
	}

	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<div className="container mx-auto px-4 py-8">
				<Card className="mb-4 shadow-lg">
					<CardHeader className="flex flex-col space-y-4 text-3xl font-bold">
						<div className="flex flex-col">
							<CardTitle>Pricing Coverage Map</CardTitle>
							<CardDescription>
								See which models have pricing and compute cost
								information available. Help us improve coverage
								by contributing missing information!
							</CardDescription>
						</div>
						<div className="flex flex-col sm:flex-row gap-2">
							<Link href="https://github.com/DanielButler1/AI-Stats">
								<Button className="w-full sm:w-auto">
									Submit Price Information
								</Button>
							</Link>
							<Link href="/pricing">
								<Button
									className="w-full sm:w-auto"
									variant="outline"
								>
									View All Pricing
								</Button>
							</Link>
						</div>
					</CardHeader>
				</Card>
				{errorMsg ? (
					<div className="text-red-600 font-bold">{errorMsg}</div>
				) : (
					<PricingHeatmap models={models} />
				)}
			</div>
		</main>
	);
}
