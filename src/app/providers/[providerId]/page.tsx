import React from "react";
import { ExtendedModel } from "@/data/types";
import fs from "fs/promises";
import path from "path";
import type { Metadata } from "next";
import { fetchAggregateData } from "@/lib/fetchData";
import ProviderDisplay from "@/components/provider/ProviderDisplay";

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
		const now = new Date();
		const month = now.toLocaleString("en-US", { month: "long" });
		const year = now.getFullYear();
		const title = `${provider.name} AI Models, Features & Pricing - ${month} ${year}`;
		const description = provider.description
			? `${provider.description} Discover ${provider.name} AI models, features, pricing, and compare with other providers on AI Stats.`
			: `Explore ${provider.name} and its AI models, features, and pricing. Compare ${provider.name} to other AI providers on AI Stats.`;
		const keywords = [
			provider.name,
			`${provider.name} AI`,
			`${provider.name} models`,
			`${provider.name} pricing`,
			`${provider.name} features`,
			"AI provider",
			"AI model comparison",
			"AI Stats",
		];
		return {
			title,
			description,
			keywords,
			alternates: {
				canonical: `https://ai-stats.phaseo.app/providers/${provider.provider_id}`,
			},
		};
	} catch {
		return {
			title: "AI Provider Overview",
			description:
				"Browse AI providers and their latest models, features, and pricing on AI Stats.",
			keywords: ["AI provider", "AI models", "AI pricing", "AI Stats"],
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
	const allModels: ExtendedModel[] = await fetchAggregateData();
	const models = allModels.filter(
		(m) => m.provider.provider_id === params.providerId
	);
	const provider = models.length > 0 ? models[0].provider : null;

	return <ProviderDisplay provider={provider} models={models} />;
}
