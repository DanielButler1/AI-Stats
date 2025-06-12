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

export default function ModelsUsingBenchmark({
	modelsWithBenchmark,
	modelsByProvider,
	sortedProviders,
	benchmarkId,
	defaultAccordionValues,
}: ModelsUsingBenchmarkProps) {
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
								<AccordionTrigger className="hover:no-underline hover:bg-zinc-50 dark:hover:bg-zinc-900 px-3 py-2 rounded-md">
									<div className="flex items-center gap-2">
										<div className="h-6 w-6 relative flex items-center justify-center">
											<Image
												src={`/providers/${modelsByProvider[provider][0]?.provider?.provider_id}.svg`}
												alt={provider}
												width={24}
												height={24}
												className="object-contain bg-white p-0.5 rounded-full"
											/>
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
										{modelsByProvider[provider].map(
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
												const score =
													result?.score || "N/A";

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
																	{(() => {
																		if (
																			typeof score ===
																			"number"
																		) {
																			return (
																				score.toFixed(
																					1
																				) +
																				"%"
																			);
																		} else if (
																			typeof score ===
																				"string" &&
																			score !==
																				"N/A"
																		) {
																			// Handle percentage strings
																			return score.includes(
																				"%"
																			)
																				? score
																				: score +
																						"%";
																		} else {
																			return score;
																		}
																	})()}
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
