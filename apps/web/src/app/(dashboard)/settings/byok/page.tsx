// app/(settings)/keys/BYOKPage.tsx
import { Plus, Pencil, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import BYOKInputDialog from "@/components/(gateway)/settings/byok/BYOKInputDialog";
import DeleteKeyButton from "@/components/(gateway)/settings/byok/DeleteKeyButton";
import { Logo } from "@/components/Logo";
import { createClient } from "@/utils/supabase/server";
import { getTeamIdFromCookie } from "@/utils/teamCookie";

export const metadata = { title: "BYOK - Settings" };

type KeyEntry = {
	id: string;
	providerId: string;
	name: string;
	value?: string;
	prefix?: string;
	suffix?: string;
	createdAt: string;
};

function maskKey(
	value?: string,
	prefix?: string,
	suffix?: string,
	start = 6,
	end = 4
) {
	if (prefix || suffix) {
		const p = prefix ?? "";
		const s = suffix ?? "";
		const middleMask = "•".repeat(6);
		return `${p}${middleMask}${s}`;
	}
	if (!value) return "(value not available)";
	if (value.length <= start + end)
		return "•".repeat(Math.max(6, value.length));
	return `${value.slice(0, start)}${"•".repeat(
		Math.max(6, value.length - start - end)
	)}${value.slice(-end)}`;
}

function KeyCard({ entry }: { entry: KeyEntry }) {
	return (
		<div className="group rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-3">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<div className="truncate font-medium">
						{entry.name || "Untitled key"}
					</div>
					<div className="text-xs font-mono text-zinc-600 dark:text-zinc-300 break-all">
						{maskKey(entry.value, entry.prefix, entry.suffix)}
					</div>
				</div>
				<div className="shrink-0 flex items-center gap-1">
					<BYOKInputDialog
						initial={entry}
						trigger={
							<Button
								variant="ghost"
								size="sm"
								className="rounded-full p-1"
							>
								<Pencil className="h-4 w-4" />
							</Button>
						}
					/>
					<DeleteKeyButton id={entry.id} />
				</div>
			</div>
		</div>
	);
}

export default async function BYOKPage() {
	const supabase = await createClient();

	const currentTeam = await getTeamIdFromCookie();

	const { data: byokRows } = await supabase
		.from("byok_keys")
		.select("*")
		.eq("team_id", currentTeam);

	const providers = [
		{ id: "ai21", name: "AI21", logoId: "ai21" },
		{ id: "alibaba", name: "Alibaba", logoId: "alibaba" },
		{
			id: "amazon-bedrock",
			name: "Amazon Bedrock",
			logoId: "amazon-bedrock",
		},
		{ id: "anthropic", name: "Anthropic", logoId: "anthropic" },
		{ id: "atlas-cloud", name: "Atlas Cloud", logoId: "atlas-cloud" },
		{ id: "azure", name: "Azure", logoId: "azure" },
		{ id: "baseten", name: "Baseten", logoId: "baseten" },
		{ id: "cerebras", name: "Cerebras", logoId: "cerebras" },
		{ id: "chutes", name: "Chutes", logoId: "chutes" },
		{ id: "cohere", name: "Cohere", logoId: "cohere" },
		{ id: "deepinfra", name: "DeepInfra", logoId: "deepinfra" },
		{ id: "deepseek", name: "Deepseek", logoId: "deepseek" },
		{
			id: "google-ai-studio",
			name: "Google AI Studio",
			logoId: "google-ai-studio",
		},
		{ id: "google-vertex", name: "Google Vertex", logoId: "google-vertex" },
		{ id: "groq", name: "Groq", logoId: "groq" },
		{ id: "minimax", name: "Minimax", logoId: "minimax" },
		{ id: "mistral", name: "Mistral", logoId: "mistral" },
		{ id: "moonshotai", name: "MoonshotAI", logoId: "moonshotai" },
		{ id: "novitaai", name: "NovitaAI", logoId: "novitaai" },
		{ id: "openai", name: "OpenAI", logoId: "openai" },
		{ id: "parasail", name: "Parasail", logoId: "parasail" },
		{ id: "suno", name: "Suno", logoId: "suno" },
		{ id: "together", name: "Together", logoId: "together" },
		{ id: "x-ai", name: "X.ai", logoId: "x-ai" },
	];

	return (
		<div className="mx-auto">
			<h1 className="text-2xl font-semibold">
				Bring Your Own Key (BYOK)
			</h1>

			{/* Callout: Information about BYOK */}
			<Alert className="mt-4 w-full">
				<AlertCircleIcon className="h-4 w-4 mr-2 shrink-0 text-primary" />
				<AlertTitle>AI Stats - BYOK Important Information</AlertTitle>
				<AlertDescription>
					<p>
						AI Stats always prioritises using your provider keys
						when set.
					</p>{" "}
					<p>
						By default, if a key hits a rate limit or fails, the
						platform falls back to shared AI Stats credits.
					</p>{" "}
					<p>
						You can mark a key as “Always use this key” to disable
						any fallback - this becomes your default key. You can
						only set <strong>one</strong> key with this setting.
					</p>
				</AlertDescription>
			</Alert>

			{/* One full-width row per provider */}
			<div className="mt-6 grid grid-cols-1 gap-6">
				{providers.map((p) => {
					const providerKeys: KeyEntry[] = (byokRows ?? [])
						.filter((r: any) => r.provider_id === p.id)
						.map((r: any) => ({
							id: r.id,
							providerId: r.provider_id,
							name: r.name,
							value: r.value,
							prefix: r.prefix,
							suffix: r.suffix,
							createdAt: r.created_at,
						}));

					return (
						<Card key={p.id} className="rounded-2xl">
							<CardContent className="p-4 md:p-6">
								{/* 4-column internal layout; left = 1/4, right = 3/4 */}
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
									{/* Left: Provider identity + actions */}
									<div className="md:pr-6 md:border-r md:border-zinc-200 dark:md:border-zinc-800 md:h-full md:flex md:items-center">
										<div className="flex items-center justify-between w-full">
											<div className="flex items-center gap-3">
												<Logo
													id={p.logoId ?? p.id}
													alt={p.name}
													width={40}
													height={40}
													className="h-10 w-10 object-contain"
												/>
												<div className="font-medium">
													{p.name}
												</div>
											</div>

											{/* Hide add button if a key already exists for this provider */}
											{providerKeys.length === 0 && (
												<BYOKInputDialog
													providerId={p.id}
													trigger={
														<Button
															variant="outline"
															size="sm"
															className="rounded-full"
														>
															<Plus className="h-2 w-2" />
														</Button>
													}
												/>
											)}
										</div>
									</div>

									{/* Right: Keys grid (spans 3 cols on md+) */}
									<div className="md:col-span-3">
										{providerKeys.length === 0 ? (
											<div className="flex min-h-[64px] items-center justify-between rounded-xl border border-dashed border-zinc-300/70 p-4 text-sm text-muted-foreground">
												<span>
													No keys configured for this
													provider.
												</span>
											</div>
										) : (
											<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
												{providerKeys.map((k) => (
													<KeyCard
														key={k.id}
														entry={k}
													/>
												))}
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
