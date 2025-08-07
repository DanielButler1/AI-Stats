import Header from "@/components/header";
import type { ExtendedModel } from "@/data/types";
import ModelEdits from "@/components/contribute/edit/ModelEdits";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { fetchAggregateData } from "@/lib/fetchData";
import DatabaseStats from "@/components/landingPage/DatabaseStatistics";
import {
	ArrowUpRight,
	FilePlus2,
	Building2,
	BarChart3,
	Tag,
} from "lucide-react";
import { getDataCompleteness } from "@/lib/dataCompleteness";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Contribute To The AI Stats Database",
	description:
		"Contribute to the AI Stats Database by submitting new models or providers and suggesting edits to the worlds largest and most accurate database of AI Data.",
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

export default async function ContributePage() {
	let models: ExtendedModel[] = [];
	let errorMsg = "";
	try {
		// Fetch models
		models = await getModels();
	} catch (e: any) {
		errorMsg = e?.message || "Unknown error";
	}

	// Compute data completeness using actual models and benchmark definitions from disk
	// Passing an empty array here forces the helper to use its internal hard-data sources (no inference in page)
	const { percent: totalCoveragePercent } = !errorMsg
		? getDataCompleteness(models, [])
		: ({ percent: 0 } as any);

	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<div className="container mx-auto px-4 py-10">
				<section className="mx-auto max-w-4xl text-center">
					<h1 className="text-4xl font-semibold tracking-tight">
						Improve the AI Stats Database
					</h1>
					<p className="mt-3 text-base text-muted-foreground">
						Submit providers and models, or suggest edits to keep
						the world’s largest AI model database accurate and up to
						date.
					</p>
				</section>

				{/* Primary actions */}
				<section className="mt-8">
					<div className="flex flex-col items-stretch sm:items-center gap-3 sm:flex-row sm:justify-center">
						<Link
							href="https://github.com/DanielButler1/AI-Stats"
							className="w-full sm:w-auto"
							aria-label="Submit a new provider on GitHub"
						>
							<Button className="w-full sm:w-auto gap-2">
								<Building2 className="h-4 w-4" />
								<span>Submit a New Provider</span>
								<ArrowUpRight className="h-4 w-4 opacity-80" />
							</Button>
						</Link>
						<Link
							href="https://github.com/DanielButler1/AI-Stats"
							className="w-full sm:w-auto"
							aria-label="Submit a new model on GitHub"
						>
							<Button className="w-full sm:w-auto gap-2">
								<FilePlus2 className="h-4 w-4" />
								<span>Submit a New Model</span>
								<ArrowUpRight className="h-4 w-4 opacity-80" />
							</Button>
						</Link>
					</div>
					<div className="mt-3 flex flex-col items-stretch sm:items-center gap-3 sm:flex-row sm:justify-center">
						<Link
							href="contribute/benchmarks"
							className="w-full sm:w-auto"
							aria-label="View benchmark coverage"
						>
							<Button
								className="w-full sm:w-auto gap-2"
								variant="secondary"
							>
								<BarChart3 className="h-4 w-4" />
								<span>View Benchmark Coverage</span>
							</Button>
						</Link>
						<Link
							href="contribute/prices"
							className="w-full sm:w-auto"
							aria-label="View pricing coverage"
						>
							<Button
								className="w-full sm:w-auto gap-2"
								variant="secondary"
							>
								<Tag className="h-4 w-4" />
								<span>View Pricing Coverage</span>
							</Button>
						</Link>
					</div>

					{/* Completeness badge under buttons */}
					{!errorMsg && (
						<div className="mt-6 flex justify-center">
							<Badge
								variant="outline"
								className={cn(
									"px-3 py-1.5 rounded-full border-2 backdrop-blur-xs bg-background/60 shadow-xs inline-flex items-center gap-2",
									totalCoveragePercent > 80
										? "border-green-500 text-green-700 dark:text-green-300"
										: totalCoveragePercent > 60
										? "border-emerald-500 text-emerald-700 dark:text-emerald-300"
										: totalCoveragePercent > 40
										? "border-amber-500 text-amber-700 dark:text-amber-300"
										: "border-red-500 text-red-700 dark:text-red-300"
								)}
								title="Estimated percentage of filled fields across the database"
							>
								<span
									className="relative flex h-2.5 w-2.5"
									aria-hidden
								>
									<span
										className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping"
										style={{
											backgroundColor:
												totalCoveragePercent > 80
													? "#22c55e"
													: totalCoveragePercent > 60
													? "#10b981"
													: totalCoveragePercent > 40
													? "#f59e0b"
													: "#ef4444",
										}}
									/>
									<span
										className="relative inline-flex h-2.5 w-2.5 rounded-full"
										style={{
											backgroundColor:
												totalCoveragePercent > 80
													? "#22c55e"
													: totalCoveragePercent > 60
													? "#10b981"
													: totalCoveragePercent > 40
													? "#f59e0b"
													: "#ef4444",
										}}
									/>
								</span>
								<span className="text-sm font-semibold tracking-wide">
									{totalCoveragePercent.toFixed(2)}% complete
								</span>
							</Badge>
						</div>
					)}
				</section>

				{/* Database stats cards */}
				<section className="mt-10">
					{!errorMsg && (
						<DatabaseStats data={models} />
						// <DbStats models={models} benchmarks={allBenchmarks} />
					)}
					{errorMsg ? (
						<div className="mx-auto max-w-2xl rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-red-600">
							<span className="font-semibold">
								Failed to load data:{" "}
							</span>
							{errorMsg}
						</div>
					) : null}
				</section>

				{/* Contribution table/forms */}
				<section className="mt-8">
					{!errorMsg && <ModelEdits models={models} />}
				</section>
			</div>
		</main>
	);
}
