"use client";

import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ExtendedModel } from "@/data/types";

interface BenchmarkCardProps {
	benchmark: any;
	models: ExtendedModel[];
	getModelCoveragePercentage: (benchmarkId: string) => number;
	getModelsCompletingBenchmark: (benchmarkId: string) => number;
	hasModelBenchmark: (model: ExtendedModel, benchmarkId: string) => boolean;
	getBenchmarkScore: (
		model: ExtendedModel,
		benchmarkId: string
	) => string | null;
	getScoreColorClass: (score: string | null) => string;
}

export default function BenchmarkCard({
	benchmark,
	models,
	getModelCoveragePercentage,
	getModelsCompletingBenchmark,
	hasModelBenchmark,
	getBenchmarkScore,
	getScoreColorClass,
}: BenchmarkCardProps) {
	return (
		<Card key={benchmark.id} className="overflow-hidden">
			<CardHeader className="p-4">
				<div className="flex flex-col">
					<Link
						href={`/benchmarks/${benchmark.id}`}
						className="hover:text-primary transition-colors font-medium"
					>
						{benchmark.name}
					</Link>
				</div>
			</CardHeader>

			<CardContent className="p-4 pt-0">
				{/* Coverage percentage */}
				<div className="flex justify-between items-center mb-4">
					<p className="text-sm font-medium">Coverage</p>
					<div className="flex items-center gap-2">
						<Badge
							className={cn(
								"px-2 py-0.5 transition-colors duration-150 cursor-pointer",
								getModelCoveragePercentage(benchmark.id) > 60
									? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/40"
									: getModelCoveragePercentage(benchmark.id) >
									  30
									? "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-800/40"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-700/60"
							)}
						>
							{getModelCoveragePercentage(benchmark.id)}%
						</Badge>
						<Badge
							variant="outline"
							className="px-2 py-0.5 text-xs text-muted-foreground border-muted-foreground/30 bg-transparent"
						>
							{getModelsCompletingBenchmark(benchmark.id)}/
							{
								models.filter((m) => m.status !== "Rumoured")
									.length
							}
						</Badge>
					</div>
				</div>
			</CardContent>

			<CardFooter className="p-4 pt-0">
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="models" className="border-0">
						<AccordionTrigger className="py-1 text-sm text-muted-foreground hover:text-foreground">
							View models needing this benchmark
						</AccordionTrigger>
						<AccordionContent>
							<div className="grid grid-cols-1 pt-2">
								<ScrollArea className="h-[300px] w-full">
									<div className="space-y-2">
										{models
											.filter(
												(m) => m.status !== "Rumoured"
											)
											.filter(
												(model) =>
													!hasModelBenchmark(
														model,
														benchmark.id
													)
											)
											.map((model) => (
												<div
													key={model.id}
													className="p-2 rounded-md flex items-center justify-between bg-gray-100 dark:bg-gray-800/20"
												>
													<div className="flex items-center gap-2">
														<div className="w-5 h-5 relative flex-shrink-0">
															<Image
																src={`/providers/${model.provider?.provider_id}.svg`}
																alt={
																	model
																		.provider
																		?.name ||
																	""
																}
																fill
																className="rounded-sm object-contain"
															/>
														</div>
														<Tooltip>
															<TooltipTrigger
																asChild
															>
																<Link
																	href={`/models/${model.id}`}
																	className="text-xs font-medium hover:text-primary transition-colors truncate "
																>
																	{model.name}
																</Link>
															</TooltipTrigger>
															<TooltipContent>
																<p>
																	{model.name}
																</p>
															</TooltipContent>
														</Tooltip>
													</div>
													<Badge
														variant="outline"
														className="text-xs bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
													>
														Missing
													</Badge>
												</div>
											))}
									</div>
								</ScrollArea>
							</div>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="completed" className="border-0">
						<AccordionTrigger className="py-1 text-sm text-muted-foreground hover:text-foreground">
							View models with this benchmark
						</AccordionTrigger>
						<AccordionContent>
							<div className="grid grid-cols-1 pt-2">
								<ScrollArea className="h-[300px] w-full">
									<div className="space-y-2">
										{models
											.filter(
												(m) => m.status !== "Rumoured"
											)
											.filter((model) =>
												hasModelBenchmark(
													model,
													benchmark.id
												)
											)
											.map((model) => {
												const score = getBenchmarkScore(
													model,
													benchmark.id
												);

												return (
													<div
														key={model.id}
														className="p-2 rounded-md flex items-center justify-between bg-green-50 dark:bg-green-950/20"
													>
														<div className="flex items-center gap-2">
															<div className="w-5 h-5 relative flex-shrink-0">
																<Image
																	src={`/providers/${model.provider?.provider_id}.svg`}
																	alt={
																		model
																			.provider
																			?.name ||
																		""
																	}
																	fill
																	className="rounded-sm object-contain"
																/>
															</div>
															<Tooltip>
																<TooltipTrigger
																	asChild
																>
																	<Link
																		href={`/models/${model.id}`}
																		className="text-xs font-medium hover:text-primary transition-colors truncate"
																	>
																		{
																			model.name
																		}
																	</Link>
																</TooltipTrigger>
																<TooltipContent>
																	<p>
																		{
																			model.name
																		}
																	</p>
																</TooltipContent>
															</Tooltip>
														</div>
														<Badge
															variant="outline"
															className={cn(
																"text-xs font-mono",
																getScoreColorClass(
																	score
																)
															)}
														>
															{score}
														</Badge>
													</div>
												);
											})}

										{models
											.filter(
												(m) => m.status !== "Rumoured"
											)
											.filter((model) =>
												hasModelBenchmark(
													model,
													benchmark.id
												)
											).length === 0 && (
											<div className="text-center text-xs text-muted-foreground">
												No models have this benchmark
											</div>
										)}
									</div>
								</ScrollArea>
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</CardFooter>
		</Card>
	);
}
