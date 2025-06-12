import Header from "@/components/header";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ModelBenchmarkChart from "@/components/benchmark/ModelBenchmarkChart";
import ModelsUsingBenchmark from "@/components/benchmark/ModelsUsingBenchmark";
import type { Benchmark } from "@/data/types";
import { fetchBenchmarks, fetchAggregateData } from "@/lib/fetchData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface BenchmarkPageProps {
	params: Promise<{
		id: string;
	}>;
}

export async function generateMetadata(
	props: BenchmarkPageProps
): Promise<Metadata> {
	const params = await props.params;

	try {
		const benchmarks = await fetchBenchmarks();
		const benchmark: Benchmark | undefined = benchmarks.find(
			(b) => b.id === params.id
		);

		if (!benchmark) {
			return {
				title: "Benchmark Not Found",
				description: "The requested benchmark could not be found.",
			};
		}

		return {
			title: `${benchmark.name} Benchmark`,
			description:
				benchmark.description ||
				`Explore the ${benchmark.name} benchmark and see how different AI models perform.`,
		};
	} catch (error) {
		return {
			title: "Benchmark Error",
			description: "There was an error loading the benchmark data.",
		};
	}
}

export async function generateStaticParams() {
	try {
		const benchmarks = await fetchBenchmarks();
		return benchmarks.map((benchmark: { id: string }) => ({
			id: benchmark.id,
		}));
	} catch (error) {
		console.error("Error generating static params for benchmarks:", error);
		return [];
	}
}

export default async function BenchmarkPage(props: BenchmarkPageProps) {
	const params = await props.params;

	let benchmark: Benchmark | null = null;
	let modelsWithBenchmark: any[] = [];

	try {
		const benchmarks = await fetchBenchmarks();
		benchmark = (benchmarks.find((b) => b.id === params.id) ||
			null) as Benchmark | null;

		if (!benchmark) {
			notFound();
		}

		// Fetch models data to find which ones use this benchmark
		const models = await fetchAggregateData();

		// Find models that use this benchmark by the benchmark_id
		modelsWithBenchmark = models.filter((model: any) => {
			if (
				!model.benchmark_results ||
				!Array.isArray(model.benchmark_results)
			) {
				return false;
			}

			return model.benchmark_results.some((br: any) => {
				// Check for benchmark_id match
				if (br.benchmark_id === params.id) {
					return true;
				}

				// Also check in enriched benchmark data
				if (br.benchmark && br.benchmark.id === params.id) {
					return true;
				}

				return false;
			});
		});
	} catch (error) {
		console.error(`Error fetching data for benchmark ${params.id}:`, error);
	}

	// If the benchmark still isn't found after API call, show 404
	if (!benchmark) {
		notFound();
	}
	// Group models by provider
	const modelsByProvider: Record<string, any[]> = {};
	modelsWithBenchmark.forEach((model) => {
		const providerName = model.provider?.name || "Unknown Provider";
		if (!modelsByProvider[providerName]) {
			modelsByProvider[providerName] = [];
		}
		modelsByProvider[providerName].push(model);
	});

	// Sort models within each provider by score (descending)
	Object.keys(modelsByProvider).forEach((provider) => {
		modelsByProvider[provider].sort((a, b) => {
			const aResult = a.benchmark_results?.find(
				(br: any) =>
					br.benchmark_id === params.id ||
					(br.benchmark && br.benchmark.id === params.id)
			);
			const bResult = b.benchmark_results?.find(
				(br: any) =>
					br.benchmark_id === params.id ||
					(br.benchmark && br.benchmark.id === params.id)
			);

			// Convert scores to numbers for comparison
			const aScore =
				parseFloat(String(aResult?.score || "0").replace("%", "")) || 0;
			const bScore =
				parseFloat(String(bResult?.score || "0").replace("%", "")) || 0;

			return bScore - aScore; // Descending order
		});
	});

	// Sort providers by number of models (descending)
	const sortedProviders = Object.keys(modelsByProvider).sort(
		(a, b) => modelsByProvider[b].length - modelsByProvider[a].length
	);

	// Set default accordion values to auto-expand the first provider
	const defaultAccordionValues =
		sortedProviders.length > 0 ? [sortedProviders[0]] : [];

	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<div className="container mx-auto px-4 py-8 space-y-4">
				{/* Title Card */}
				<Card className="shadow-lg bg-white dark:bg-zinc-950">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-3xl md:text-5xl font-bold mb-1 text-center md:text-left">
							{benchmark.name}
						</CardTitle>
						{benchmark.link && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											asChild
											size="sm"
											variant="outline"
											className="ml-auto"
										>
											<Link
												href={benchmark.link}
												target="_blank"
												rel="noopener noreferrer"
												aria-label={`Visit ${benchmark.name} page`}
											>
												<ExternalLink className="w-5 h-5 inline-block align-text-bottom" />
												<span className="sr-only">
													Twitter
												</span>
											</Link>
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										Visit benchmark page
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</CardHeader>
				</Card>
				{/* About Section - Full Width */}
				<Card className=" shadow-lg bg-white dark:bg-zinc-950">
					<CardHeader>
						<CardTitle className="text-2xl">
							About this Benchmark
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="prose dark:prose-invert max-w-none">
							<p className="text-muted-foreground">
								{benchmark.description ||
									"Unfortunately there isn't a description for this benchmark yet."}
							</p>
						</div>
					</CardContent>
				</Card>
				{/* Model Performance Chart - Full Width */}
				<Card className=" shadow-lg bg-white dark:bg-zinc-950">
					<CardHeader>
						<CardTitle className="text-2xl">
							Model Performance
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ModelBenchmarkChart
							models={modelsWithBenchmark}
							benchmarkName={benchmark.name}
						/>
					</CardContent>
				</Card>{" "}
				{/* Models Using This Benchmark - Now as a separate component */}
				<ModelsUsingBenchmark
					modelsWithBenchmark={modelsWithBenchmark}
					modelsByProvider={modelsByProvider}
					sortedProviders={sortedProviders}
					benchmarkId={params.id}
					defaultAccordionValues={defaultAccordionValues}
				/>
			</div>
		</main>
	);
}
