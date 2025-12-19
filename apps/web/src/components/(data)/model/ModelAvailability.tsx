import Link from "next/link";
import {
	CheckCircle2,
	XCircle,
	Sparkles,
	ShieldCheck,
	Activity,
	ArrowRight,
	Clock,
	Archive,
} from "lucide-react";
import { ModelAvailabilityItem } from "@/lib/fetchers/models/getModelAvailability";
import { SubscriptionPlan } from "@/lib/fetchers/models/getModelSubscriptionPlans";
import { Logo } from "@/components/Logo";
import RotatingPricing from "./RotatingPricing";

export function GatewayHighlight() {
	return (
		<div className="rounded-xl border bg-card/40 backdrop-blur-sm p-4 md:p-5 flex flex-col gap-4">
			<div className="flex items-start gap-3">
				<div className="rounded-full bg-primary/10 p-2 text-primary">
					<Sparkles className="h-5 w-5" />
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<h3 className="text-base md:text-lg font-semibold tracking-tight">
							AI Stats Gateway
						</h3>
					</div>
					<p className="mt-1 text-sm text-muted-foreground">
						Unified, health-aware access to multiple providers with
						a consistent schema.
					</p>
				</div>
			</div>

			<div className="flex flex-wrap gap-3 text-sm">
				<span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs md:text-[0.7rem] text-muted-foreground">
					<ShieldCheck className="h-4 w-4 text-primary" />
					Failover & key management
				</span>
				<span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs md:text-[0.7rem] text-muted-foreground">
					<Activity className="h-4 w-4 text-primary" />
					Provider health checks
				</span>
				<span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs md:text-[0.7rem] text-muted-foreground">
					Consistent request shape
				</span>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-3">
				<p className="text-xs text-muted-foreground">
					Recommended for production or when rotating between
					providers.
				</p>
				<Link
					href="https://docs.ai-stats.phaseo.app"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
				>
					Gateway docs
					<ArrowRight className="h-3.5 w-3.5" />
				</Link>
			</div>
		</div>
	);
}

interface ModelAvailabilityProps {
	availability: ModelAvailabilityItem[];
	subscriptionPlans: SubscriptionPlan[];
}

