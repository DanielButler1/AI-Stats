// app/(providers)/[apiProvider]/image-models/page.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, FilePlus } from "lucide-react";
import { getAPIProviderModelsCached } from "@/lib/fetchers/api-providers/getAPIProvider";
import type { APIProviderModels } from "@/lib/fetchers/api-providers/getAPIProvider";
import APIModelCard from "@/components/(data)/api-providers/Provider/APIModelCard";
import {
	Empty,
	EmptyHeader,
	EmptyTitle,
	EmptyDescription,
	EmptyMedia,
	EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import APIProviderDetailShell from "@/components/(data)/api-providers/APIProviderDetailShell";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import getAPIProviderHeader from "@/lib/fetchers/api-providers/getAPIProviderHeader";

async function fetchProviderMeta(apiProviderId: string) {
	try {
		return await getAPIProviderHeader(apiProviderId);
	} catch (error) {
		console.warn("[seo] failed to load api provider metadata", {
			apiProviderId,
			error,
		});
		return null;
	}
}

export async function generateMetadata(props: {
	params: Promise<{ apiProvider: string }>;
}): Promise<Metadata> {
	const { apiProvider } = await props.params;
	const header = await fetchProviderMeta(apiProvider);
	const path = `/api-providers/${apiProvider}/image-models`;

	// Fallback if provider lookup fails
	if (!header) {
		return buildMetadata({
			title: "Image Models by AI API Providers",
			description:
				"Browse image generation models from AI API providers on AI Stats. Compare image generation, editing capabilities, and pricing across providers.",
			path,
			keywords: [
				"image generation models",
				"image editing models",
				"LLM API",
				"AI API providers",
				"AI Stats",
			],
		});
	}

	const providerName = header.api_provider_name ?? "AI API provider";

	const description = [
		`${providerName} image models on AI Stats.`,
		"Explore image generation and editing capabilities, resolution limits, and pricing for this provider's image stack.",
	]
		.filter(Boolean)
		.join(" ");

	return buildMetadata({
		title: `${providerName} Image Models - Generation & Editing APIs`,
		description,
		path,
		keywords: [
			providerName,
			`${providerName} image models`,
			`${providerName} image generation`,
			"image generation",
			"image editing",
			"AI image models",
			"AI Stats",
		],
	});
}

export default async function Page({
	params,
}: {
	params: Promise<{ apiProvider: string }>;
}) {
	const { apiProvider } = await params;

	const models = (await getAPIProviderModelsCached(
		apiProvider,
		"image"
	)) as APIProviderModels[];

	return (
		<APIProviderDetailShell apiProviderId={apiProvider}>
			<Alert>
				<Info className="h-4 w-4 text-blue-500" />
				<AlertTitle>Note</AlertTitle>
				<AlertDescription>
					This page contains all models that can output images.
				</AlertDescription>
			</Alert>

			<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{(!models || models.length === 0) && (
					<Empty className="col-span-full">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<FilePlus />
							</EmptyMedia>
							<EmptyTitle>No models found</EmptyTitle>
							<EmptyDescription>
								There are no image models for this provider.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<div className="flex gap-2">
								<Button asChild>
									<a href="/contribute">Contribute</a>
								</Button>
								<Button variant="outline" asChild>
									<a href="/docs">Learn more</a>
								</Button>
							</div>
						</EmptyContent>
					</Empty>
				)}

				{models.map((model) => (
					<APIModelCard key={model.model_id} model={model} />
				))}
			</div>
		</APIProviderDetailShell>
	);
}
