"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/utils/supabase/admin";
import { sumTokens } from "@/lib/utils/sumTokens";

const TOKENS_PAGE_SIZE = 1000;
const TOKENS_MAX_PAGES = 12;

type TokenUsageRow = {
	usage?: any;
};

type ModelRow = {
	model_id: string;
	name: string | null;
	release_date: string | null;
	deprecation_date: string | null;
};

export type ModelTokenTrajectoryPoint = {
	date: string;
	tokens: number;
	cumulativeTokens: number;
	daysSinceRelease: number;
};

export type ModelTokenMilestone = {
	threshold: number;
	reachedOn: string | null;
	daysSinceRelease: number | null;
};

export type ModelSuccessorMilestone = {
	modelId: string;
	name: string;
	releaseDate: string | null;
	daysSinceRelease: number | null;
};

export type ModelTokenTrajectory = {
	releaseDate: string;
	deprecationDate: string | null;
	deprecationDaysSinceRelease: number | null;
	points: ModelTokenTrajectoryPoint[];
	tokenMilestones: ModelTokenMilestone[];
	successorMilestones: ModelSuccessorMilestone[];
};

function differenceInDays(from: Date, to: Date): number {
	const diff = to.getTime() - from.getTime();
	return Math.max(0, Math.floor(diff / (24 * 60 * 60 * 1000)));
}

function normalizeDayKey(date: Date): string {
	const copy = new Date(date);
	copy.setUTCHours(0, 0, 0, 0);
	return copy.toISOString();
}

async function fetchDailyTokens(
	client: SupabaseClient,
	modelId: string,
	start: Date,
	end: Date
) {
	const dayTotals = new Map<string, number>();
	const startDay = new Date(start);
	startDay.setUTCHours(0, 0, 0, 0);
	const endDay = new Date(end);
	endDay.setUTCHours(0, 0, 0, 0);

	for (
		let cursor = new Date(startDay);
		cursor.getTime() <= endDay.getTime();
		cursor.setUTCDate(cursor.getUTCDate() + 1)
	) {
		const dayStart = new Date(cursor);
		const dayEnd = new Date(cursor);
		dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

		const dayKey = normalizeDayKey(dayStart);
		dayTotals.set(dayKey, 0);

		for (let page = 0; page < TOKENS_MAX_PAGES; page++) {
			const from = page * TOKENS_PAGE_SIZE;
			const to = from + TOKENS_PAGE_SIZE - 1;

			const { data, error } = await client
				.from("gateway_requests")
				.select("usage")
				.eq("model_id", modelId)
				.gte("created_at", dayStart.toISOString())
				.lt("created_at", dayEnd.toISOString())
				.order("created_at", { ascending: true })
				.range(from, to);

			if (error) {
				throw new Error(
					error.message ?? "Failed to load token usage history"
				);
			}

			if (!data?.length) break;

			let totalForDay = dayTotals.get(dayKey) ?? 0;
			for (const row of data as TokenUsageRow[]) {
				totalForDay += sumTokens(row.usage);
			}
			dayTotals.set(dayKey, totalForDay);

			if (data.length < TOKENS_PAGE_SIZE) break;
		}
	}

	return dayTotals;
}

function buildTokenMilestones(
	points: ModelTokenTrajectoryPoint[],
	thresholds: number[]
): ModelTokenMilestone[] {
	return thresholds.map((threshold) => {
		const hit = points.find((point) => point.cumulativeTokens >= threshold);
		return {
			threshold,
			reachedOn: hit?.date ?? null,
			daysSinceRelease: hit?.daysSinceRelease ?? null,
		};
	});
}

function buildSuccessorMilestones(
	successors: ModelRow[],
	releaseDate: Date
): ModelSuccessorMilestone[] {
	return successors.map((successor) => {
		const release = successor.release_date
			? new Date(successor.release_date)
			: null;

		return {
			modelId: successor.model_id,
			name: successor.name ?? successor.model_id,
			releaseDate: successor.release_date,
			daysSinceRelease: release
				? differenceInDays(releaseDate, release)
				: null,
		};
	});
}

export async function getModelTokenTrajectory(
	modelId: string
): Promise<ModelTokenTrajectory | null> {
	const client = createAdminClient();

	const { data: modelRow, error: modelError } = await client
		.from("data_models")
		.select("model_id, name, release_date, deprecation_date")
		.eq("model_id", modelId)
		.single<ModelRow>();

	if (modelError) {
		throw new Error(
			modelError.message ?? "Failed to load model release metadata"
		);
	}

	if (!modelRow?.release_date) {
		return null;
	}

	const releaseDate = new Date(modelRow.release_date);
	const deprecationDate = modelRow.deprecation_date
		? new Date(modelRow.deprecation_date)
		: null;
	const now = new Date();

	if (releaseDate.getTime() > now.getTime()) {
		return null;
	}

	const totals = await fetchDailyTokens(client, modelId, releaseDate, now);

	const points: ModelTokenTrajectoryPoint[] = [];
	let cumulativeTokens = 0;

	for (
		let cursor = new Date(releaseDate);
		cursor.getTime() <= now.getTime();
		cursor.setUTCDate(cursor.getUTCDate() + 1)
	) {
		const dayKey = normalizeDayKey(cursor);
		const tokens = totals.get(dayKey) ?? 0;
		cumulativeTokens += tokens;
		points.push({
			date: dayKey,
			tokens,
			cumulativeTokens,
			daysSinceRelease: differenceInDays(releaseDate, cursor),
		});
	}

	const { data: successorRows, error: successorError } = await client
		.from("data_models")
		.select("model_id, name, release_date, deprecation_date")
		.eq("previous_model_id", modelId);

	if (successorError) {
		throw new Error(
			successorError.message ?? "Failed to load successor models"
		);
	}

	const tokenMilestones = buildTokenMilestones(points, [
		1_000_000,
		10_000_000,
		100_000_000,
		1_000_000_000,
	]);

	const successorMilestones = buildSuccessorMilestones(
		(successorRows as ModelRow[]) ?? [],
		releaseDate
	);

	return {
		releaseDate: releaseDate.toISOString(),
		deprecationDate: deprecationDate?.toISOString() ?? null,
		deprecationDaysSinceRelease: deprecationDate
			? differenceInDays(releaseDate, deprecationDate)
			: null,
		points,
		tokenMilestones,
		successorMilestones,
	};
}
