"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type {
	TokenTier,
	TokenTriple,
	QualityRow,
	ResolutionRow,
	ProviderSections,
} from "./pricingHelpers";
import { fmtUSD } from "./pricingHelpers";

export function TierTiles({ tiers }: { tiers: TokenTier[] }) {
	if (!tiers?.length)
		return <div className="text-sm text-muted-foreground">—</div>;
	const cols =
		tiers.length === 1
			? "grid-cols-1"
			: tiers.length === 2
			? "grid-cols-1 sm:grid-cols-2"
			: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
	return (
		<div className={`grid ${cols} gap-2`}>
			{tiers.map((t, i) => (
				<div key={i} className="rounded-md border px-3 py-2">
					<div className="text-xs text-muted-foreground mb-1">
						{t.label}
					</div>
					<div className="text-lg font-semibold">
						{fmtUSD(t.per1M)}
					</div>
				</div>
			))}
		</div>
	);
}

export function TokenTripleSection({
	title,
	triple,
}: {
	title: string;
	triple?: TokenTriple;
}) {
	if (!triple) return null;
	const segments = [
		{ label: "Input", tiers: triple.in },
		{ label: "Cached input", tiers: triple.cached },
		{ label: "Output", tiers: triple.out },
	].filter((s) => s.tiers.length > 0);
	if (!segments.length) return null;
	const gridCols =
		segments.length === 1
			? "grid-cols-1"
			: segments.length === 2
			? "grid-cols-1 sm:grid-cols-2"
			: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<h4 className="text-sm font-semibold">{title}</h4>
				<span className="text-xs text-muted-foreground">
					Per 1M tokens
				</span>
			</div>
			<div className={`grid ${gridCols} gap-3`}>
				{segments.map((s, idx) => (
					<div key={idx} className="rounded-lg border p-3">
						<div className="text-xs text-muted-foreground mb-2">
							{s.label}
						</div>
						<TierTiles tiers={s.tiers} />
					</div>
				))}
			</div>
		</div>
	);
}

function Tile({ title, value }: { title: string; value: string }) {
	return (
		<div className="rounded-lg border p-4">
			<div className="text-xs text-muted-foreground mb-1">{title}</div>
			<div className="text-xl font-semibold">{value}</div>
		</div>
	);
}

export function ImageGenSection({ rows }: { rows?: QualityRow[] }) {
	if (!rows || !rows.length) return null;
	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<h4 className="text-sm font-semibold">Image generation</h4>
				<span className="text-xs text-muted-foreground">Per image</span>
			</div>
			{rows.map((q) => (
				<div
					key={q.quality}
					className="grid grid-cols-1 sm:grid-cols-4 gap-3"
				>
					<Tile
						title="Quality"
						value={
							q.quality.charAt(0).toUpperCase() +
							q.quality.slice(1)
						}
					/>
					{q.items.map((it) => (
						<Tile
							key={it.label}
							title={it.label}
							value={fmtUSD(it.price)}
						/>
					))}
				</div>
			))}
		</div>
	);
}

export function VideoGenSection({ rows }: { rows?: ResolutionRow[] }) {
	if (!rows || !rows.length) return null;
	const byUnit: Record<string, ResolutionRow[]> = {};
	for (const r of rows) (byUnit[r.unitLabel] ??= []).push(r);

	return (
		<div className="space-y-3">
			<h4 className="text-sm font-semibold">Video generation</h4>
			{Object.entries(byUnit).map(([unit, list]) => (
				<div key={unit} className="space-y-2">
					<div className="flex items-center justify-end">
						<span className="text-xs text-muted-foreground">
							{unit}
						</span>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
						{list
							.sort((a, b) =>
								a.resolution.localeCompare(b.resolution)
							)
							.map((r, i) => (
								<Tile
									key={i}
									title={r.resolution}
									value={fmtUSD(r.price)}
								/>
							))}
					</div>
				</div>
			))}
		</div>
	);
}

export function CacheWriteSection({ rows }: { rows?: TokenTier[] }) {
	if (!rows?.length) return null;
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h4 className="text-sm font-semibold">Cache writes</h4>
					<Badge variant="outline">Per 1M tokens</Badge>
				</div>
				<span className="text-xs text-muted-foreground">
					Labels reflect cache_ttl or matching condition
				</span>
			</div>
			<TierTiles tiers={rows} />
		</div>
	);
}

export function AdvancedTable({
	rows,
}: {
	rows: ProviderSections["otherRules"];
}) {
	if (!rows.length) return null;
	return (
		<div className="space-y-2">
			<details className="rounded-lg border">
				<summary className="cursor-pointer list-none px-3 py-2 flex items-center justify-between">
					<span className="text-sm font-semibold">
						Advanced & conditional pricing
					</span>
					<span className="text-xs text-muted-foreground">
						Show/Hide
					</span>
				</summary>
				<div className="px-3 pb-3">
					<div className="overflow-x-auto rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Meter</TableHead>
									<TableHead>Unit</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>Conditions</TableHead>
									<TableHead>Rule</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rows.map((r, i) => (
									<TableRow key={i}>
										<TableCell className="text-xs">
											{r.meter}
										</TableCell>
										<TableCell className="text-xs">
											{r.unitLabel}
										</TableCell>
										<TableCell>{fmtUSD(r.price)}</TableCell>
										<TableCell className="text-xs text-muted-foreground">
											{r.conditions?.length
												? r.conditions.map((c, j) => (
														<span
															key={j}
															className="inline-block mr-2"
														>
															{`${c.path} ${
																c.op
															} ${
																Array.isArray(
																	c.value
																)
																	? JSON.stringify(
																			c.value
																	  )
																	: String(
																			c.value
																	  )
															}`}
														</span>
												  ))
												: "—"}
										</TableCell>
										<TableCell className="text-xs text-muted-foreground">
											{r.ruleId || "—"}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</details>
		</div>
	);
}
