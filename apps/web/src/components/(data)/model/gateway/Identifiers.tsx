import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";

interface IdentifiersProps {
	modelId: string;
	aliases: string[];
}

export default function Identifiers({ modelId, aliases }: IdentifiersProps) {
	const normalizedAliases = Array.from(
		new Set(
			aliases
				.map((alias) => safeDecodeURIComponent(alias))
				.filter(Boolean)
		)
	);

	const hasAliases = normalizedAliases.length > 0;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Model identifiers</CardTitle>
				<CardDescription>
					Use these identifiers in the <code>model</code> field when
					sending requests to the gateway.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<p className="text-xs font-semibold uppercase text-muted-foreground">
						Primary model ID
					</p>
					<code className="mt-1 inline-flex rounded bg-muted px-3 py-1.5 text-sm font-mono select-all cursor-text">
						{modelId}
					</code>
				</div>

				<div>
					<p className="text-xs font-semibold uppercase text-muted-foreground">
						Aliases
					</p>
					{hasAliases ? (
						<div className="mt-2 flex flex-wrap gap-2">
							{normalizedAliases.map((alias) => (
								<code
									key={alias}
									className="rounded bg-muted px-3 py-1.5 text-xs font-mono select-all cursor-text"
									title={alias}
								>
									{alias}
								</code>
							))}
						</div>
					) : (
						<p className="mt-2 text-sm text-muted-foreground">
							No aliases are currently configured for this model.
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
