import React from "react";
import { AlertTriangle, ArrowRight, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getTeamIdFromCookie } from "@/utils/teamCookie";
import { getDeprecationWarningsForTeam } from "@/lib/fetchers/usage/deprecationWarnings";

type Warning = {
	modelId: string;
	daysUntil: number;
	deprecationDate?: string;
	retirementDate?: string;
	successorModelId?: string;
};

function fmtDate(d?: string) {
	if (!d) return "—";
	return new Date(d).toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

function getSeverity(days: number) {
	if (days <= 7)
		return {
			key: "critical" as const,
			label: "Critical",
			dot: "bg-red-500",
			text: "text-red-700",
		};
	if (days <= 30)
		return {
			key: "high" as const,
			label: "High",
			dot: "bg-amber-500",
			text: "text-amber-700",
		};
	if (days <= 90)
		return {
			key: "medium" as const,
			label: "Medium",
			dot: "bg-blue-500",
			text: "text-blue-700",
		};
	return {
		key: "low" as const,
		label: "Low",
		dot: "bg-slate-400",
		text: "text-slate-700",
	};
}

function daysUntilFrom(date?: string) {
	if (!date) return Infinity;
	const then = new Date(date).getTime();
	const now = Date.now();
	return Math.max(0, Math.ceil((then - now) / (1000 * 60 * 60 * 24)));
}

type ItemWithMeta = Warning & { displayDays: number };

function countBySeverity(items: ItemWithMeta[]) {
	const acc = { critical: 0, high: 0, medium: 0, low: 0 };
	for (const it of items) acc[getSeverity(it.displayDays).key]++;
	return acc;
}

function SevChip({
	label,
	count,
	dotClass,
}: {
	label: string;
	count: number;
	dotClass: string;
}) {
	if (!count) return null;
	return (
		<span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] leading-5">
			<span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
			<span className="opacity-80">{label}</span>
			<span className="font-mono tabular-nums opacity-70">{count}</span>
		</span>
	);
}

function MiniItem({
	id,
	days,
	succ,
}: {
	id: string;
	days: number;
	succ?: string;
}) {
	return (
		<span className="inline-flex items-center gap-2 rounded-md border bg-card px-2 py-1 text-[11px] leading-5 whitespace-nowrap">
			<span className="max-w-[170px] truncate font-medium">{id}</span>
			{succ && (
				<>
					<ArrowRight className="h-3 w-3 opacity-60 shrink-0" />
					<span className="max-w-[140px] truncate">{succ}</span>
				</>
			)}
			<span className="ml-1 rounded border px-1 py-0.5 font-mono tabular-nums">
				{days}d
			</span>
		</span>
	);
}