export default async function ModelAvailability({
	availability,
	subscriptionPlans,
}: ModelAvailabilityProps) {
	const hasNoData =
		(!availability || availability.length === 0) &&
		(!subscriptionPlans || subscriptionPlans.length === 0);

	if (hasNoData) {
		return (
			<div className="p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg h-full text-center">
				<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
					<span className="text-xl">🚫</span>
				</div>
				<span className="text-xl font-bold text-gray-800 dark:text-gray-300 mb-2">
					No availability information yet
				</span>
				<span className="text-xs font-semibold text-gray-800 dark:text-gray-300">
					This model isn&apos;t currently listed for API or
					subscription access.
				</span>
			</div>
		);
	}

	// pull out our gateway if present
	const gatewayEntry = availability?.find((a) => a.is_active_gateway);

	const shouldShowGatewayPromo = gatewayEntry;

	// compute a single 'now' timestamp for the render
	const now = new Date().getTime();

	// helper: effective_to in the past => retired
	const isRetiredFor = (item: ModelAvailabilityItem) => {
		const effectiveToStr =
			(item as any).effective_to || (item as any).effectiveTo || null;
		if (!effectiveToStr || typeof effectiveToStr !== "string") return false;
		const eff = new Date(effectiveToStr);
		return !isNaN(eff.getTime()) && eff.getTime() < now;
	};

	// helper: coming soon if effective_from is in the future OR missing but we have a model entry
	const isComingSoonFor = (item: ModelAvailabilityItem) => {
		const effectiveFromStr =
			(item as any).effective_from || (item as any).effectiveFrom || null;

		// If effective_from is missing/null and we have a provider model slug (model exists), mark as coming soon
		if (!effectiveFromStr || typeof effectiveFromStr !== "string") {
			return Boolean(
				item.provider_model_slug ||
					item.endpoint ||
					item.provider?.api_provider_name
			);
		}

		const eff = new Date(effectiveFromStr);
		return !isNaN(eff.getTime()) && eff.getTime() > now;
	};

	return (
		<div className="w-full mx-auto space-y-4">
			{/* Gateway highlight (if we have an active gateway) */}
			{shouldShowGatewayPromo && gatewayEntry && <GatewayHighlight />}

			{/* API Providers */}
			{availability && availability.length > 0 && (
				<div className="space-y-4">
					<h3 className="text-xl font-semibold">API Providers</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{availability.map((item) => (
							<div
								key={item.id}
								className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg h-full"
							>
								<div className="flex items-start justify-between gap-2 mb-3">
									<div className="flex items-center gap-2">
										<Link
											href={`/api-providers/${item.provider.api_provider_id}`}
											className="group"
										>
											<div className="w-6 h-6 relative flex items-center justify-center rounded border">
												<div className="w-4 h-4 relative">
													<Logo
														id={
															item.provider
																.api_provider_id
														}
														alt={`${item.provider.api_provider_name} logo`}
														className="group-hover:opacity-80 transition object-contain"
														fill
													/>
												</div>
											</div>
										</Link>
										<Link
											href={`/api-providers/${item.provider.api_provider_id}`}
											className="font-semibold text-sm hover:text-primary transition-colors"
										>
											<span className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
												{
													item.provider
														.api_provider_name
												}
											</span>
										</Link>
									</div>
									<div className="flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1">
										{item.is_active_gateway ? (
											<CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
										) : isRetiredFor(item) ? (
											<Archive className="h-3.5 w-3.5 text-slate-500" />
										) : isComingSoonFor(item) ? (
											<Clock className="h-3.5 w-3.5 text-amber-500" />
										) : (
											<XCircle className="h-3.5 w-3.5 text-red-500" />
										)}
										<span className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">
											{item.is_active_gateway
												? "Active"
												: isRetiredFor(item)
												? "Retired"
												: isComingSoonFor(item)
												? "Coming Soon"
												: "Inactive"}
										</span>
									</div>
								</div>
								{item.provider_model_slug && (
									<p className="text-xs text-muted-foreground mb-2">
										Model slug: {item.provider_model_slug}
									</p>
								)}
								<div>
									<p className="text-[0.65rem] uppercase text-muted-foreground mb-1">
										Endpoint
									</p>
									<p className="text-xs font-mono bg-muted/40 rounded px-2 py-1 break-all">
										{item.endpoint}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Subscription Plans */}
			{subscriptionPlans && subscriptionPlans.length > 0 && (
				<div className="space-y-4">
					<h3 className="text-xl font-semibold">
						Subscription Plans
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{subscriptionPlans.map((plan) => {
							return (
								<div
									key={plan.plan_id}
									className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg h-full"
								>
									<Link
										href={`/subscription-plans/${plan.plan_id}`}
										className="text-sm font-semibold hover:text-primary transition-colors mb-3"
									>
										<span className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
											{plan.name}
										</span>
									</Link>
									<p className="text-xs text-muted-foreground mb-3">
										via{" "}
										{plan.organisation?.name ??
											"Unknown Provider"}
									</p>
									<div className="space-y-3">
										<div>
											<p className="text-[0.65rem] uppercase text-muted-foreground mb-1">
												Price
											</p>
											<RotatingPricing
												prices={plan.prices}
											/>
										</div>{" "}
										{plan.model_info.rate_limit &&
											typeof plan.model_info
												.rate_limit === "string" &&
											plan.model_info.rate_limit.trim() && (
												<div>
													<p className="text-[0.65rem] uppercase text-muted-foreground mb-1">
														Rate limit
													</p>
													<p className="text-xs text-muted-foreground">
														{
															plan.model_info
																.rate_limit
														}
													</p>
												</div>
											)}
										{plan.model_info.model_info &&
											typeof plan.model_info
												.model_info === "string" &&
											plan.model_info.model_info.trim() && (
												<div>
													<p className="text-[0.65rem] uppercase text-muted-foreground mb-1">
														Notes
													</p>
													<p className="text-xs text-muted-foreground line-clamp-3">
														{
															plan.model_info
																.model_info
														}
													</p>
												</div>
											)}
										{plan.description && (
											<div>
												<p className="text-[0.65rem] uppercase text-muted-foreground mb-1">
													Description
												</p>
												<p className="text-xs text-muted-foreground line-clamp-3">
													{plan.description}
												</p>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
