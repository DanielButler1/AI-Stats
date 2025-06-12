import Header from "@/components/header";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import type { ExtendedModel } from "@/data/types";
import ModelEdits from "@/components/contribute/edit/ModelEdits";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DbStats from "@/components/contribute/dbstats";
import type { Metadata } from "next";
import { fetchAggregateData, fetchBenchmarks } from "@/lib/fetchData";

export const metadata: Metadata = {
	title: "Contribute",
	description:
		"Contribute to the AI model tracker by submitting new models or providers and suggesting edits.",
	keywords: [
		"contribute AI",
		"submit model",
		"submit provider",
		"AI model data",
	],
};

async function getModels(): Promise<ExtendedModel[]> {
	return fetchAggregateData();
}

async function getAllBenchmarks() {
	return fetchBenchmarks();
}

export default async function ContributePage() {
	let models: ExtendedModel[] = [];
	let allBenchmarks: any[] = [];
	let errorMsg = "";
	try {
		// Fetch both models and benchmarks in parallel
		[models, allBenchmarks] = await Promise.all([
			getModels(),
			getAllBenchmarks(),
		]);
	} catch (e: any) {
		errorMsg = e?.message || "Unknown error";
	}

	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<div className="container mx-auto px-4 py-8">
				<Card className="mb-4 shadow-lg">
					{" "}
					<CardHeader className="flex flex-col space-y-4 text-3xl font-bold">
						<div className="flex flex-col">
							<CardTitle>Contribute to our database!</CardTitle>
							<CardDescription>
								Below is a list of all models and any missing or
								invalid data. Help us improve by fixing these
								issues! Click on the pencil suggest edits to the
								data.
							</CardDescription>
						</div>
						<div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch">
							<div className="flex flex-col sm:flex-row gap-2">
								<Link href="https://github.com/DanielButler1/AI-Stats">
									<Button className="w-full sm:w-auto">
										Submit a New Provider
									</Button>
								</Link>
								<Link href="https://github.com/DanielButler1/AI-Stats">
									<Button className="w-full sm:w-auto">
										Submit a New Model
									</Button>
								</Link>
							</div>
							<div className="flex">
								<Link href="/contribute/benchmarks">
									<Button
										className="w-full sm:w-auto"
										variant="secondary"
									>
										View Benchmark Coverage
									</Button>
								</Link>
							</div>
						</div>
					</CardHeader>
				</Card>{" "}
				{/* Database stats cards */}
				{!errorMsg && (
					<DbStats models={models} />
					// <DbStats models={models} allBenchmarks={allBenchmarks} />
				)}
				{errorMsg ? (
					<div className="text-red-600 font-bold">{errorMsg}</div>
				) : (
					<ModelEdits models={models} />
				)}
			</div>
		</main>
	);
}