function DetailsTable({
	items,
	dateKey,
}: {
	items: ItemWithMeta[];
	dateKey: "deprecationDate" | "retirementDate";
}) {
	return (
		<div className="mt-2 overflow-x-auto rounded-lg border">
			<table className="w-full text-[12px]">
				<thead className="text-muted-foreground">
					<tr className="border-b">
						<th className="px-2 py-1 text-left font-medium">
							Model
						</th>
						<th className="px-2 py-1 text-left font-medium">
							Date
						</th>
						<th className="px-2 py-1 text-left font-medium">In</th>
						<th className="px-2 py-1 text-left font-medium">
							Successor
						</th>
					</tr>
				</thead>
				<tbody>
					{items.map((w) => {
						const tone = getSeverity(w.displayDays);
						return (
							<tr
								key={`${w.modelId}-${w.displayDays}`}
								className="border-b last:border-0 hover:bg-muted/40"
							>
								<td className="px-2 py-1">
									<div className="flex items-center gap-2 min-w-0">
										<span
											className={`h-1.5 w-1.5 rounded-full ${tone.dot}`}
										/>
										<span className="truncate">
											{w.modelId}
										</span>
									</div>
								</td>
								<td className="px-2 py-1 text-muted-foreground">
									{fmtDate(w[dateKey])}
								</td>
								<td className="px-2 py-1">
									<Badge
										variant="outline"
										className="text-[11px] px-1.5 py-0.5 font-mono tabular-nums"
									>
										{w.displayDays}d
									</Badge>
								</td>
								<td className="px-2 py-1">
									{w.successorModelId ? (
										<div className="flex items-center gap-1.5 min-w-0">
											<ArrowRight className="h-3 w-3 opacity-60 shrink-0" />
											<span className="truncate">
												{w.successorModelId}
											</span>
										</div>
									) : (
										"—"
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

function Banner({
	title,
	iconTone = "text-amber-600",
	items,
	dateKey,
}: {
	title: string;
	iconTone?: string;
	items: ItemWithMeta[];
	dateKey: "deprecationDate" | "retirementDate";
}) {
	if (!items.length) return null;

	const priority: Record<string, number> = {
		critical: 0,
		high: 1,
		medium: 2,
		low: 3,
	};
	const sorted = items.slice().sort((a, b) => {
		const pa = priority[getSeverity(a.displayDays).key];
		const pb = priority[getSeverity(b.displayDays).key];
		if (pa !== pb) return pa - pb;
		return a.displayDays - b.displayDays;
	});

	const next = sorted[0];
	const sev = countBySeverity(sorted);

	return (
		<div className="rounded-xl border bg-muted/40 p-2 sm:p-2">
			{/* Single condensed row */}
			<div className="flex flex-wrap items-center gap-2">
				<div className="flex items-center gap-2 shrink-0">
					<AlertTriangle className={`h-4 w-4 ${iconTone}`} />
					<span className="font-medium">{title}</span>
					<Badge
						variant="secondary"
						className="ml-1 h-5 px-1.5 text-[11px] leading-5"
					>
						{sorted.length}
					</Badge>
				</div>

				<div className="flex items-center gap-1 sm:gap-2 text-[11px] leading-5">
					<SevChip
						label="Critical"
						count={sev.critical}
						dotClass="bg-red-500"
					/>
					<SevChip
						label="High"
						count={sev.high}
						dotClass="bg-amber-500"
					/>
					<SevChip
						label="Medium"
						count={sev.medium}
						dotClass="bg-blue-500"
					/>
					<SevChip
						label="Low"
						count={sev.low}
						dotClass="bg-slate-400"
					/>
				</div>

				{/* Next pill */}
				<div className="ml-auto">
					<span className="inline-flex items-center gap-2 rounded-full border bg-card px-2 py-0.5 text-[11px] leading-5">
						<span className="text-muted-foreground">Next:</span>
						<span className="max-w-[220px] truncate font-medium">
							{next.modelId}
						</span>
						<Badge
							variant="outline"
							className="px-1.5 py-0.5 text-[11px] font-mono tabular-nums"
						>
							{next.displayDays}d
						</Badge>
						<span className="hidden md:inline text-muted-foreground">
							{fmtDate(next[dateKey])}
						</span>
					</span>
				</div>
			</div>

			{/* Quick peek chips */}
			<div className="mt-2 flex gap-2 overflow-x-auto pb-1">
				{sorted.slice(0, 6).map((w) => (
					<MiniItem
						key={`${title}-${w.modelId}-${w.displayDays}`}
						id={w.modelId}
						days={w.displayDays}
						succ={w.successorModelId}
					/>
				))}
			</div>

			{/* Details → compact table */}
			<details className="mt-1 group">
				<summary className="flex items-center gap-1 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
					<ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
					Show details
				</summary>
				<DetailsTable items={sorted} dateKey={dateKey} />
			</details>
		</div>
	);
}

export default async function DeprecationWarnings() {
	const teamId = await getTeamIdFromCookie();
	if (!teamId) return null;

	const warnings = (await getDeprecationWarningsForTeam(teamId)) as
		| Warning[]
		| undefined;
	if (!warnings?.length) return null;

	const sorted = warnings.slice().sort((a, b) => a.daysUntil - b.daysUntil);
	const priority: Record<string, number> = {
		critical: 0,
		high: 1,
		medium: 2,
		low: 3,
	};
	const flattened = sorted.slice().sort((a, b) => {
		const pa = priority[getSeverity(a.daysUntil).key];
		const pb = priority[getSeverity(b.daysUntil).key];
		if (pa !== pb) return pa - pb;
		return a.daysUntil - b.daysUntil;
	});

	const deprecations: ItemWithMeta[] = flattened
		.map((w) => ({ ...w, displayDays: daysUntilFrom(w.deprecationDate) }))
		.filter((w) => w.deprecationDate && Number.isFinite(w.displayDays));

	const retirements: ItemWithMeta[] = flattened
		.map((w) => ({ ...w, displayDays: daysUntilFrom(w.retirementDate) }))
		.filter((w) => w.retirementDate && Number.isFinite(w.displayDays));

	return (
		<div className="mt-4 space-y-3">
			<div className="flex items-center gap-2">
				<h3 className="text-base font-semibold">
					Model Deprecations & Retirements
				</h3>
				<Separator className="flex-1" />
			</div>

			{deprecations.length > 0 && (
				<Banner
					title="Deprecations"
					iconTone="text-amber-600"
					items={deprecations}
					dateKey="deprecationDate"
				/>
			)}
			{retirements.length > 0 && (
				<Banner
					title="Retirements"
					iconTone="text-red-600"
					items={retirements}
					dateKey="retirementDate"
				/>
			)}
		</div>
	);
}
