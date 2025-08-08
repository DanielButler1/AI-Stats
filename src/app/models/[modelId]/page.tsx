import { fetchAggregateData, fetchAllSubscriptionPlans } from "@/lib/fetchData";
import fs from "fs/promises";
import path from "path";
import type { Metadata } from "next";
import ModelDisplay from "@/components/model/ModelDisplay";

export async function generateMetadata(props: {
	params: Promise<{ modelId: string }>;
}): Promise<Metadata> {
	const params = await props.params;

	try {
		const models = await fetchAggregateData();
		const model = models.find((m: any) => m.id === params.modelId);
		if (!model) throw new Error();

		const providerName = model.provider?.name || "";
		const benchmarks =
			model.benchmark_results?.map(
				(b: any) => b.benchmark?.name || b.name
			) || [];
		const now = new Date();
		const month = now.toLocaleString("en-US", { month: "long" });
		const year = now.getFullYear();
		const title = `${model.name} Overview, Benchmarks, Features & Pricing - ${month} ${year}`;
		const description = model.description
			? `${model.description} Compare ${model.name} benchmarks, features, release timeline, and pricing across providers.`
			: `Learn about ${model.name} AI model: benchmarks, features, release timeline, and pricing. Compare ${model.name} to other models on AI Stats.`;
		const keywords = [
			model.name,
			`${model.name} benchmarks`,
			`${model.name} features`,
			`${model.name} pricing`,
			`${model.name} release date`,
			`${model.name} API`,
			providerName,
			"AI model comparison",
			"AI Stats",
			...benchmarks,
		];

		return {
			title,
			description,
			keywords,
			alternates: {
				canonical: `https://ai-stats.phaseo.app/models/${model.id}`,
			},
		};
	} catch {
		return {
			title: "AI Model Overview",
			description:
				"Explore AI model benchmarks, features, release timeline, and pricing on AI Stats.",
			keywords: [
				"AI model",
				"AI benchmarks",
				"AI features",
				"AI pricing",
				"AI Stats",
			],
		};
	}
}

export async function generateStaticParams() {
	const modelsDir = path.join(process.cwd(), "src/data/models");
	const params: { modelId: string }[] = [];
	const providerFolders = await fs.readdir(modelsDir);
	for (const provider of providerFolders) {
		const providerPath = path.join(modelsDir, provider);
		const modelFolders = await fs.readdir(providerPath);
		for (const m of modelFolders) {
			const modelPath = path.join(providerPath, m, "model.json");
			try {
				const file = await fs.readFile(modelPath, "utf-8");
				const model = JSON.parse(file);
				params.push({ modelId: model.id });
			} catch {
				continue;
			}
		}
	}
	return params;
}

export default async function ModelPage(props: {
	params: Promise<{ modelId: string }>;
}) {
	const params = await props.params;

	const models = await fetchAggregateData();
	const model = models.find((m) => m.id === params.modelId);

	const plans = await fetchAllSubscriptionPlans();

	return (
		<ModelDisplay model={model} models={models} subscriptionPlans={plans} />
	);
}
