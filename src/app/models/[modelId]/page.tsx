import { TooltipProvider } from "@/components/ui/tooltip";
import { ExtendedModel } from "@/data/types";
import { fetchAggregateData } from "@/lib/fetchData";
import fs from "fs/promises";
import path from "path";
import type { Metadata } from "next";
import Header from "@/components/header";
import ModelHeader from "@/components/model/ModelHeader";
import ModelOverview from "@/components/model/ModelOverview";
import ModelQuickLinks from "@/components/model/ModelQuickLinks";
import ModelKeyMetrics from "@/components/model/ModelKeyMetrics";
import ModelInfoCard from "@/components/model/ModelInfoCard";
import ModelKeyFeatures from "@/components/model/ModelKeyFeatures";
import ModelReleaseTimeline from "@/components/model/ModelReleaseTimeline";
import ModelBenchmarksComparison from "@/components/model/ModelBenchmarksComparison";

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
		const title = `${model.name} Overview, Benchmarks, Features & Pricing | AI Stats`;
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
			title: "AI Model Overview | AI Stats",
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

	let models: ExtendedModel[] = [];
	let model: ExtendedModel | null = null;
	let provider: ExtendedModel["provider"] | null = null;
	let errorMsg = "";

	try {
		models = await fetchAggregateData();
		if (!models.length) {
			errorMsg = "Model not found";
		} else {
			// Find the current model by id
			model = models.find((m) => m.id === params.modelId) || null;
			provider = model ? model.provider : null;
			if (!model) {
				errorMsg = "Model not found";
			}
		}
	} catch (e: any) {
		errorMsg = e?.message || "Unknown error";
	}

	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<TooltipProvider>
				<div className="container mx-auto px-4 py-8">
					{errorMsg ? (
						<div className="text-center py-16">
							<h2 className="text-2xl font-bold text-red-600 mb-2">
								{errorMsg}
							</h2>
							<p>Please try refreshing the page.</p>
						</div>
					) : (
						model &&
						provider && (
							<div className="flex flex-col space-y-4">
								<ModelHeader
									model={model}
									provider={provider}
								/>
								<ModelOverview
									id={model.id}
									description={model.description}
								/>
								<ModelQuickLinks model={model} />
								<ModelKeyMetrics model={model} />
								<ModelInfoCard model={model} />
								<ModelKeyFeatures model={model} />
								<ModelReleaseTimeline
									model={model}
									allModels={models}
								/>
								<ModelBenchmarksComparison
									model={model}
									allModels={models}
								/>
							</div>
						)
					)}
				</div>
			</TooltipProvider>
		</main>
	);
}
