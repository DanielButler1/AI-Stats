import RoadmapComingSoon from "@/components/(data)/RoadmapComingSoon";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
	title: "AI Stats Data Sources | AI Stats",
	description:
		"Explore all the sources for our AI model benchmarks, pricing, and gateway data. Find links to original datasets and documentation for full transparency.",
	path: "/sources",
	keywords: [
		"AI data sources",
		"AI benchmarks sources",
		"AI model pricing sources",
		"machine learning datasets",
		"AI providers",
		"AI transparency",
		"AI Stats",
	],
});

export default function Page() {
	return <RoadmapComingSoon milestoneKey="sources" />;
}
