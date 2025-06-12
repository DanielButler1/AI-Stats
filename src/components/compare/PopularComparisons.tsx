import { Card, CardContent } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ExtendedModel } from "@/data/types";
import Image from "next/image";

function getGPQAScore(model: ExtendedModel): number | null {
	const gpqaResult = model.benchmark_results?.find(
		(b) => b.benchmark_id.toLowerCase() === "gpqa"
	);
	if (!gpqaResult) return null;
	const score = gpqaResult.score.toString();
	const numericScore = parseFloat(score.replace("%", ""));
	// Convert decimal to percentage if needed
	return numericScore < 1 ? numericScore * 100 : numericScore;
}

function generatePopularComparisons(models: ExtendedModel[]) {
	const now = new Date();
	const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

	// Helper functions
	const getModelScore = (m: ExtendedModel) => {
		const gpqaScore = getGPQAScore(m) || 0;
		const recencyBonus = m.release_date
			? Math.min(
					10,
					(new Date(m.release_date).getTime() -
						sixMonthsAgo.getTime()) /
						(30 * 24 * 60 * 60 * 1000)
			  )
			: 0;
		return gpqaScore + recencyBonus;
	};

	const getTopNByScore = (models: ExtendedModel[], n: number) => {
		return [...models]
			.sort((a, b) => getModelScore(b) - getModelScore(a))
			.slice(0, n);
	};

	const findPreviousVersion = (
		model: ExtendedModel,
		allModels: ExtendedModel[]
	) => {
		const nameWithoutVersion = model.name.replace(/\s*\d+(\.\d+)*$/, "");
		const currentVersion = model.name.match(/\d+(\.\d+)*$/)?.[0];
		if (!currentVersion) return null;

		return allModels
			.filter(
				(m) =>
					m.provider.provider_id === model.provider.provider_id &&
					m.id !== model.id &&
					m.name.startsWith(nameWithoutVersion) &&
					m.name.match(/\d+(\.\d+)*$/)
			)
			.sort(
				(a, b) =>
					new Date(b.release_date!).getTime() -
					new Date(a.release_date!).getTime()
			)[0];
	};

	// Filter models
	const recentModels = models.filter((m) => {
		if (!m.release_date) return false;
		const releaseDate = new Date(m.release_date);
		return releaseDate >= sixMonthsAgo;
	});

	const recentModelsWithGPQA = recentModels.filter(
		(m) => getGPQAScore(m) !== null
	);
	const comparisons: { title: string; ids: string[]; score: number }[] = [];

	// 1. Top 2 Models Overall (highest GPQA + recency bonus)
	const top2Models = getTopNByScore(recentModelsWithGPQA, 2);
	if (top2Models.length === 2) {
		comparisons.push({
			title: `${top2Models[0].name} vs ${top2Models[1].name}`,
			ids: top2Models.map((m) => m.id),
			score: 100,
		});
	}

	// 2. Major Provider Battle (OpenAI vs Anthropic vs Google)
	const providerBattleModels = ["openai", "anthropic", "google"]
		.map(
			(providerId) =>
				getTopNByScore(
					recentModelsWithGPQA.filter(
						(m) => m.provider.provider_id === providerId
					),
					1
				)[0]
		)
		.filter(Boolean);

	if (providerBattleModels.length >= 2) {
		comparisons.push({
			title: providerBattleModels.map((m) => m.name).join(" vs "),
			ids: providerBattleModels.map((m) => m.id),
			score: 95,
		});
	}

	// 3. Latest Model vs Previous Version or Best OpenAI Alternative
	const latestModel = recentModelsWithGPQA.sort(
		(a, b) =>
			new Date(b.release_date!).getTime() -
			new Date(a.release_date!).getTime()
	)[0];

	if (latestModel) {
		const previousVersion = findPreviousVersion(
			latestModel,
			recentModelsWithGPQA
		);

		if (previousVersion) {
			comparisons.push({
				title: `${latestModel.name} vs ${previousVersion.name}`,
				ids: [latestModel.id, previousVersion.id],
				score: 90,
			});
		} else {
			// Find closest GPQA score from OpenAI
			const openaiModels = recentModelsWithGPQA.filter(
				(m) =>
					m.provider.provider_id === "openai" &&
					m.id !== latestModel.id
			);
			const latestScore = getGPQAScore(latestModel);

			if (latestScore && openaiModels.length > 0) {
				const closestOpenAI = openaiModels.sort(
					(a, b) =>
						Math.abs(getGPQAScore(a)! - latestScore) -
						Math.abs(getGPQAScore(b)! - latestScore)
				)[0];
				comparisons.push({
					title: `${latestModel.name} vs ${closestOpenAI.name}`,
					ids: [latestModel.id, closestOpenAI.id],
					score: 90,
				});
			}
		}
	}

	// 4. US vs China comparison
	const usModels = recentModelsWithGPQA.filter(
		(m) => m.provider.country_code === "US"
	);
	const chinaModels = recentModelsWithGPQA.filter(
		(m) => m.provider.country_code === "CN"
	);

	const bestUsModel = getTopNByScore(usModels, 1)[0];
	const bestChinaModel = getTopNByScore(chinaModels, 1)[0];

	if (bestUsModel && bestChinaModel) {
		comparisons.push({
			title: `${bestUsModel.name} vs ${bestChinaModel.name}`,
			ids: [bestUsModel.id, bestChinaModel.id],
			score: 85,
		});
	}

	// 5. Open Source vs Proprietary
	const openSourceModels = recentModelsWithGPQA.filter(
		(m) => m.license && m.license.toLowerCase() !== "proprietary"
	);
	const proprietaryModels = recentModelsWithGPQA.filter(
		(m) => m.license?.toLowerCase() === "proprietary"
	);

	const bestOpenSource = getTopNByScore(openSourceModels, 1)[0];
	const bestProprietary = getTopNByScore(proprietaryModels, 1)[0];

	if (bestOpenSource && bestProprietary) {
		comparisons.push({
			title: `${bestOpenSource.name} vs ${bestProprietary.name}`,
			ids: [bestOpenSource.id, bestProprietary.id],
			score: 80,
		});
	}

	// 6. Specialized Domain Battle (e.g., Code vs Text)
	const usedIds = new Set(comparisons.flatMap((c) => c.ids));
	const remainingModels = recentModelsWithGPQA
		.filter((m) => !usedIds.has(m.id))
		.sort((a, b) => {
			const aCode = a.benchmark_results?.some(
				(b) => b.benchmark_id === "codeforces"
			)
				? 1
				: 0;
			const bCode = b.benchmark_results?.some(
				(b) => b.benchmark_id === "codeforces"
			)
				? 1
				: 0;
			return bCode - aCode;
		});

	if (remainingModels.length >= 2) {
		const specialized = remainingModels.slice(0, 2);
		comparisons.push({
			title: `${specialized[0].name} vs ${specialized[1].name}`,
			ids: specialized.map((m) => m.id),
			score: 75,
		});
	}

	// Sort by score and ensure no duplicate models
	const finalComparisons = new Set<string>();
	return comparisons
		.sort((a, b) => b.score - a.score)
		.filter((comp) => {
			const key = comp.ids.sort().join("-");
			if (finalComparisons.has(key)) return false;
			finalComparisons.add(key);
			return true;
		})
		.slice(0, 6);
}

