import AppUsageChart from "@/components/(data)/apps/AppUsageChart";
import AppDetailShell from "@/components/(data)/apps/AppDetailShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { createAdminClient } from "@/utils/supabase/admin";
import { getAppDetailsCached } from "@/lib/fetchers/apps/getAppDetails";
import { getAppUsageOverTime } from "@/lib/fetchers/apps/getAppUsageOverTime";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { Activity, TrendingUp, Zap } from "lucide-react";

const WINDOW_LABEL = "Last 28 days";

async function fetchAppMeta(appId: string) {
	try {
		return await getAppDetailsCached(appId);
	} catch (error) {
		console.warn("[seo] failed to load app metadata", {
			appId,
			error,
		});
		return null;
	}
}

type TopModelAllTime = {
	model: string;
	provider?: string | null;
	tokens: number;
} | null;

async function getAppTopModelAllTime(appId: string): Promise<TopModelAllTime> {
	const supabase = await createAdminClient();
	const PAGE_SIZE = 1000;
	let offset = 0;
	const totals = new Map<string, { tokens: number; provider?: string | null }>();

	while (true) {
		const { data, error } = await supabase
			.from("gateway_requests")
			.select("model_id, provider, usage")
			.eq("app_id", appId)
			.eq("success", true)
			.order("created_at", { ascending: true })
			.range(offset, offset + PAGE_SIZE - 1);

		if (error) {
			console.error("Error fetching top model all time:", error);
			break;
		}

		if (!data?.length) {
			break;
		}

		for (const row of data) {
			const tokens = Number(row.usage?.total_tokens ?? 0);
			if (!tokens) continue;
			const model = row.model_id?.trim() || "Unknown model";
			const provider = row.provider?.trim() || null;
			const existing = totals.get(model) ?? {
				tokens: 0,
				provider,
			};
			existing.tokens += tokens;
			if (!existing.provider && provider) {
				existing.provider = provider;
			}
			totals.set(model, existing);
		}

		if (data.length < PAGE_SIZE) {
			break;
		}
		offset += PAGE_SIZE;
	}

	let best: TopModelAllTime = null;
	for (const [model, stats] of totals.entries()) {
		if (!best || stats.tokens > best.tokens) {
			best = {
				model,
				tokens: stats.tokens,
				provider: stats.provider,
			};
		}
	}

	return best;
}

async function getOrganisationNamesByIds(ids: string[]): Promise<Map<string, string>> {
	if (!ids.length) return new Map();

	const supabase = await createAdminClient();
	const { data, error } = await supabase
		.from("data_organisations")
		.select("organisation_id, name")
		.in("organisation_id", ids);

	if (error) {
		console.error("Error fetching organisation names:", error);
		return new Map();
	}

	const map = new Map<string, string>();
	for (const row of data ?? []) {
		if (!row?.organisation_id) continue;
		if (typeof row.name === "string" && row.name.trim()) {
			map.set(row.organisation_id, row.name);
		} else {
			map.set(row.organisation_id, row.organisation_id);
		}
	}
	return map;
}

type SummaryMetric = {
	label: string;
	value: string;
	helper: string;
	icon: LucideIcon;
};

export async function generateMetadata(props: {
	params: Promise<{ appId: string }>;
}): Promise<Metadata> {
	const { appId } = await props.params;
	const app = await fetchAppMeta(appId);

	const path = `/apps/${appId}`;
	const imagePath = `/apps/${appId}/opengraph-image`;

	// Fallback when app can't be loaded
	if (!app) {
		return buildMetadata({
			title: "Public AI app analytics",
			description:
				"View public usage analytics for AI applications that have opted in to share their data on AI Stats, including token usage and model activity.",
			path,
			keywords: [
				"AI app",
				"public usage analytics",
				"token usage",
				"AI Stats",
			],
			robots: {
				index: false,
				follow: false,
			},
		});
	}

	return buildMetadata({
		title: `${app.title} – App Usage Analytics`,
		description: `Public usage analytics for ${app.title} on AI Stats. Review token consumption, models used, and API activity over the last 28 days.`,
		path,
		keywords: [
			app.title,
			`${app.title} usage analytics`,
			"AI app analytics",
			"token usage",
			"AI Stats",
		],
		robots: {
			index: false,
			follow: false,
		},
	});
}

