// app/(providers)/[apiProvider]/text-pricing/page.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
	const path = `/api-providers/${apiProvider}/text-models`;
	const imagePath = `/og/api-providers/${apiProvider}`;

	// Fallback if provider lookup fails
	if (!header) {
		return buildMetadata({
			title: "Text Models by AI API Providers",
			description:
				"Browse text and chat models from AI API providers on AI Stats. Compare completion models, context windows, and pricing across providers.",
			path,
			keywords: [
				"text models",
				"chat models",
				"LLM API",
				"AI API providers",
				"AI Stats",
			],
			imagePath,
		});
	}

	const providerName = header.api_provider_name ?? "AI API provider";

	const description = [
		`${providerName} text and chat models on AI Stats.`,
		"Discover completion and instruction-tuned models, context limits, and pricing for text workloads from this provider.",
	]
		.filter(Boolean)
		.join(" ");

	return buildMetadata({
		title: `${providerName} Text Models - Chat & Completion APIs`,
		description,
		path,
		keywords: [
			providerName,
			`${providerName} text models`,
			`${providerName} chat models`,
			"LLM API",
			"text models",
			"AI Stats",
		],
		imagePath,
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
		"text"
	)) as APIProviderModels[];

	return (
		<APIProviderDetailShell apiProviderId={apiProvider}>
			<Alert>
				<Info className="h-4 w-4 text-blue-500" />
				<AlertTitle>Note</AlertTitle>
				<AlertDescription>
					This page contains all models that can output text.
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
								There are no text models for this provider.
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
