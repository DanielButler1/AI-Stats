import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExtendedModel } from "@/data/types";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
	TooltipProvider,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { Globe, Twitter } from "lucide-react";
import ModelsDisplay from "@/components/provider/ModelsDisplay";
import fs from "fs/promises";
import path from "path";
import type { Metadata } from "next";
import { fetchAggregateData } from "@/lib/fetchData";

export async function generateMetadata(props: {
	params: Promise<{ providerId: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const providerPath = path.join(
		process.cwd(),
		"src/data/providers",
		params.providerId,
		"provider.json"
	);
	try {
		const raw = await fs.readFile(providerPath, "utf-8");
		const provider = JSON.parse(raw);
		const title = `${provider.name}`;
		const description =
			provider.description ||
			`Explore ${provider.name} and its AI models.`;
		return { title, description };
	} catch {
		return {
			title: "Provider",
			description: "Browse AI providers and their latest models.",
		};
	}
}

export async function generateStaticParams() {
	const providersDir = path.join(process.cwd(), "src/data/providers");
	try {
		const providerFolders = await fs.readdir(providersDir);
		return providerFolders.map((id) => ({ providerId: id }));
	} catch {
		return [];
	}
}

export default async function ProviderPage(props: {
	params: Promise<{ providerId: string }>;
}) {
	const params = await props.params;

	let models: ExtendedModel[] = [];
	let provider: ExtendedModel["provider"] | null = null;
	let errorMsg = "";

	// Try to load provider.json directly
	const providerPath = path.join(
		process.cwd(),
		"src/data/providers",
		params.providerId,
		"provider.json"
	);
	try {
		const raw = await fs.readFile(providerPath, "utf-8");
		provider = JSON.parse(raw);
	} catch {
		errorMsg = "Provider not found";
	}

	// Only fetch models if provider exists
	if (provider) {
		try {
			models = (await fetchAggregateData()).filter(
				(m) => m.provider.provider_id === params.providerId
			);
		} catch (e: any) {
			errorMsg = e?.message || "Unknown error";
		}
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
						provider && (
							<div className="flex flex-col space-y-4">
								<Card className="mb-4 relative flex flex-col md:flex-row items-start gap-4 md:gap-8 p-6 w-full">
									{/* Provider flag aligned vertically in the center on desktop, top on mobile */}
									{provider?.country_code && (
										<div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 flex justify-center md:block w-full md:w-auto mb-2 md:mb-0 md:pr-6">
											<Image
												src={`/flags/${provider.country_code.toLowerCase()}.svg`}
												alt={provider.country_code}
												width={48}
												height={48}
												className="rounded-md border shadow-lg w-12 h-auto md:w-24 md:h-auto aspect-auto object-cover"
											/>
										</div>
									)}
									{/* Layout around logo and info */}
									<div className="flex flex-col md:flex-row items-center w-full gap-2 md:gap-0">
										{" "}
										{/* Provider logo */}
										<div className="flex-shrink-0 flex flex-col items-center justify-center h-full mb-2 md:mb-0 md:mr-6">
											<div className="w-12 h-12 md:w-24 md:h-24 relative flex items-center justify-center rounded-full border bg-white">
												<div className="w-10 h-10 md:w-20 md:h-20 relative">
													<Image
														src={`/providers/${provider.provider_id}.svg`}
														alt={provider.name}
														className="object-contain"
														fill
													/>
												</div>
											</div>
										</div>
										{/* Provider info: name and icons */}
										<div className="flex flex-col items-center md:items-start justify-center flex-1">
											<h1 className="text-3xl md:text-5xl font-bold mb-1 text-center md:text-left">
												{provider.name}
											</h1>
											<div className="flex flex-row gap-2 mt-1 justify-center md:justify-start">
												{provider.twitter && (
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																asChild
																size="sm"
																variant="outline"
																className="group"
																style={
																	{
																		"--provider-color":
																			provider.colour ??
																			"inherit",
																	} as React.CSSProperties
																}
															>
																<Link
																	href={
																		provider.twitter ||
																		"#"
																	}
																	target="_blank"
																	rel="noopener noreferrer"
																	aria-label={`Visit ${provider.name} twitter page`}
																>
																	<Twitter className="w-5 h-5 inline-block align-text-bottom transition-colors group-hover:text-[color:var(--provider-color)]" />
																	<span className="sr-only">
																		Twitter
																	</span>
																</Link>
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															{provider.name}{" "}
															Twitter Page
														</TooltipContent>
													</Tooltip>
												)}
												{provider.website && (
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																asChild
																size="sm"
																variant="outline"
																className="group"
																style={
																	{
																		"--provider-color":
																			provider.colour ??
																			"inherit",
																	} as React.CSSProperties
																}
															>
																<Link
																	href={
																		provider.website ||
																		"#"
																	}
																	target="_blank"
																	rel="noopener noreferrer"
																	aria-label={`Visit ${provider.name} website`}
																>
																	<Globe className="w-5 h-5 inline-block align-text-bottom transition-colors group-hover:text-[color:var(--provider-color)]" />
																	<span className="sr-only">
																		Website
																	</span>
																</Link>
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															{provider.name}{" "}
															Website
														</TooltipContent>
													</Tooltip>
												)}
											</div>
										</div>
									</div>
								</Card>

								{provider.description && (
									<Card className="mb-8 mt-4 shadow-lg">
										<CardHeader>
											<CardTitle className="text-2xl font-bold">
												About {provider.name}
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p>{provider.description}</p>
										</CardContent>
									</Card>
								)}

								<Card className="shadow-lg">
									<CardHeader>
										<CardTitle className="text-2xl font-bold">
											Models ({models.length})
										</CardTitle>
									</CardHeader>
									<CardContent>
										{models.length === 0 ? (
											<p className="text-muted-foreground">
												No models found for this
												provider.
											</p>
										) : (
											<ModelsDisplay models={models} />
										)}
									</CardContent>
								</Card>
							</div>
						)
					)}
				</div>
			</TooltipProvider>
		</main>
	);
}
