"use client";

import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type ProviderPricing } from "@/lib/fetchers/models/getModelPricing";
import PricingPlanSelect from "@/components/(data)/model/pricing/PricingPlanSelect";
import ProviderCard from "@/components/(data)/model/pricing/ProviderCard";

const PLAN_ORDER = ["standard", "batch", "flex", "priority"] as const;

export default function ModelPricingClient({
	providers,
}: {
	providers: ProviderPricing[];
}) {
	// discover available plans across all providers
	const availablePlans = useMemo(() => {
		const s = new Set<string>();
		for (const p of providers)
			for (const r of p.pricing_rules)
				s.add(r.pricing_plan || "standard");
		return PLAN_ORDER.filter((x) => s.has(x));
	}, [providers]);

	const [plan, setPlan] = useState<string>(availablePlans[0] || "standard");

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between gap-3 flex-wrap">
				<div>
					<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
						Pricing by Provider
					</h2>
				</div>
				<div className="flex items-center gap-3">
					{availablePlans.length === 1 ? (
						<span className="text-sm font-medium capitalize px-3 py-1 bg-muted rounded-md">
							{availablePlans[0]} Tier
						</span>
					) : (
						<PricingPlanSelect
							value={plan}
							onChange={setPlan}
							plans={availablePlans}
						/>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
				{providers.map((prov) => (
					<ProviderCard
						key={prov.provider.api_provider_id}
						provider={prov}
						plan={plan}
					/>
				))}
			</div>
		</div>
	);
}
