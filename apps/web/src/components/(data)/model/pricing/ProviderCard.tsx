"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	TokenTripleSection,
	ImageGenSection,
	VideoGenSection,
	AdvancedTable,
	CacheWriteSection,
} from "@/components/(data)/model/pricing/sections";
import { buildProviderSections } from "@/components/(data)/model/pricing/pricingHelpers";
import type { ProviderPricing } from "@/lib/fetchers/models/getModelPricing";

export default function ProviderCard({
	provider,
	plan,
}: {
	provider: ProviderPricing;
	plan: string;
}) {
	const sec = useMemo(
		() => buildProviderSections(provider, plan),
		[provider, plan]
	);

	const allEmpty =
		!sec.textTokens &&
		!sec.imageTokens &&
		!sec.audioTokens &&
		!sec.videoTokens &&
		!sec.imageGen &&
		!sec.videoGen &&
		!sec.cacheWrites?.length &&
		!sec.otherRules.length;

	if (allEmpty) return null;

	return (
		<Card className="p-5 space-y-6">
			<div className="flex items-center justify-between flex-wrap gap-2">
				<div className="flex items-center gap-2">
					<h3 className="text-lg font-semibold">
						{provider.provider.api_provider_name ||
							provider.provider.api_provider_id}
					</h3>
					<Badge variant="secondary">
						{provider.provider.api_provider_id}
					</Badge>
					<Badge variant="outline" className="capitalize">
						{plan}
					</Badge>
				</div>
				<div className="text-xs text-muted-foreground">
					Token tiles show current effective tiers.
				</div>
			</div>

			{/* core token sections */}
			<TokenTripleSection title="Text tokens" triple={sec.textTokens} />
			<TokenTripleSection title="Image tokens" triple={sec.imageTokens} />
			<TokenTripleSection title="Audio tokens" triple={sec.audioTokens} />
			<TokenTripleSection title="Video tokens" triple={sec.videoTokens} />

			{/* cache writes (new) */}
			<CacheWriteSection rows={sec.cacheWrites} />

			{/* per-image / per-time */}
			<ImageGenSection rows={sec.imageGen} />
			<VideoGenSection rows={sec.videoGen} />

			{/* anything else */}
			<AdvancedTable rows={sec.otherRules} />
		</Card>
	);
}
