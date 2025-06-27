import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

interface ModelsUsingBenchmarkProps {
	modelsWithBenchmark: any[];
	modelsByProvider: Record<string, any[]>;
	sortedProviders: string[];
	benchmarkId: string;
	defaultAccordionValues: string[];
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
	defaultAccordionValues,
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
		<Card className=" shadow-lg bg-white dark:bg-zinc-950">
			<CardHeader>
				<CardTitle className="text-2xl flex items-center gap-2">
					Models Using This Benchmark
					{modelsWithBenchmark.length > 0 && (
						<span className="text-muted-foreground text-base font-normal">
							({modelsWithBenchmark.length})
						</span>
					)}
					{isLowerBetter && (
						<span className="ml-2 text-xs text-blue-600 border border-blue-400 rounded px-2 py-0.5">
							Lower is better
						</span>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{modelsWithBenchmark.length > 0 ? (
					<Accordion
						type="multiple"
						className="w-full"
						defaultValue={defaultAccordionValues}
					>
						{sortedProviders.map((provider) => (
							<AccordionItem
								value={provider}
								key={provider}
								className="border-b border-zinc-200 dark:border-zinc-800"
							>
								{" "}
								<AccordionTrigger className="hover:no-underline hover:bg-zinc-50 dark:hover:bg-zinc-900 px-3 py-2 rounded-md">
									<div className="flex items-center gap-2">
										<div className="h-6 w-6 relative flex items-center justify-center rounded-full border bg-white">
											<div className="w-4 h-4 relative">
												<Image
													src={`/providers/${modelsByProvider[provider][0]?.provider?.provider_id}.svg`}
													alt={provider}
													className="object-contain"
													fill
												/>
											</div>
										</div>
										<span className="font-semibold">
											{provider}
										</span>
										<span className="text-muted-foreground text-sm ml-2">
											({modelsByProvider[provider].length}{" "}
											{modelsByProvider[provider]
												.length === 1
												? "model"
												: "models"}
											)
										</span>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-2">
										{sortedModelsByProvider[provider].map(
											(model) => {
												// Find the benchmark result for this model
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

												// Parse and prepare the score for display
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

												// Format the display score
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
														className="overflow-hidden transition-all hover:shadow-lg border border-zinc-100 dark:border-zinc-800"
													>
														<CardContent className="p-3">
															<div className="flex justify-between items-center">
																<div className="flex items-center">
																	<div className="min-w-0">
																		<Link
																			href={`/models/${model.id}`}
																			className="text-base font-semibold hover:text-primary transition-colors inline-flex items-center gap-1 truncate"
																		>
																			{model
																				.name
																				.length >
																			20
																				? model.name.substring(
																						0,
																						18
																				  ) +
																				  "..."
																				: model.name}{" "}
																			<ChevronRight className="h-3 w-3 flex-shrink-0" />
																		</Link>
																	</div>
																</div>
																<div className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold ml-2 flex-shrink-0">
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
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
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
