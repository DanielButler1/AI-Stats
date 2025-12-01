"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import CountryDetailShell from "@/components/(data)/countries/CountryDetailShell";
import ModelCalendar from "@/components/(data)/models/ModelCalendar/ModelCalendar";
import ModelReleasePace from "@/components/(data)/models/ModelCalendar/ModelReleasePace";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { ModelEvent } from "@/lib/fetchers/updates/getModelUpdates";
import type { CountrySummary } from "@/lib/fetchers/countries/getCountrySummaries";

type OrgContribution = { name: string; count: number; fill: string };

interface CountryTrendsViewProps {
	country: CountrySummary;
	iso: string;
	releasesCount: number;
	announcementsCount: number;
	modelsCount: number;
	orgData: OrgContribution[];
	recentEvents: ModelEvent[];
}

const ORG_CHART_CONFIG = {
	models: { label: "Models", color: "hsl(222 89% 53%)" },
};

export default function CountryTrendsView({
	country,
	iso,
	releasesCount,
	announcementsCount,
	modelsCount,
	orgData,
	recentEvents,
}: CountryTrendsViewProps) {
	return (
		<CountryDetailShell iso={iso} country={country}>
			<div className="space-y-8">
				<div className="grid gap-4 md:grid-cols-3">
					<div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80">
						<p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
							Releases tracked
						</p>
						<p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
							{releasesCount}
						</p>
						<p className="text-sm text-muted-foreground">
							With month and year coverage.
						</p>
					</div>
					<div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80">
						<p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
							Announcements logged
						</p>
						<p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
							{announcementsCount}
						</p>
						<p className="text-sm text-muted-foreground">
							Includes teaser drops before release.
						</p>
					</div>
					<div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80">
						<p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
							Models in view
						</p>
						<p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
							{modelsCount}
						</p>
						<p className="text-sm text-muted-foreground">
							Unique models tied to local organisations.
						</p>
					</div>
				</div>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
						Release cadence
					</h2>
					<div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80">
						<ModelReleasePace events={recentEvents} />
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
						Release calendar
					</h2>
					<div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
						<ModelCalendar events={recentEvents} />
					</div>
				</section>

				<section className="space-y-3 rounded-2xl border border-zinc-200/80 bg-white/90 p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
							Contribution split
						</p>
						<h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
							Top organisations by release count
						</h2>
					</div>
					{orgData.length ? (
						<ChartContainer
							config={ORG_CHART_CONFIG}
							className="h-[360px]"
						>
							<BarChart
								data={orgData}
								margin={{ left: 4, right: 12, bottom: 24 }}
							>
								<CartesianGrid
									strokeDasharray="4 4"
									strokeOpacity={0.2}
									vertical={false}
								/>
								<XAxis
									dataKey="name"
									tickLine={false}
									axisLine={false}
									interval={0}
									height={60}
									tick={({ x, y, payload }) => (
										<text
											x={x}
											y={y + 12}
											textAnchor="middle"
											fill="#71717a"
											fontSize={11}
										>
											{String(payload?.value ?? "").slice(
												0,
												16
											)}
										</text>
									)}
								/>
								<YAxis
									allowDecimals={false}
									tickLine={false}
									axisLine={false}
								/>
								<ChartTooltip
									cursor={{ fill: "rgba(0,0,0,0.03)" }}
									content={
										<ChartTooltipContent labelKey="name" />
									}
								/>
								<Bar
									dataKey="count"
									fill="var(--color-models)"
									radius={[10, 10, 6, 6]}
								/>
							</BarChart>
						</ChartContainer>
					) : (
						<p className="text-sm text-muted-foreground">
							We have not recorded any releases to visualise yet.
						</p>
					)}
				</section>
			</div>
		</CountryDetailShell>
	);
}
