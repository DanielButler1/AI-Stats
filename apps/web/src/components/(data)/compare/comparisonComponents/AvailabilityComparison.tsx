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

interface AvailabilityComparisonProps {
	selectedModels: ExtendedModel[];
}

type AvailabilitySummary = {
	modelId: string;
	modelName: string;
	providerId: string;
	providerName: string;
	providerCount: number;
	providers: Array<{
		id: string;
		name: string;
	}>;
};

function buildAvailabilitySummaries(
	models: ExtendedModel[]
): AvailabilitySummary[] {
	return models.map((model) => {
		const providerId = model.provider?.provider_id ?? model.provider?.name;
		const providerName = model.provider?.name ?? providerId ?? "Unknown";

		const providerMap = new Map<string, string>();
		(model.prices ?? []).forEach((price) => {
			const priceProviderId =
				price.api_provider_id ??
				(typeof price.api_provider === "string"
					? price.api_provider
					: price.api_provider?.api_provider_id);
			if (!priceProviderId) return;
			const priceProviderName =
				typeof price.api_provider === "object"
					? price.api_provider.api_provider_name ??
						price.api_provider.api_provider_id
					: priceProviderId;
			if (!providerMap.has(priceProviderId)) {
				providerMap.set(priceProviderId, priceProviderName);
			}
		});

		return {
			modelId: model.id,
			modelName: model.name,
			providerId: providerId ?? "unknown",
			providerName,
			providerCount: providerMap.size,
			providers: Array.from(providerMap.entries()).map(
				([id, name]) => ({
					id,
					name,
				})
			),
		};
	});
}

export default function AvailabilityComparison({
	selectedModels,
}: AvailabilityComparisonProps) {
	if (!selectedModels || selectedModels.length === 0) return null;

	const summaries = buildAvailabilitySummaries(selectedModels);

	const anyPricing = summaries.some((s) => s.providerCount > 0);

	return (
		<Card className="mb-6 bg-white dark:bg-zinc-950 rounded-lg shadow">
			<CardHeader className="flex flex-row items-start justify-between border-b border-b-zinc-200">
				<div className="flex flex-col">
					<CardTitle className="text-lg font-semibold">
						API Availability &amp; Providers
					</CardTitle>
					<CardDescription className="text-muted-foreground text-sm">
						How many providers expose each model based on current
						pricing configuration.
					</CardDescription>
				</div>
				{anyPricing ? (
					<Badge variant="outline" className="text-xs">
						Live from provider pricing data
					</Badge>
				) : null}
			</CardHeader>
			<CardContent className="p-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{summaries.map((summary) => (
						<Card
							key={summary.modelId}
							className="border-none shadow-sm bg-muted/60 flex flex-col gap-2 p-4"
						>
							<div className="flex items-center gap-2">
								<Link
									href={`/organisations/${summary.providerId}`}
									className="flex items-center"
								>
									<Logo
										id={summary.providerId}
										width={24}
										height={24}
										alt={summary.providerName}
										className="h-6 w-6 rounded-full border bg-white object-contain"
									/>
								</Link>
								<div className="flex flex-col">
									<Link
										href={`/models/${encodeURIComponent(
											summary.modelId
										)}`}
										className="group text-sm font-semibold"
									>
										<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
											{summary.modelName}
										</span>
									</Link>
									<Link
										href={`/organisations/${summary.providerId}`}
										className="text-xs text-muted-foreground hover:underline"
									>
										{summary.providerName}
									</Link>
								</div>
							</div>
							<div className="mt-2 flex items-center justify-between text-xs">
								<span className="text-muted-foreground">
									Providers with pricing
								</span>
								<span className="font-mono font-semibold">
									{summary.providerCount > 0
										? summary.providerCount.toString()
										: "None yet"}
								</span>
							</div>
							<div className="mt-3 space-y-2">
								<span className="text-xs font-medium text-muted-foreground">
									Pricing providers
								</span>
								{summary.providers.length > 0 ? (
									<div className="flex flex-wrap gap-2">
										{summary.providers.map((provider) => (
											<Link
												key={`${summary.modelId}-${provider.id}`}
												href={`/api-providers/${provider.id}`}
												className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-2 py-1 text-xs hover:border-primary"
											>
												<Logo
													id={provider.id}
													alt={provider.name}
													width={16}
													height={16}
													className="h-4 w-4 rounded-full border bg-white object-contain"
												/>
												{provider.name}
											</Link>
										))}
									</div>
								) : (
									<p className="text-xs text-muted-foreground">
										No live pricing providers yet.
									</p>
								)}
							</div>
						</Card>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