export default async function Page({
	params,
}: {
	params: Promise<{ appId: string }>;
}) {
	const { appId } = await params;
	const app = await fetchAppMeta(appId);

	if (!app) {
		return (
			<main className="flex min-h-screen flex-col">
				<div className="container mx-auto px-4 py-8">
					<Card>
						<CardHeader>
							<CardTitle>App Not Found</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								The app you're looking for doesn't exist.
							</p>
						</CardContent>
					</Card>
				</div>
			</main>
		);
	}

	const rows = await getAppUsageOverTime(appId, "4w");
	const successfulRows = rows.filter((row) => !!row.success);

	const allTimeTokens = Number(app.total_tokens ?? 0);

	let totalTokens = 0;
	const modelAgg = new Map<
		string,
		{ requests: number; tokens: number; provider?: string | null }
	>();

	for (const row of successfulRows) {
		const tokens = Number(row.usage?.total_tokens ?? 0) || 0;
		totalTokens += tokens;

		const model = row.model_id?.trim() || "Unknown model";
		const provider = row.provider?.trim() || null;
		const existing =
			modelAgg.get(model) || { requests: 0, tokens: 0, provider };
		existing.requests += 1;
		existing.tokens += tokens;
		if (!existing.provider && provider) {
			existing.provider = provider;
		}
		modelAgg.set(model, existing);
	}

	const topModels = Array.from(modelAgg.entries())
		.map(([model, stats]) => ({ model, ...stats }))
		.sort((a, b) => {
			if (b.tokens === a.tokens) {
				return b.requests - a.requests;
			}
			return b.tokens - a.tokens;
		})
		.slice(0, 6);

	const topModelAllTime = await getAppTopModelAllTime(appId);

	const DAY_MS = 1000 * 60 * 60 * 24;
	const now = Date.now();
	const recentBoundary = now - DAY_MS * 7;
	const previousBoundary = now - DAY_MS * 14;

	type GrowthStats = {
		recent: number;
		previous: number;
		provider?: string | null;
	};

	const growthMap = new Map<string, GrowthStats>();
	for (const row of successfulRows) {
		const tokens = Number(row.usage?.total_tokens ?? 0);
		if (!tokens) continue;
		const timestamp = new Date(row.created_at).getTime();
		if (Number.isNaN(timestamp) || timestamp < previousBoundary) continue;

		const key = row.model_id?.trim() || "Unknown model";
		const provider = row.provider?.trim() || null;
		const entry = growthMap.get(key) || {
			recent: 0,
			previous: 0,
			provider,
		};
		if (!entry.provider && provider) {
			entry.provider = provider;
		}
		if (timestamp >= recentBoundary) {
			entry.recent += tokens;
		} else {
			entry.previous += tokens;
		}
		growthMap.set(key, entry);
	}

	const risingModel = Array.from(growthMap.entries()).reduce<
		{ model: string; delta: number; provider?: string | null } | null
	>((best, [model, stats]) => {
		const delta = stats.recent - stats.previous;
		if (!best || delta > best.delta) {
			return { model, delta, provider: stats.provider };
		}
		return best;
	}, null);

	const risingModelPositive =
		risingModel && risingModel.delta > 0 ? risingModel : null;

	const providerIds = new Set<string>();
	const addProvider = (id?: string | null) => {
		if (id) {
			providerIds.add(id);
		}
	};

	topModels.forEach((model) => addProvider(model.provider));
	addProvider(topModelAllTime?.provider);
	addProvider(risingModelPositive?.provider);

	const organisationNames = await getOrganisationNamesByIds(
		Array.from(providerIds)
	);
	const resolveOrganisationLabel = (id?: string | null) => {
		if (!id) return "Unknown";
		return organisationNames.get(id) ?? id;
	};

	const summaryMetrics: SummaryMetric[] = [
		{
			label: "Total tokens",
			value: allTimeTokens.toLocaleString(),
			helper: allTimeTokens
				? "Tokens consumed since tracking started"
				: "No tokens recorded yet",
			icon: Zap,
		},
		{
			label: "Top model (all time)",
			value: topModelAllTime?.model ?? "Collecting data",
			helper: topModelAllTime
				? `${topModelAllTime.tokens.toLocaleString()} tokens${
						topModelAllTime.provider
							? ` • ${resolveOrganisationLabel(
									topModelAllTime.provider
							  )}`
							: ""
				  }`
				: "Still building the model profile",
			icon: TrendingUp,
		},
		{
			label: "Rising model",
			value: risingModelPositive
				? `${risingModelPositive.model}`
				: "No rising model yet",
			helper: risingModelPositive
				? `+${risingModelPositive.delta.toLocaleString()} tokens vs the prior week${
						risingModelPositive.provider
							? ` • ${resolveOrganisationLabel(
									risingModelPositive.provider
							  )}`
							: ""
				  }`
				: "No model has gained momentum the last fortnight",
			icon: Activity,
		},
	];

	return (
		<AppDetailShell appId={appId} app={app}>
			<div className="grid gap-6">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{summaryMetrics.map((metric) => (
						<Card key={metric.label}>
							<CardHeader className="pb-3">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									<span className="flex items-center gap-2">
										<metric.icon className="h-4 w-4 text-muted-foreground" />
										{metric.label}
									</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-semibold">
									{metric.value}
								</div>
								<p className="mt-1 text-xs text-muted-foreground">
									{metric.helper}
								</p>
							</CardContent>
						</Card>
					))}
				</div>

				<AppUsageChart rows={rows} windowLabel={WINDOW_LABEL} />

				<div className="grid gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Top models</CardTitle>
							<p className="text-sm text-muted-foreground">
								Ranked by token consumption over the last 28
								days.
							</p>
						</CardHeader>
						<CardContent>
							{topModels.length ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-16">
												#
											</TableHead>
											<TableHead>Model</TableHead>
											<TableHead>Org</TableHead>
											<TableHead className="text-right">
												Tokens
											</TableHead>
											<TableHead className="text-right">
												Token share
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{topModels.map((model, index) => {
											const share =
												totalTokens > 0
													? `${Math.round(
															(model.tokens /
																totalTokens) *
																100
													  )}%`
													: "N/A";
											const orgLabel =
												resolveOrganisationLabel(
													model.provider
												);
											return (
												<TableRow
													key={`${model.model}-${index}`}
												>
													<TableCell className="font-medium text-muted-foreground">
														#{index + 1}
													</TableCell>
												<TableCell className="font-medium">
													{model.model}
												</TableCell>
												<TableCell className="text-muted-foreground">
													{orgLabel}
												</TableCell>
												<TableCell className="text-right text-muted-foreground">
													{model.tokens.toLocaleString()}
												</TableCell>
													<TableCell className="text-right text-muted-foreground">
														{share}
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							) : (
								<p className="text-sm text-muted-foreground">
									No successful requests recorded in the last
									28 days.
								</p>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</AppDetailShell>
	);
}
