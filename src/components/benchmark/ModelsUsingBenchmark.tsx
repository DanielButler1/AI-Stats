import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ModelsUsingBenchmarkProps {
	modelsWithBenchmark: any[];
	modelsByProvider: Record<string, any[]>;
	sortedProviders: string[];
	benchmarkId: string;
}

// Parse score function (same as ModelBenchmarkChart)
function parseScore(score: string | number): number | null {
	if (typeof score === "number") return score;
	if (typeof score === "string") {
		// Remove % and parse float
		const match = score.match(/([\d.]+)/);
		if (match) return parseFloat(match[1]);
	}
	return null;
}

export default function ModelsUsingBenchmark({
	modelsWithBenchmark,
	modelsByProvider,
	sortedProviders,
	benchmarkId,
}: ModelsUsingBenchmarkProps) {
	// Determine if lower is better for this benchmark
	const isLowerBetter = React.useMemo(() => {
		for (const model of modelsWithBenchmark) {
			const result = model.benchmark_results?.find(
				(br: any) =>
					br.benchmark_id === benchmarkId ||
					(br.benchmark && br.benchmark.id === benchmarkId)
			);
			if (
				result &&
				result.benchmark &&
				result.benchmark.order === "lower"
			) {
				return true;
			}
		}
		return false;
	}, [modelsWithBenchmark, benchmarkId]);

	// Sort models within each provider by score (lower or higher is better)
	const sortedModelsByProvider = React.useMemo(() => {
		const sorted: typeof modelsByProvider = {};
		sortedProviders.forEach((provider) => {
			sorted[provider] = [...modelsByProvider[provider]].sort((a, b) => {
				const aResult = a.benchmark_results?.find(
					(br: any) =>
						br.benchmark_id === benchmarkId ||
						(br.benchmark && br.benchmark.id === benchmarkId)
				);
				const bResult = b.benchmark_results?.find(
					(br: any) =>
						br.benchmark_id === benchmarkId ||
						(br.benchmark && br.benchmark.id === benchmarkId)
				);
				const aScore = aResult ? parseScore(aResult.score) : null;
				const bScore = bResult ? parseScore(bResult.score) : null;
				if (aScore == null && bScore == null) return 0;
				if (aScore == null) return 1;
				if (bScore == null) return -1;
				return isLowerBetter ? aScore - bScore : bScore - aScore;
			});
		});
		return sorted;
	}, [modelsByProvider, sortedProviders, benchmarkId, isLowerBetter]);

	return (
		<Card className="shadow-md bg-white dark:bg-zinc-950">
			<CardHeader className="px-4 py-3">
				<CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
					Models Using This Benchmark
					{modelsWithBenchmark.length > 0 && (
						<span className="text-muted-foreground text-sm sm:text-base font-normal">
							({modelsWithBenchmark.length})
						</span>
					)}
					{isLowerBetter && (
						<span className="ml-2 text-[10px] sm:text-xs text-blue-600 border border-blue-400 rounded px-1.5 py-0.5">
							Lower is better
						</span>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-2">
				{modelsWithBenchmark.length > 0 ? (
					<div className="space-y-4">
						{sortedProviders.map((provider, idx) => (
							<div key={provider} className="">
								{/* Provider header */}
								<div
									className={`flex items-center justify-between px-3 py-2 ${
										idx !== 0
											? "border-t border-zinc-200 dark:border-zinc-800"
											: ""
									}`}
								>
									<div className="flex items-center gap-2">
										<div className="h-7 w-7 relative flex items-center justify-center rounded-full border bg-white">
											<div className="w-4.5 h-4.5 relative">
												<Image
													src={`/providers/${modelsByProvider[provider][0]?.provider?.provider_id}.svg`}
													alt={provider}
													className="object-contain"
													fill
												/>
											</div>
										</div>
										<div className="flex items-center text-sm sm:text-base">
											<span className="font-semibold">
												{provider}
											</span>
											<span className="text-muted-foreground ml-2 text-xs sm:text-sm">
												(
												{
													modelsByProvider[provider]
														.length
												}{" "}
												{modelsByProvider[provider]
													.length === 1
													? "model"
													: "models"}
												)
											</span>
										</div>
									</div>
								</div>
								{/* Models grid */}
								<div className="px-3 pb-2">
									<div className="grid grid-cols-1 [@media(min-width:420px)]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
										{sortedModelsByProvider[provider].map(
											(model) => {
												const result =
													model.benchmark_results?.find(
														(br: any) =>
															br.benchmark_id ===
																benchmarkId ||
															(br.benchmark &&
																br.benchmark
																	.id ===
																	benchmarkId)
													);

												const rawScore =
													result?.score || "N/A";
												const isPercentage =
													typeof rawScore ===
														"string" &&
													rawScore.includes("%");
												const parsedScore =
													rawScore !== "N/A"
														? parseScore(rawScore)
														: null;

												let displayScore;
												if (parsedScore !== null) {
													displayScore =
														parsedScore.toFixed(2) +
														(isPercentage
															? "%"
															: "");
												} else if (
													rawScore !== "N/A" &&
													typeof rawScore === "string"
												) {
													displayScore = rawScore;
												} else {
													displayScore = rawScore;
												}

												return (
													<Card
														key={model.id}
														className="overflow-hidden transition-shadow hover:shadow-md border border-zinc-100 dark:border-zinc-800"
													>
														<CardContent className="p-3">
															<div className="flex justify-between items-start gap-2">
																<div className="flex-1 min-w-0">
																	<Link
																		href={`/models/${model.id}`}
																		className="text-sm sm:text-base font-semibold hover:text-primary transition-colors inline-flex items-center gap-1 truncate"
																		title={
																			model.name
																		}
																	>
																		{
																			model.name
																		}
																		<ChevronRight className="h-3 w-3 shrink-0" />
																	</Link>
																	<div className="text-[11px] text-muted-foreground truncate">
																		{model
																			.provider
																			?.display_name ||
																			model
																				.provider
																				?.provider_id}
																	</div>
																</div>
																<div className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[11px] font-semibold ml-2 shrink-0 leading-none">
																	{
																		displayScore
																	}
																</div>
															</div>
														</CardContent>
													</Card>
												);
											}
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-muted-foreground">
						No models currently using this benchmark in our
						database.
					</p>
				)}
			</CardContent>
		</Card>
	);
}
