import ModelDetailShell from "@/components/(data)/model/ModelDetailShell";
import ModelPerformanceDashboard from "@/components/(data)/models/ModelPerformanceDashboard";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getModelPerformanceMetrics } from "@/lib/fetchers/models/getModelPerformance";
import { getModelTokenTrajectory } from "@/lib/fetchers/models/getModelTokenTrajectory";
import { getModelOverviewCached } from "@/lib/fetchers/models/getModel";
import {
	getModelIdFromParams,
	type ModelRouteParams,
} from "@/app/(dashboard)/models/model-route-helpers";

async function fetchModelOverview(modelId: string) {
	try {
		return await getModelOverviewCached(modelId);
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
	const model = await fetchModelOverview(modelId);

	if (!model) {
		return buildMetadata({
			title: "Model Performance Overview",
			description:
				"Track performance metrics and historical usage for AI models on AI Stats.",
			path: `/models/${modelId}/performance`,
			keywords: ["AI model performance", "AI metrics", "AI Stats"],
		});
	}

	const organisationName = model.organisation?.name ?? "AI provider";

	const description = [
		`${model.name} performance metrics by ${organisationName} on AI Stats.`,
		"See latency, token trajectory, and other runtime signals over time.",
	]
		.filter(Boolean)
		.join(" ");

	return buildMetadata({
		title: `${model.name} Performance - Latency & Token Trajectory`,
		description,
		path: `/models/${modelId}/performance`,
		keywords: [
			model.name,
			`${model.name} performance`,
			`${organisationName} AI`,
			"latency metrics",
			"token usage",
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

	const [performanceMetrics, tokenTrajectory] = await Promise.all([
		getModelPerformanceMetrics(modelId, 24),
		getModelTokenTrajectory(modelId),
	]);

	return (
		<ModelDetailShell modelId={modelId}>
			<ModelPerformanceDashboard
				metrics={performanceMetrics}
				tokenTrajectory={tokenTrajectory}
			/>
		</ModelDetailShell>
	);
}