export default function PopularComparisons({
	models,
	setSelected,
}: {
	models: ExtendedModel[];
	setSelected: (ids: string[]) => void;
}) {
	const POPULAR_COMPARISONS = generatePopularComparisons(models);
	return (
		<div className="w-full max-w-4xl mx-auto">
			<h3 className="text-2xl font-bold mb-6 text-center tracking-tight">
				Popular Comparisons
			</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{POPULAR_COMPARISONS.map((comp) => {
					// Get ordered model information
					const orderedModels = comp.ids
						.map((id) => models.find((m) => m.id === id))
						.filter(Boolean) as ExtendedModel[];

					const providers = orderedModels.map((m) => m.provider);

					// Create consistent title
					const orderedTitle = orderedModels
						.map((m) => m.name)
						.join(" vs ");

					return (
						<Card
							key={comp.title}
							className="relative cursor-pointer hover:ring-2 hover:ring-primary/50 transition group min-h-[180px]"
							onClick={() => setSelected(comp.ids)}
						>
							<CardContent className="p-4 flex flex-col h-full gap-3">
								{/* Provider logos at the top */}
								<div className="flex gap-1.5 justify-center">
									{providers.map((provider) =>
										provider ? (
											<div
												key={provider.provider_id}
												className="relative flex items-center justify-center rounded-full border bg-white w-7 h-7 shadow-sm group-hover:opacity-80 transition"
											>
												<div className="relative w-5 h-5">
													<Image
														src={`/providers/${provider.provider_id}.svg`}
														alt={provider.name}
														fill
														className="object-contain"
													/>
												</div>
											</div>
										) : null
									)}
								</div>
								{/* Title in the middle */}
								<div className="text-sm font-medium text-center group-hover:text-primary transition-colors line-clamp-2">
									{orderedTitle}
								</div>{" "}
								{/* Model IDs at the bottom */}
								<div className="flex flex-wrap gap-1.5 justify-center mt-auto">
									{orderedModels.map((model) => (
										<TooltipProvider
											key={model.id}
											delayDuration={200}
										>
											<Tooltip>
												<TooltipTrigger asChild>
													<span className="flex items-center text-xs bg-muted/50 px-2 py-0.5 rounded-full border">
														<span className="truncate max-w-[120px] opacity-75">
															{model.id}
														</span>
													</span>
												</TooltipTrigger>
												<TooltipContent>
													<p className="text-xs">
														{model.id}
													</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									))}
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
