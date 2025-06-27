"use client";

import { ExtendedModel } from "@/data/types";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "motion/react";
import {
	ExternalLink,
	FileText,
	Play,
	Code2,
	Award,
	Box,
	Megaphone,
	Github,
	Download,
	Globe,
	Twitter,
} from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import Image from "next/image";

interface SourcesDisplayProps {
	models: ExtendedModel[];
}

export default function SourcesDisplay({ models }: SourcesDisplayProps) {
	// Filter models that have at least one source
	const modelsWithSources = models.filter(
		(model) =>
			model.api_reference_link ||
			model.playground_link ||
			model.paper_link ||
			model.announcement_link ||
			model.repository_link ||
			model.weights_link ||
			(model.benchmark_results && model.benchmark_results.length > 0)
	);

	// Group models by provider
	const modelsByProvider = modelsWithSources.reduce((acc, model) => {
		const providerId = model.provider.provider_id;
		if (!acc[providerId]) {
			acc[providerId] = [];
		}
		acc[providerId].push(model);
		return acc;
	}, {} as Record<string, ExtendedModel[]>);

	// Filter out empty providers
	const hasModels = Object.keys(modelsByProvider).length > 0;
	return (
		<TooltipProvider>
			<motion.section
				className="container mx-auto px-4 py-8"
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<div className="max-w-6xl mx-auto">
					<Card className="flex items-center gap-3 mb-6">
						<CardHeader className="text-3xl font-bold">
							<CardHeader className="p-0">
								Sources & References
							</CardHeader>
							<CardDescription>
								A comprehensive collection of sources,
								documentation, and benchmark references for all
								models and providers.
							</CardDescription>
						</CardHeader>
					</Card>

					{!hasModels ? (
						<div className="text-center text-muted-foreground py-8">
							No models with sources available at this time.
						</div>
					) : (
						<div className="space-y-6">
							{Object.entries(modelsByProvider).map(
								([providerId, providerModels]) => {
									const provider = providerModels[0].provider;
									return (
										<Card
											key={providerId}
											className="shadow-lg hover:shadow-xl transition-shadow"
										>
											<CardHeader>
												<div className="flex items-center justify-between">
													<CardTitle className="text-2xl flex items-center gap-4">
														<div className="p-1 rounded-lg bg-white/10 backdrop-blur">
															<img
																src={`/providers/${provider.provider_id}.svg`}
																alt={
																	provider.name
																}
																className="w-8 h-8"
															/>
														</div>
														{provider.name}
													</CardTitle>{" "}
													<div>
														{provider.twitter && (
															<Tooltip>
																<TooltipTrigger
																	asChild
																>
																	<Button
																		variant="ghost"
																		size="icon"
																		asChild
																		className="h-9 w-9"
																	>
																		<a
																			href={
																				provider.twitter
																			}
																			target="_blank"
																			rel="noopener noreferrer"
																			className="text-muted-foreground hover:text-primary transition-colors"
																		>
																			<Image
																				src={
																					"/twitter_light.svg"
																				}
																				alt="Twitter"
																				width={
																					16
																				}
																				height={
																					16
																				}
																				className="h-4 w-4"
																			/>
																		</a>
																	</Button>
																</TooltipTrigger>
																<TooltipContent>
																	<p>
																		{
																			provider.name
																		}{" "}
																		Twitter
																	</p>
																</TooltipContent>
															</Tooltip>
														)}
														{provider.website && (
															<Tooltip>
																<TooltipTrigger
																	asChild
																>
																	<Button
																		variant="ghost"
																		size="icon"
																		asChild
																		className="h-9 w-9"
																	>
																		<a
																			href={
																				provider.website
																			}
																			target="_blank"
																			rel="noopener noreferrer"
																			className="text-muted-foreground hover:text-primary transition-colors"
																		>
																			<Globe className="h-5 w-5" />
																		</a>
																	</Button>
																</TooltipTrigger>
																<TooltipContent>
																	<p>
																		{
																			provider.name
																		}{" "}
																		website
																	</p>
																</TooltipContent>
															</Tooltip>
														)}
													</div>
												</div>
											</CardHeader>

											<CardContent>
												<ScrollArea className="w-full">
													<Accordion
														type="multiple"
														className="w-full space-y-4"
													>
														{providerModels.map(
															(model) => (
																<AccordionItem
																	key={
																		model.id
																	}
																	value={
																		model.id
																	}
																	className="border-none"
																>
																	<AccordionTrigger className="flex items-center justify-between px-6 py-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors [&[data-state=open]>svg]:rotate-180">
																		<div className="flex items-center gap-3">
																			<span className="text-xl font-semibold">
																				{
																					model.name
																				}
																			</span>
																		</div>
																	</AccordionTrigger>
																	<AccordionContent className="px-6 pt-4">
																		<div>
																			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
																				{model.api_reference_link && (
																					<Button
																						variant="outline"
																						asChild
																						className="w-full justify-start gap-3 h-auto py-3"
																					>
																						<a
																							href={
																								model.api_reference_link
																							}
																							target="_blank"
																							rel="noopener noreferrer"
																						>
																							<Code2 className="h-5 w-5" />
																							<div className="flex flex-col items-start">
																								<span className="font-medium">
																									API
																									Reference
																								</span>
																								<span className="text-xs text-muted-foreground">
																									Documentation
																								</span>
																							</div>
																						</a>
																					</Button>
																				)}
																				{model.playground_link && (
																					<Button
																						variant="outline"
																						asChild
																						className="w-full justify-start gap-3 h-auto py-3"
																					>
																						<a
																							href={
																								model.playground_link
																							}
																							target="_blank"
																							rel="noopener noreferrer"
																						>
																							<Play className="h-5 w-5" />
																							<div className="flex flex-col items-start">
																								<span className="font-medium">
																									Playground
																								</span>
																								<span className="text-xs text-muted-foreground">
																									Try
																									it
																									out
																								</span>
																							</div>
																						</a>
																					</Button>
																				)}
																				{model.paper_link && (
																					<Button
																						variant="outline"
																						asChild
																						className="w-full justify-start gap-3 h-auto py-3"
																					>
																						<a
																							href={
																								model.paper_link
																							}
																							target="_blank"
																							rel="noopener noreferrer"
																						>
																							<FileText className="h-5 w-5" />
																							<div className="flex flex-col items-start">
																								<span className="font-medium">
																									Research
																									Paper
																								</span>
																								<span className="text-xs text-muted-foreground">
																									Technical
																									details
																								</span>
																							</div>
																						</a>
																					</Button>
																				)}
																				{model.announcement_link && (
																					<Button
																						variant="outline"
																						asChild
																						className="w-full justify-start gap-3 h-auto py-3"
																					>
																						<a
																							href={
																								model.announcement_link
																							}
																							target="_blank"
																							rel="noopener noreferrer"
																						>
																							<Megaphone className="h-5 w-5" />
																							<div className="flex flex-col items-start">
																								<span className="font-medium">
																									Announcement
																								</span>
																								<span className="text-xs text-muted-foreground">
																									Release
																									details
																								</span>
																							</div>
																						</a>
																					</Button>
																				)}
																				{model.repository_link && (
																					<Button
																						variant="outline"
																						asChild
																						className="w-full justify-start gap-3 h-auto py-3"
																					>
																						<a
																							href={
																								model.repository_link
																							}
																							target="_blank"
																							rel="noopener noreferrer"
																						>
																							<Github className="h-5 w-5" />
																							<div className="flex flex-col items-start">
																								<span className="font-medium">
																									Repository
																								</span>
																								<span className="text-xs text-muted-foreground">
																									Source
																									code
																								</span>
																							</div>
																						</a>
																					</Button>
																				)}
																				{model.weights_link && (
																					<Button
																						variant="outline"
																						asChild
																						className="w-full justify-start gap-3 h-auto py-3"
																					>
																						<a
																							href={
																								model.weights_link
																							}
																							target="_blank"
																							rel="noopener noreferrer"
																						>
																							<Download className="h-5 w-5" />
																							<div className="flex flex-col items-start">
																								<span className="font-medium">
																									Weights
																								</span>
																								<span className="text-xs text-muted-foreground">
																									Model
																									weights
																								</span>
																							</div>
																						</a>
																					</Button>
																				)}
																			</div>

																			{model.benchmark_results &&
																				model
																					.benchmark_results
																					.length >
																					0 && (
																					<div className="mt-6 bg-background/50 rounded-lg p-4">
																						<div className="flex items-center gap-2 mb-4">
																							<Award className="h-5 w-5 text-primary" />
																							<h4 className="font-medium">
																								Benchmark
																								Results
																							</h4>
																						</div>
																						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
																							{model.benchmark_results.map(
																								(
																									benchmark,
																									index
																								) => (
																									<div
																										key={
																											index
																										}
																										className="flex flex-col gap-2 p-3 rounded-lg bg-muted/50"
																									>
																										<span className="font-medium">
																											{
																												benchmark
																													.benchmark
																													.name
																											}
																										</span>
																										{benchmark.source_link ? (
																											<Button
																												variant="default"
																												size="sm"
																												asChild
																												className="h-7 px-2"
																											>
																												<a
																													href={
																														benchmark.source_link
																													}
																													target="_blank"
																													rel="noopener noreferrer"
																													className="text-xs text-muted-foreground hover:text-primary flex items-left gap-1"
																												>
																													<ExternalLink className="h-3 w-3" />
																													<span>
																														Source
																													</span>
																												</a>
																											</Button>
																										) : (
																											<Button
																												variant="destructive"
																												size="sm"
																												asChild
																												className="h-7 px-2"
																											>
																												<Link
																													href="/contribute"
																													target="_blank"
																													rel="noopener noreferrer"
																													className="text-xs text-muted-foreground hover:text-primary flex items-left gap-1"
																												>
																													<ExternalLink className="h-3 w-3" />
																													<span>
																														Contribute
																														By
																														Adding
																														A
																														Source!
																													</span>
																												</Link>
																											</Button>
																										)}
																									</div>
																								)
																							)}
																						</div>
																					</div>
																				)}
																		</div>
																	</AccordionContent>
																</AccordionItem>
															)
														)}
													</Accordion>
												</ScrollArea>
											</CardContent>
										</Card>
									);
								}
							)}
						</div>
					)}
				</div>
			</motion.section>
		</TooltipProvider>
	);
}
