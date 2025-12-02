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
	const path = `/api-providers/${apiProvider}/audio-models`;

	// Fallback if provider lookup fails
	if (!header) {
		return buildMetadata({
			title: "Audio Models by AI API Providers",
			description:
				"Browse audio models from AI API providers on AI Stats, including speech-to-text, text-to-speech, and audio understanding models.",
			path,
			keywords: [
				"audio generation models",
				"speech-to-text models",
				"text-to-speech models",
				"LLM API",
				"AI API providers",
				"AI Stats",
			],
		});
	}

	const providerName = header.api_provider_name ?? "AI API provider";

	const description = [
		`${providerName} audio models on AI Stats.`,
		"Discover speech-to-text, text-to-speech, and audio understanding models, with supported languages, formats, and pricing.",
	]
		.filter(Boolean)
		.join(" ");

	return buildMetadata({
		title: `${providerName} Audio Models - Speech-to-Text & Text-to-Speech`,
		description,
		path,
		keywords: [
			providerName,
			`${providerName} audio models`,
			`${providerName} speech-to-text`,
			`${providerName} text-to-speech`,
			"audio models",
			"speech recognition",
			"TTS",
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
		"audio"
	)) as APIProviderModels[];

	return (
		<APIProviderDetailShell apiProviderId={apiProvider}>
			<Alert>
				<Info className="h-4 w-4 text-blue-500" />
				<AlertTitle>Note</AlertTitle>
				<AlertDescription>
					This page contains all models that can output audio.
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
								There are no audio models for this provider.
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
