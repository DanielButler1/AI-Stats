import type { ExtendedModel } from "@/data/types";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Logo } from "@/components/Logo";

interface SubscriptionPlansComparisonProps {
	selectedModels: ExtendedModel[];
}

const formatRateLimit = (value: unknown): string => {
	if (value === null || value === undefined) return "";
	if (typeof value === "string" || typeof value === "number") {
		return String(value);
	}
	if (typeof value === "object") {
		try {
			const serialized = JSON.stringify(value);
			return serialized === "{}" ? "" : serialized;
		} catch {
			return "";
		}
	}
	return "";
};

const buildPriceLabel = (
	prices: NonNullable<ExtendedModel["subscription_plans"]>[number]["prices"]
) => {
	if (!prices || prices.length === 0) return "Price unavailable";
	return prices
		.map((price) => {
			const amount =
				price.price !== null && price.price !== undefined
					? `$${price.price.toFixed(2)}`
					: "Custom";
			const frequency = price.frequency ?? "one-off";
			return `${amount} / ${frequency}`;
		})
		.join(" · ");
};

export default function SubscriptionPlansComparison({
	selectedModels,
}: SubscriptionPlansComparisonProps) {
	if (!selectedModels || selectedModels.length === 0) return null;

	const modelPlans = selectedModels.map((model) => ({
		model,
		plans: model.subscription_plans ?? [],
	}));

	const anyPlanData = modelPlans.some((entry) => entry.plans.length > 0);

	if (!anyPlanData) {
		return (
			<Card className="mb-6 bg-white dark:bg-zinc-950 rounded-lg shadow">
				<CardHeader className="flex flex-row items-start justify-between border-b border-b-zinc-200">
					<div className="flex flex-col">
						<CardTitle className="text-lg font-semibold">
							Subscription Plans
						</CardTitle>
						<CardDescription className="text-muted-foreground text-sm">
							Compare which plans bundle the selected models.
						</CardDescription>
					</div>
					<Badge variant="outline" className="text-xs">
						No plans found
					</Badge>
				</CardHeader>
				<CardContent className="p-6 text-sm text-muted-foreground">
					None of the selected models are currently part of any
					catalogued subscription plans. Try another combination or
					check the individual model page for more details.
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="mb-6 bg-white dark:bg-zinc-950 rounded-lg shadow">
			<CardHeader className="flex flex-row items-start justify-between border-b border-b-zinc-200">
				<div className="flex flex-col">
					<CardTitle className="text-lg font-semibold">
						Subscription Plans
					</CardTitle>
					<CardDescription className="text-muted-foreground text-sm">
						Plans that include each selected model, grouped by
						organisation.
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="p-6 grid gap-6 grid-cols-1 lg:grid-cols-2">
				{modelPlans.map(({ model, plans }) => (
					<div
						key={model.id}
						className="rounded-xl border border-border/60 p-4 space-y-4"
					>
						<div className="flex flex-col sm:flex-row sm:items-center gap-2">
							<div>
								<Link
									href={`/models/${model.id}`}
									className="font-semibold"
								>
									<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
										{model.name}
									</span>
								</Link>
								<p className="text-xs text-muted-foreground">
									{plans.length} plan
									{plans.length === 1 ? "" : "s"}
								</p>
							</div>
						</div>
						{plans.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								No subscription plans include this model yet.
							</p>
						) : (
							<div className="grid gap-3">
								{plans.map((plan) => (
									<div
										key={`${model.id}-${plan.plan_uuid}`}
										className="rounded-lg border border-border/40 p-3 flex flex-col gap-2 bg-muted/30"
									>
										<div className="flex flex-wrap items-center gap-2">
											<Link
												href={`/organisations/${plan.organisation.organisation_id}`}
												className="group"
											>
												<div className="w-5 h-5 relative flex items-center justify-center rounded-xl border">
													<div className="w-4 h-4 relative">
														<Logo
															id={
																plan
																	.organisation
																	.organisation_id
															}
															alt={
																plan
																	.organisation
																	.name
															}
															className="object-contain"
															fill
														/>
													</div>
												</div>
											</Link>
											<div className="flex flex-col">
												<Link
													href={
														plan.link ??
														`/organisations/${plan.organisation.organisation_id}`
													}
													className="font-medium text-sm"
													target={
														plan.link
															? "_blank"
															: undefined
													}
													rel={
														plan.link
															? "noreferrer noopener"
															: undefined
													}
												>
													<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
														{plan.name}
													</span>
												</Link>
												<Link
													href={`/organisations/${plan.organisation.organisation_id}`}
													className="text-xs text-muted-foreground"
												>
													<span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
														{plan.organisation.name}
													</span>
												</Link>
											</div>
											{formatRateLimit(
												plan.model_info?.rate_limit
											) && (
												<Badge
													variant="outline"
													className="text-[10px]"
												>
													{formatRateLimit(
														plan.model_info
															?.rate_limit
													)}
												</Badge>
											)}
										</div>
										<p className="text-sm font-mono text-primary">
											{buildPriceLabel(plan.prices)}
										</p>
										{plan.description && (
											<p className="text-xs text-muted-foreground line-clamp-2">
												{plan.description}
											</p>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				))}
			</CardContent>
		</Card>
	);
}
