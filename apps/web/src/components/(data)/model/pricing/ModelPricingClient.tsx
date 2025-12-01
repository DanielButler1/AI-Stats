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
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-3 flex-wrap">
				<h2 className="text-xl font-semibold">Pricing</h2>
				<div className="flex items-center gap-3">
					{/* Dropdown is only visible on small screens as a fallback */}
					{availablePlans.length > 0 && (
						<div className="sm:hidden">
							<PricingPlanSelect
								value={plan}
								onChange={setPlan}
								plans={availablePlans}
							/>
						</div>
					)}
					{/* Badges are primary selector on sm+ screens. Click to change plan. */}
					<div className="hidden sm:flex items-center gap-2">
						{availablePlans.map((p) => (
							<Badge
								key={p}
								variant={p === plan ? "default" : "outline"}
								className="capitalize cursor-pointer"
								onClick={() => setPlan(p)}
								role="button"
								aria-pressed={p === plan}
							>
								{p}
							</Badge>
						))}
					</div>
				</div>
			</div>

			<Separator />

			{providers.map((prov) => (
				<ProviderCard
					key={prov.provider.api_provider_id}
					provider={prov}
					plan={plan}
				/>
			))}
		</div>
	);
}
