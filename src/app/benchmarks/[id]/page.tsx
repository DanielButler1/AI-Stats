import Header from "@/components/Header";
import BenchmarkMetrics from "@/components/benchmark/BenchmarkMetrics";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ModelBenchmarkChart from "@/components/benchmark/ModelBenchmarkChart";
import ModelsUsingBenchmark from "@/components/benchmark/ModelsUsingBenchmark";
import type { Benchmark } from "@/data/types";
import { fetchBenchmarks, fetchAggregateData } from "@/lib/fetchData";
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

	const benchmarks = await fetchBenchmarks();
	const benchmark: Benchmark | undefined = benchmarks.find(
		(b) => b.id === params.id
	);

	if (!benchmark) {
		return {
			title: "Benchmark Not Found",
			description:
				"The requested AI model benchmark could not be found on AI Stats.",
			alternates: {
				canonical: `https://ai-stats.phaseo.app/benchmarks/${params.id}`,
			},
		};
	}

	return {
		title: `${benchmark.name} Benchmark | Scores, Usage & Model Performance`,
		description: benchmark.description
			? `${benchmark.description} See which AI models use the ${benchmark.name} benchmark, compare scores, and explore detailed performance data.`
			: `Explore the ${benchmark.name} benchmark. See which AI models use it, compare scores, and view detailed performance data on AI Stats.`,
		keywords: [
			benchmark.name,
			"AI benchmark",
			"AI model benchmarks",
			"benchmark scores",
			"compare AI models",
			"AI model evaluation",
			"machine learning benchmarks",
			"AI Stats",
		],
		alternates: {
			canonical: `https://ai-stats.phaseo.app/benchmarks/${params.id}`,
		},
	};
}

export async function generateStaticParams() {
	try {
		const benchmarks = await fetchBenchmarks();
		const paramsList = benchmarks.map((benchmark: { id: string }) => ({
			id: benchmark.id,
		}));
		return paramsList;
	} catch (error) {
		console.error("Error generating static params for benchmarks:", error);
		return [];
	}
}

export default async function BenchmarkPage(props: BenchmarkPageProps) {
	const params = await props.params;

	let benchmark: Benchmark | null = null;
	let modelsWithBenchmark: any[] = [];

	const benchmarks = await fetchBenchmarks();
	benchmark = (benchmarks.find((b) => b.id === params.id) ||
		null) as Benchmark | null;

	if (!benchmark) {
		return (
			<main className="flex min-h-screen flex-col">
				<Header />
				<div className="container mx-auto px-4 py-8">
					<div className="rounded-lg border border-dashed p-6 md:p-8 text-center bg-muted/30">
						<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
							<span className="text-xl">📊</span>
						</div>
						<p className="text-base font-medium">
							Benchmark not found
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							We&apos;re continuously adding new benchmarks. Have
							a benchmark to suggest or contribute?
						</p>
						<div className="mt-3">
							<a
								href="https://github.com/DanielButler1/AI-Stats"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
							>
								Contribute on GitHub
							</a>
						</div>
					</div>
				</div>
			</main>
		);
	}

	// Fetch models data
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
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
					<h1 className="font-bold text-xl text-black mb-2 md:mb-0">
						{benchmark.name}
					</h1>
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
				</div>
				{/* Benchmark Stats Row */}
				<BenchmarkMetrics
					modelsWithBenchmark={modelsWithBenchmark}
					benchmarkId={params.id}
				/>
				{/* Model Performance Chart - Full Width */}
				<ModelBenchmarkChart
					models={modelsWithBenchmark}
					benchmarkName={benchmark.name}
				/>
				{/* Models Using This Benchmark - Now as a separate component */}
				<ModelsUsingBenchmark
					modelsWithBenchmark={modelsWithBenchmark}
					modelsByProvider={modelsByProvider}
					sortedProviders={sortedProviders}
					benchmarkId={params.id}
				/>
			</div>
		</main>
	);
}
