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
	Download,
	Github as GithubIcon,
	Megaphone,
} from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";
import Image from "next/image";

interface SourcesDisplayProps {
	models: ExtendedModel[];
}

export default function SourcesDisplay({ models }: SourcesDisplayProps) {
	// Only include models with at least one source
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

	// Group by provider
	const modelsByProvider = modelsWithSources.reduce((acc, model) => {
		const id = model.provider.provider_id;
		if (!acc[id])
			acc[id] = {
				providerName: model.provider.name,
				providerId: id,
				items: [] as ExtendedModel[],
			};
		acc[id].items.push(model);
		return acc;
	}, {} as Record<string, { providerName: string; providerId: string; items: ExtendedModel[] }>);

	const hasModels = Object.keys(modelsByProvider).length > 0;

	return (
		<TooltipProvider>
			<motion.section
				className="container mx-auto px-4 py-8"
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<div className="mx-auto">
					<h1 className="font-bold text-xl text-black mb-2 md:mb-0">
						Sources & References
					</h1>
					<p className="text-muted-foreground text-base mb-4">
						A comprehensive collection of sources, documentation, and benchmark references for all models and providers.
					</p>
					{!hasModels ? (
						<div className="text-center text-muted-foreground py-8">
							No models with sources available at this time.
						</div>
					) : (
						<div className="space-y-8">
							{Object.values(modelsByProvider).map(
								({ providerName, providerId, items }) => (
									<div key={providerId} className="space-y-4">
										{/* Provider header */}
										<div className="flex items-center gap-3">
											<div className="p-1 rounded bg-white/10">
												<Image
													src={`/providers/${providerId}.svg`}
													alt={providerName}
													width={28}
													height={28}
													className="w-7 h-7"
												/>
											</div>
											<h2 className="text-xl font-semibold">
												{providerName}
											</h2>
										</div>

										{/* Models grid for this provider */}
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{items.map((model) => (
												<Card
													key={model.id}
													className="shadow-xs hover:shadow-md transition-shadow"
												>
													<CardHeader className="space-y-2">
														<div className="flex items-center justify-between">
															<CardTitle className="text-base truncate">
																{model.name}
															</CardTitle>
														</div>
													</CardHeader>

													<CardContent>
														<ScrollArea className="w-full">
															<Accordion
																type="multiple"
																className="w-full"
															>
																<AccordionItem
																	value={`${model.id}-sources`}
																	className="border-none"
																>
																	<AccordionTrigger className="flex items-center justify-between rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors [&[data-state=open]>svg]:rotate-180">
																		<div className="flex items-center">
																			<span className="text-md font-semibold">
																				Sources
																			</span>
																		</div>
																	</AccordionTrigger>
																	<AccordionContent>
																		<div className="grid grid-cols-1 gap-2">
																			{/* Sources grid */}
																			<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
																							<GithubIcon className="h-5 w-5" />
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
																					<div className="mt-4 bg-background/50 rounded-lg pt-4">
																						<div className="flex items-center gap-2 mb-3">
																							<Award className="h-5 w-5 text-primary" />
																							<h4 className="font-medium">
																								Benchmark
																								Results
																							</h4>
																						</div>
																						<div className="grid grid-cols-1 gap-2">
																							{model.benchmark_results.map(
																								(
																									benchmark,
																									index
																								) => (
																									<div
																										key={
																											index
																										}
																										className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3"
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
																												variant="outline"
																												asChild
																												className="w-full justify-start gap-3 h-auto py-3"
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
																												asChild
																												className="w-full justify-start gap-3 h-auto py-3"
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
															</Accordion>
														</ScrollArea>
													</CardContent>
												</Card>
											))}
										</div>
									</div>
								)
							)}
						</div>
					)}
				</div>
			</motion.section>
		</TooltipProvider>
	);
}
