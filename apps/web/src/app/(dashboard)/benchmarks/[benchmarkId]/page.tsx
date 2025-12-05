import BenchmarkDetailShell from "@/components/(data)/benchmark/BenchmarkDetailShell";
import BenchmarkOverview from "@/components/(data)/benchmark/BenchmarkOverview";
import { getBenchmarkCached } from "@/lib/fetchers/benchmarks/getBenchmark";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

function parseScore(score: string | number | null | undefined): number | null {
	if (score == null) return null;
	if (typeof score === "number") return Number.isFinite(score) ? score : null;
	if (typeof score === "string") {
		const match = score.match(/[-+]?[0-9]*\.?[0-9]+/);
		if (!match) return null;
		const parsed = Number.parseFloat(match[0]);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
}

async function fetchBenchmark(benchmarkId: string) {
	try {
		return await getBenchmarkCached(benchmarkId);
	} catch (error) {
		console.warn("[seo] failed to load benchmark metadata", {
			benchmarkId,
			error,
		});
		return null;
	}
}

export async function generateMetadata(props: {
	params: Promise<{ benchmarkId: string }>;
}): Promise<Metadata> {
	const { benchmarkId } = await props.params;
	const benchmark = await fetchBenchmark(benchmarkId);
	const path = `/benchmarks/${benchmarkId}`;
	const imagePath = `/og/benchmarks/${benchmarkId}`;

	// Fallback if the benchmark can't be loaded
	if (!benchmark) {
		return buildMetadata({
			title: "AI Benchmark Leaderboard",
			description:
				"Explore AI benchmark leaderboards on AI Stats and compare model performance across tasks and datasets.",
			path,
			keywords: [
				"AI benchmark",
				"AI benchmark leaderboard",
				"model evaluation",
				"AI model performance",
				"AI Stats",
			],
			imagePath,
		});
	}

	const cleanName: string = benchmark.name ?? "AI benchmark";
	const results = benchmark.results ?? [];
	const orderHints = results
		.map(
			(result: any) => result?.benchmark?.order ?? result?.benchmark_order
		)
		.filter((value: unknown): value is string => typeof value === "string");
	const isLowerBetter = orderHints.some(
		(order) => order.toLowerCase() === "lower"
	);

	let bestScore: { value: number; modelName: string } | null = null;
	for (const result of results) {
		const numericScore = parseScore(result.score);
		if (numericScore != null) {
			const shouldReplace =
				!bestScore ||
				(isLowerBetter
					? numericScore < bestScore.value
					: numericScore > bestScore.value);
			if (shouldReplace) {
				bestScore = {
					value: numericScore,
					modelName:
						result.model?.name ??
						result.model_id ??
						"Unknown model",
				};
			}
		}
	}

	const topPerformer = bestScore?.modelName ?? null;
	const modelCount = benchmark.results?.length ?? 0;

	const descriptionParts: (string | undefined)[] = [
		`${cleanName} benchmark leaderboard on AI Stats.`,
		modelCount
			? `See ${modelCount} scored models, track historical performance, and inspect the underlying methodology.`
			: undefined,
		topPerformer ? `Current top model: ${topPerformer}.` : undefined,
	];

	return buildMetadata({
		title: `${cleanName} - Benchmark Leaderboard & Model Performance`,
		description: descriptionParts.filter(Boolean).join(" "),
		path,
		keywords: [
			cleanName,
			`${cleanName} benchmark`,
			`${cleanName} leaderboard`,
			"AI benchmark",
			"model evaluation",
			"AI model performance",
			"AI Stats",
		],
		imagePath,
	});
}

export default async function Page({
	params,
}: {
	params: Promise<{ benchmarkId: string }>;
}) {
	const { benchmarkId } = await params;
	const benchmark = await getBenchmarkCached(benchmarkId);

	if (!benchmark) {
		notFound();
	}

	return (
		<BenchmarkDetailShell benchmark={benchmark}>
			<BenchmarkOverview benchmark={benchmark} />
		</BenchmarkDetailShell>
	);
}
