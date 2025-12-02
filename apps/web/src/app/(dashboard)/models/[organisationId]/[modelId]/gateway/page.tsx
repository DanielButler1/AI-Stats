// src/app/(dashboard)/models/[modelId]/(data)/model/gateway/page.tsx
import { buildMetadata } from "@/lib/seo";
import ModelGateway from "@/components/(data)/model/gateway/ModelGateway";
import ModelDetailShell from "@/components/(data)/model/ModelDetailShell";
import getModelGatewayMetadata, {
	getModelGatewayMetadataCached,
} from "@/lib/fetchers/models/getModelGatewayMetadata";
import type { Metadata } from "next";
import {
	getModelIdFromParams,
	type ModelRouteParams,
} from "@/app/(dashboard)/models/model-route-helpers";
import type { ModelGatewayMetadata } from "@/lib/fetchers/models/getModelGatewayMetadata";

async function fetchModel(modelId: string) {
	try {
		const metadata = await getModelGatewayMetadata(modelId);
		if (!metadata) return null;
		return metadata;
	} catch (error) {
		console.warn("[seo] failed to load model gateway metadata", {
			modelId,
			error,
		});
		return null;
	}
}

export async function generateMetadata(props: {
	params: Promise<ModelRouteParams>;
}): Promise<Metadata> {
	const params = await props.params;
	const modelId = getModelIdFromParams(params);
	const metadata = await fetchModel(modelId);

	if (!metadata) {
		return buildMetadata({
			title: "Gateway Integration for Model",
			description:
				"Explore gateway support, providers, and routing details for AI models on AI Stats.",
			path: `/models/${modelId}/gateway`,
			keywords: [
				"AI gateway",
				"model routing",
				"AI providers",
				"AI Stats",
			],
		});
	}

	const displayName = (metadata as any)?.name ?? metadata.modelId;
	const description = `${displayName} gateway support on AI Stats. View providers, streaming support, and routing options for this model.`;

	return buildMetadata({
		title: `${displayName} Gateway - Providers & Routing Options`,
		description,
		path: `/models/${modelId}/gateway`,
		imagePath: `/models/${modelId}/opengraph-image`,
		keywords: [
			displayName,
			`${displayName} gateway`,
			`${(metadata as any)?.providerName ?? metadata.modelId} provider`,
			"AI gateway",
			"AI Stats",
		],
	});
}

export default async function Page({
	params,
}: {
	params: Promise<ModelRouteParams>;
}) {
	const routeParams = await params;
	const modelId = getModelIdFromParams(routeParams);
	const metadata = (await getModelGatewayMetadataCached(modelId)) as ModelGatewayMetadata;

	return (
		<ModelDetailShell modelId={modelId}>
			<ModelGateway metadata={metadata} />
		</ModelDetailShell>
	);
}
