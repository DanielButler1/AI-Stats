import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import type { GatewayProviderModel } from "@/lib/fetchers/models/getModelGatewayMetadata";
import Link from "next/link";

interface ProvidersProps {
	active: GatewayProviderModel[];
	inactive: GatewayProviderModel[];
}

const gridClasses = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

function ProviderList({
	providers,
	status,
}: {
	providers: GatewayProviderModel[];
	status: "active" | "inactive";
}) {
	if (providers.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">
				{status === "active"
					? "No providers are currently routing traffic for this model."
					: "No inactive or upcoming providers are listed right now."}
			</p>
		);
	}

	return (
		<div className={gridClasses}>
			{providers.map((provider) => {
				const providerId =
					provider.provider?.api_provider_id ??
					provider.api_provider_id;
				const displayName = provider.provider?.api_provider_name;
				const logoLabel = displayName ?? providerId;

				return (
					<div
						key={provider.id}
						className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/60"
					>
						<div className="flex items-center gap-3">
							<Logo
								id={providerId}
								alt={logoLabel}
								width={32}
								height={32}
								className="h-8 w-8 rounded-full object-contain"
							/>
							<div className="flex-1 min-w-0">
								<Link
									href={`/api-providers/${providerId}`}
									className="text-sm font-semibold leading-tight text-foreground hover:text-primary"
								>
									{displayName}
								</Link>
							</div>
						</div>

						<div>
							<p className="text-[10px] uppercase tracking-widest text-muted-foreground">
								Endpoint
							</p>
							<p className="text-sm font-mono text-foreground">
								{provider.endpoint}
							</p>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default function Providers({ active, inactive }: ProvidersProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Gateway providers</CardTitle>
				<CardDescription>
					Providers that expose this model through the AI Stats
					gateway.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<section className="space-y-3">
					<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
						Active providers
					</h3>
					<ProviderList providers={active} status="active" />
				</section>
				<section className="space-y-3">
					<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
						Inactive or upcoming providers
					</h3>
					<ProviderList providers={inactive} status="inactive" />
				</section>
			</CardContent>
		</Card>
	);
}
