import { buildMetadata } from "@/lib/seo";
import ModelDetailShell from "@/components/(data)/model/ModelDetailShell";
import ModelBenchmarks from "@/components/(data)/model/benchmarks/ModelBenchmarks";
import {
	getModelBenchmarkHighlights,
	getModelBenchmarkTableData,
	getModelBenchmarkComparisonData,
} from "@/lib/fetchers/models/getModelBenchmarkData";
import { getModelOverview } from "@/lib/fetchers/models/getModel";
import type { Metadata } from "next";
import {
	getModelIdFromParams,
	type ModelRouteParams,
} from "@/app/(dashboard)/models/model-route-helpers";

async function fetchModel(modelId: string) {
	try {
		return await getModelOverview(modelId);
	} catch (error) {
		console.warn("[seo] failed to load model overview for metadata", {
			modelId,
			error,
		});
		return null;
	}
}

export async function generateMetadata(props: {
	params: Promise<ModelRouteParams>;
}): Promise<Metadata> {
	const params = await props.params;
	const modelId = getModelIdFromParams(params);
	const model = await fetchModel(modelId);

	if (!model) {
		return buildMetadata({
			title: "Model Benchmarks Overview",
			description:
				"Explore detailed benchmark scores for AI models on AI Stats. Compare performance across industry-standard tests.",
			path: `/models/${modelId}/benchmarks`,
			keywords: ["AI model benchmarks", "AI performance", "AI Stats"],
		});
	}

	const organisationName = model.organisation?.name ?? "AI provider";

	const description = [
		`${model.name} benchmarks by ${organisationName} on AI Stats.`,
		"Review benchmark scores, comparisons, and trends across industry-standard evaluations.",
	]
		.filter(Boolean)
		.join(" ");

	return buildMetadata({
		title: `${model.name} Benchmarks - Performance Metrics & Comparisons`,
		description,
		path: `/models/${modelId}/benchmarks`,
		keywords: [
			model.name,
			`${model.name} benchmarks`,
			`${organisationName} AI`,
			"AI model performance",
			"benchmark comparisons",
			"AI Stats",
		],
	});
}

export default async function Page({
	params,
}: {
	params: Promise<ModelRouteParams>;
}) {
	const routeParams = await params;
	const modelId = getModelIdFromParams(routeParams);

	const [highlightCards, benchmarkTableData, comparisonData] =
		await Promise.all([
			getModelBenchmarkHighlights(modelId),
			getModelBenchmarkTableData(modelId),
			getModelBenchmarkComparisonData(modelId),
		]);

	return (
		<ModelDetailShell modelId={modelId}>
			<ModelBenchmarks
				modelId={modelId}
				benchmarkTableData={benchmarkTableData}
				benchmarkComparisonData={comparisonData}
				highlightCards={highlightCards}
			/>
		</ModelDetailShell>
	);
}
