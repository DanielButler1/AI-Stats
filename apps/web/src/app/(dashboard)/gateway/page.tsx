import { HeroSection } from "@/components/(gateway)/sections/HeroSection";
import { WhyWeWinSection } from "@/components/(gateway)/sections/WhyWeWinSection";
import { CompareSection } from "@/components/(gateway)/sections/CompareSection";
import { QuickstartSection } from "@/components/(gateway)/sections/QuickstartSection";
import { PricingSection } from "@/components/(gateway)/sections/PricingSection";
import { ReliabilitySection } from "@/components/(gateway)/sections/ReliabilitySection";
import { GetStartedSection } from "@/components/(gateway)/sections/GetStartedSection";
import { FAQSection } from "@/components/(gateway)/sections/FAQSection";
import { getGatewayMarketingMetrics } from "@/lib/fetchers/gateway/getMarketingMetrics";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "AI Gateway - Multi-Provider AI API with Routing & Observability",
	description:
		"Route requests to 300+ AI models across leading providers with a single API. The open source AI Stats Gateway adds smart routing, transparent pricing, and full observability to your AI stack.",
	keywords: [
		"AI gateway",
		"AI API",
		"multi-provider AI",
		"LLM routing",
		"model routing",
		"AI observability",
		"AI Stats Gateway",
	],
	alternates: {
		canonical: "/gateway",
	},
	openGraph: {
		type: "website",
		title: "AI Gateway - Multi-Provider AI API with Routing & Observability",
		description:
			"Route requests to 300+ AI models across leading providers with a single API. The open source AI Stats Gateway adds smart routing, transparent pricing, and full observability to your AI stack.",
	},
};

export default async function GatewayMarketingPage() {
	const metrics = await getGatewayMarketingMetrics();
	return (
		<main>
			<HeroSection metrics={metrics} />
			<WhyWeWinSection />
			<CompareSection />
			<QuickstartSection metrics={metrics} />
			<PricingSection />
			<ReliabilitySection metrics={metrics} />
			<GetStartedSection />
			<FAQSection />
		</main>
	);
}
