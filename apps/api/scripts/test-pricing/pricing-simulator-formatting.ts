import { createTable } from "@visulima/tabular";
import type { SimulationRun, TabularTable } from "./pricing-simulator-types";
import { DIFF_TOLERANCE } from "./pricing-simulator-constants";

export function formatUsageSnapshot(usage: Record<string, number>): string {
    const entries = Object.entries(usage);
    if (!entries.length) return "--";
    return entries
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, val]) => `${key}: ${val}`)
        .join("\n");
}

export function isFlaggedDiff(diff: number, tolerance: number = DIFF_TOLERANCE): boolean {
    return Math.abs(diff) > tolerance;
}

export function formatUsdValue(value: number | string, dp = 9): string {
    return ensureNumber(value).toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

export function formatEstimated(value: number | string): string {
    return formatUsdValue(value, 9);
}

export function formatBilled(value: number | string, flagged: boolean): string {
    const suffix = flagged ? " (!!)" : "";
    return `${formatUsdValue(value, 9)}${suffix}`;
}

export function formatDiff(diff: number): string {
    const flagged = isFlaggedDiff(diff);
    if (!flagged) {
        return "0.000000000";
    }
    const prefix = diff >= 0 ? "+" : "-";
    const magnitude = Math.abs(diff).toFixed(9);
    return `${prefix}${magnitude}${flagged ? " (!!)" : ""}`;
}

export function renderSummaryTable(runs: SimulationRun[]): string {
    const table = createTable({
        wordWrap: true,
        showHeader: true,
        maxWidth: 200,
        style: { paddingLeft: 1, paddingRight: 1 },
    }) as TabularTable;

    table.setHeaders(["Provider", "Model", "Endpoint", "Plan", "Est. USD", "Billed USD", "Diff USD", "Usage snapshot"]);

    for (const run of runs) {
        const flagged = isFlaggedDiff(run.diffUsd);
        table.addRow([
            run.combo.provider,
            run.combo.model,
            run.combo.endpoint,
            run.plan,
            formatEstimated(run.estimation.totalUsdStr),
            formatBilled(run.engineTotalUsdStr, flagged),
            formatDiff(run.diffUsd),
            formatUsageSnapshot(run.usage),
        ]);
    }

    return table.toString();
}

export function renderBreakdown(run: SimulationRun): string {
    if (!run.breakdown.length) return "No pricing lines generated.";

    const table = createTable({
        showHeader: true,
        style: { paddingLeft: 1, paddingRight: 1 },
        wordWrap: true,
    }) as TabularTable;

    table.setHeaders(["Meter", "Qty", "Billable Units", "Unit Price", "Line Cost"]);

    for (const line of run.breakdown) {
        table.addRow([
            line.dimension,
            String(line.quantity),
            String(line.billable_units),
            line.unit_price_usd.toString(),
            line.line_cost_usd.toString(),
        ]);
    }

    return table.toString();
}

function ensureNumber(value: unknown, fallback = 0): number {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}