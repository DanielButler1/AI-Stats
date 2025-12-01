import APIProviderDetailShell from "@/components/(data)/api-providers/APIProviderDetailShell";
import PerformanceCards from "@/components/(data)/api-providers/Gateway/PerformanceCards";
import TopModels from "@/components/(data)/api-providers/Gateway/TopModels";
import TopApps from "@/components/(data)/api-providers/Gateway/TopApps";
import Updates from "@/components/(data)/api-providers/Gateway/Updates";
import getAPIProviderHeader from "@/lib/fetchers/api-providers/getAPIProviderHeader";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

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

	// Fallback: provider not found / fetch failed
	if (!header) {
		return buildMetadata({
			title: "AI API Provider Performance Analytics",
			description:
				"Inspect AI API provider performance on AI Stats. Explore latency, throughput, and reliability metrics captured by the AI Stats Gateway.",
			path: `/api-providers/${apiProvider}`,
			keywords: [
				"AI API provider",
				"API performance",
				"latency monitoring",
				"throughput metrics",
				"gateway analytics",
				"AI Stats",
			],
			imagePath: `/api-providers/${apiProvider}/opengraph-image`,
			imageAlt: "AI Stats API provider insights",
			openGraph: {
				type: "website",
			},
		});
	}

	const providerName = header.api_provider_name ?? "AI API provider";

	const description = [
		`${providerName} on AI Stats - real-world performance analytics from the AI Stats Gateway.`,
		"Review latency, throughput, and average generation time, see which apps rely on this provider most, and track newly added models and integrations.",
	]
		.filter(Boolean)
		.join(" ");

	return buildMetadata({
		title: `${providerName} - API performance, Latency & Usage analytics`,
		description,
		path: `/api-providers/${apiProvider}`,
		keywords: [
			providerName,
			`${providerName} API`,
			`${providerName} performance`,
			"AI API provider",
			"API latency metrics",
			"gateway analytics",
			"AI Stats",
		],
		imagePath: `/api-providers/${apiProvider}/opengraph-image`,
		imageAlt: `${providerName} gateway analytics on AI Stats`,
		openGraph: {
			type: "website",
		},
	});
}

export default async function Page({
	params,
}: {
	params: Promise<{ apiProvider: string }>;
}) {
	const resolved = await params;
	const apiProvider = resolved.apiProvider;

	return (
		<APIProviderDetailShell apiProviderId={apiProvider}>
			<div className="flex flex-col gap-6 w-full">
				<PerformanceCards params={params} />

				<TopModels count={6} apiProviderId={apiProvider} />

				<TopApps count={20} apiProviderId={apiProvider} period="week" />

				<Updates apiProviderId={apiProvider} />
			</div>
		</APIProviderDetailShell>
	);
}
