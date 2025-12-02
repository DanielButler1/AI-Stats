import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/utils/supabase/admin";

const HOURS_DEFAULT = 24 * 7;
const PAGE_SIZE = 1000;
const MAX_PAGES = 12;
const HOUR_BUCKET_MINUTES = 60;
const SUCCESS_WINDOW_HOURS = 24;
const SUCCESS_BUCKET_MINUTES = 15;
const PROVIDER_WINDOW_HOURS = 24;
const PROVIDER_UPTIME_BUCKET_HOURS = 6;
const PROVIDER_UPTIME_BUCKET_MINUTES =
	PROVIDER_UPTIME_BUCKET_HOURS * 60;
const PROVIDER_WINDOW_MS = PROVIDER_WINDOW_HOURS * 60 * 60 * 1000;
const PROVIDER_BUCKET_DURATION_MS =
	PROVIDER_UPTIME_BUCKET_HOURS * 60 * 60 * 1000;
const PROVIDER_UPTIME_BUCKET_COUNT = Math.max(
	1,
	Math.round(PROVIDER_WINDOW_HOURS / PROVIDER_UPTIME_BUCKET_HOURS)
);
const TIME_OF_DAY_DAYS = 7;

type RawGatewayRequest = {
	created_at: string;
	success: boolean | number | string | null;
	latency_ms?: number | null;
	throughput?: number | null;
	generation_ms?: number | null;
	provider?: string | null;
};

type MetricBucket = {
	latencies: number[];
	throughputs: number[];
	generations: number[];
	requests: number;
	success: number;
};

type SuccessCounts = {
	requests: number;
	successes: number;
};

type ProviderMetricAccumulator = {
	latencies: number[];
	throughputs: number[];
	generations: number[];
	requests: number;
	successes: number;
	uptimeBuckets: SuccessCounts[];
};

function createProviderAccumulator(): ProviderMetricAccumulator {
	return {
		latencies: [],
		throughputs: [],
		generations: [],
		requests: 0,
		successes: 0,
		uptimeBuckets: Array.from(
			{ length: PROVIDER_UPTIME_BUCKET_COUNT },
			() => ({ requests: 0, successes: 0 })
		),
	};
}

function percentile(values: number[], p: number): number | null {
	if (!values.length) return null;
	const sorted = [...values].sort((a, b) => a - b);
	const rank = (sorted.length - 1) * p;
	const lower = Math.floor(rank);
	const upper = Math.ceil(rank);
	if (lower === upper) {
		return sorted[lower];
	}
	const weight = rank - lower;
	return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function roundDownToBucket(date: Date, bucketMinutes: number): string {
	const bucket = new Date(date);
	const mins = bucket.getUTCMinutes();
	const floored = Math.floor(mins / bucketMinutes) * bucketMinutes;
	bucket.setUTCMinutes(floored, 0, 0);
	return bucket.toISOString();
}

function normalizeSuccess(
	value: boolean | number | string | null | undefined
): boolean {
	if (typeof value === "boolean") {
		return value;
	}
	if (typeof value === "number") {
		return value === 1;
	}
	if (typeof value === "string") {
		const normalized = value.toLowerCase();
		return ["true", "t", "1"].includes(normalized);
	}
	return false;
}

async function fetchGatewayRequests(
	client: SupabaseClient,
	modelId: string,
	fromIso: string,
	toIso: string
): Promise<RawGatewayRequest[]> {
	const rows: RawGatewayRequest[] = [];
	const startDay = new Date(fromIso);
	startDay.setUTCHours(0, 0, 0, 0);

	const endDay = new Date(toIso);
	endDay.setUTCHours(0, 0, 0, 0);

	for (
		let day = new Date(startDay);
		day.getTime() <= endDay.getTime();
		day.setUTCDate(day.getUTCDate() + 1)
	) {
		const dayStartIso = day.toISOString();
		const nextDay = new Date(day.getTime() + 24 * 60 * 60 * 1000).toISOString();

		const effectiveFrom =
			day.getTime() === startDay.getTime() ? fromIso : dayStartIso;
		const effectiveTo =
			day.getTime() === endDay.getTime() ? toIso : nextDay;

		for (let page = 0; page < MAX_PAGES; page++) {
			const from = page * PAGE_SIZE;
			const to = from + PAGE_SIZE - 1;

			const { data, error } = await client
				.from("gateway_requests")
				.select(
					"created_at, success, latency_ms, throughput, generation_ms, provider"
				)
				.eq("model_id", modelId)
				.gte("created_at", effectiveFrom)
				.lt("created_at", effectiveTo)
				.order("created_at", { ascending: true })
				.range(from, to);

			if (error) {
				throw new Error(
					error.message ?? "Failed to load gateway performance data"
				);
			}

			if (!data?.length) break;

			rows.push(
				...(data as RawGatewayRequest[]).filter(
					(row) => Boolean(row?.created_at)
				)
			);

			if (data.length < PAGE_SIZE) break;
		}
	}

	return rows;
}

async function fetchTimeOfDayMetrics(
	client: SupabaseClient,
	modelId: string,
	days: number
): Promise<ModelTimeOfDayPoint[]> {
	const { data, error } = await client.rpc(
		"get_model_time_of_day_metrics",
		{
			p_model_id: modelId,
			p_days: days,
		}
	);

	if (error) {
		throw new Error(
			error.message ?? "Failed to load time-of-day performance"
		);
	}

	return (
		data?.map((row: any) => ({
			hour: Number(row.hour),
			avgThroughput:
				row.median_throughput != null
					? Number(row.median_throughput)
					: null,
			avgLatencyMs:
				row.median_latency_ms != null
					? Number(row.median_latency_ms)
					: null,
			avgGenerationMs:
				row.median_generation_ms != null
					? Number(row.median_generation_ms)
					: null,
			sampleCount: Number(row.samples ?? 0),
		})) ?? []
	);
}

export type ModelPerformancePoint = {
	bucket: string;
	avgThroughput: number | null;
	avgLatencyMs: number | null;
	avgGenerationMs: number | null;
	requests: number;
	successPct: number | null;
};

export type ModelSuccessPoint = {
	bucket: string;
	overallSuccessPct: number | null;
	worstProviderSuccessPct: number | null;
	requests: number;
};

export type ModelTimeOfDayPoint = {
	hour: number;
	avgThroughput: number | null;
	avgLatencyMs: number | null;
	avgGenerationMs: number | null;
	sampleCount: number;
};

export type ModelProviderUptimeBucket = {
	start: string;
	end: string;
	successPct: number | null;
};

export type ModelProviderPerformance = {
	provider: string;
	providerName: string;
	avgThroughput: number | null;
	avgLatencyMs: number | null;
	avgGenerationMs: number | null;
	requests: number;
	uptimePct: number | null;
	uptimeBuckets: ModelProviderUptimeBucket[];
};

export interface ModelPerformanceSummary {
	avgThroughput: number | null;
	avgLatencyMs: number | null;
	avgGenerationMs: number | null;
	uptimePct: number | null;
	totalRequests: number;
	successfulRequests: number;
}

export interface ModelPerformanceRange {
	start: string;
	end: string;
}

export interface ModelPerformanceMetrics {
	summary: ModelPerformanceSummary;
	hourly: ModelPerformancePoint[];
	successSeries: ModelSuccessPoint[];
	timeOfDay: ModelTimeOfDayPoint[];
	providerPerformance: ModelProviderPerformance[];
	dataRange: ModelPerformanceRange;
}

export async function getModelPerformanceMetrics(
	modelId: string,
	hours: number = HOURS_DEFAULT
): Promise<ModelPerformanceMetrics> {
	const now = new Date();
	const client = createAdminClient();

	const hoursToGenerate = Math.max(1, Math.floor(hours));
	const alignedRangeEnd = new Date(now);
	alignedRangeEnd.setUTCMinutes(0, 0, 0);
	const alignedRangeStart = new Date(
		alignedRangeEnd.getTime() -
			(hoursToGenerate - 1) * 60 * 60 * 1000
	);

	const fetchFromIso = alignedRangeStart.toISOString();
	const fetchToIso = now.toISOString();

	const rows = await fetchGatewayRequests(
		client,
		modelId,
		fetchFromIso,
		fetchToIso
	);

	const sortedRows = [...rows];
	sortedRows.sort((a, b) => {
		const at = new Date(a.created_at).getTime();
		const bt = new Date(b.created_at).getTime();
		return at - bt;
	});

	const rangeStart =
		sortedRows.length > 0
			? sortedRows[0].created_at
			: fetchFromIso;
	const rangeEnd =
		sortedRows.length > 0
			? sortedRows[sortedRows.length - 1].created_at
			: fetchToIso;

	const hourlyBuckets = new Map<string, MetricBucket>();
	const successBuckets = new Map<string, SuccessCounts>();
	const providerSuccessByBucket = new Map<
		string,
		Map<string, SuccessCounts>
	>();
	const providerAggregates = new Map<string, ProviderMetricAccumulator>();

	const latencies: number[] = [];
	const throughputs: number[] = [];
	const generations: number[] = [];
	let totalRequests = 0;
	let totalSuccesses = 0;

	for (const row of rows) {
		if (!row.created_at) continue;

		const timestamp = new Date(row.created_at);
		const timestampMs = timestamp.getTime();
		if (!Number.isFinite(timestampMs)) continue;

		const diffMs = now.getTime() - timestampMs;
		const withinProviderWindow =
			diffMs >= 0 && diffMs < PROVIDER_WINDOW_MS;

		const success = normalizeSuccess(row.success);
		totalRequests += 1;
		if (success) {
			totalSuccesses += 1;
		}

		const hourKey = roundDownToBucket(timestamp, HOUR_BUCKET_MINUTES);
		const hourBucket: MetricBucket =
			hourlyBuckets.get(hourKey) ?? {
				latencies: [],
				throughputs: [],
				generations: [],
				requests: 0,
				success: 0,
			};
		hourBucket.requests += 1;
		if (success) {
			hourBucket.success += 1;
		}

		let latencyValue: number | null = null;
		if (
			row.latency_ms != null &&
			Number.isFinite(Number(row.latency_ms))
		) {
			latencyValue = Number(row.latency_ms);
			hourBucket.latencies.push(latencyValue);
			latencies.push(latencyValue);
		}

		let throughputValue: number | null = null;
		if (
			row.throughput != null &&
			Number.isFinite(Number(row.throughput))
		) {
			throughputValue = Number(row.throughput);
			hourBucket.throughputs.push(throughputValue);
			throughputs.push(throughputValue);
		}

		let generationValue: number | null = null;
		if (
			row.generation_ms != null &&
			Number.isFinite(Number(row.generation_ms))
		) {
			generationValue = Number(row.generation_ms);
			hourBucket.generations.push(generationValue);
			generations.push(generationValue);
		}

		hourlyBuckets.set(hourKey, hourBucket);

		const successKey = roundDownToBucket(timestamp, SUCCESS_BUCKET_MINUTES);
		const successBucket: SuccessCounts =
			successBuckets.get(successKey) ?? {
				requests: 0,
				successes: 0,
			};
		successBucket.requests += 1;
		if (success) {
			successBucket.successes += 1;
		}
		successBuckets.set(successKey, successBucket);

		const providerId = row.provider;
		if (providerId) {
			const providerMap =
				providerSuccessByBucket.get(successKey) ?? new Map();
			const providerStats: SuccessCounts =
				providerMap.get(providerId) ?? {
					requests: 0,
					successes: 0,
				};
			providerStats.requests += 1;
			if (success) {
				providerStats.successes += 1;
			}
			providerMap.set(providerId, providerStats);
			providerSuccessByBucket.set(successKey, providerMap);
		}

		if (providerId && withinProviderWindow) {
			const providerBucket =
				providerAggregates.get(providerId) ??
				createProviderAccumulator();

			providerBucket.requests += 1;
			if (success) {
				providerBucket.successes += 1;
			}

			if (latencyValue != null) {
				providerBucket.latencies.push(latencyValue);
			}

			if (throughputValue != null) {
				providerBucket.throughputs.push(throughputValue);
			}

			if (generationValue != null) {
				providerBucket.generations.push(generationValue);
			}

			const providerBucketIndex = Math.floor(
				diffMs / PROVIDER_BUCKET_DURATION_MS
			);
			if (
				providerBucketIndex >= 0 &&
				providerBucketIndex < providerBucket.uptimeBuckets.length
			) {
				const uptimeBucket =
					providerBucket.uptimeBuckets[providerBucketIndex];
				uptimeBucket.requests += 1;
				if (success) {
					uptimeBucket.successes += 1;
				}
			}

			providerAggregates.set(providerId, providerBucket);
		}
	}

	const hourly: ModelPerformancePoint[] = [];

	for (
		let cursor = new Date(alignedRangeStart);
		cursor.getTime() <= alignedRangeEnd.getTime();
		cursor.setUTCHours(cursor.getUTCHours() + 1)
	) {
		const bucketKey = cursor.toISOString();
		const bucket = hourlyBuckets.get(bucketKey);

		const avgLatency = bucket
			? percentile(bucket.latencies, 0.5)
			: null;
		const avgThroughput = bucket
			? percentile(bucket.throughputs, 0.5)
			: null;
		const avgGeneration = bucket
			? percentile(bucket.generations, 0.5)
			: null;
		const successPct =
			bucket && bucket.requests > 0
				? (bucket.success / bucket.requests) * 100
				: null;

		hourly.push({
			bucket: bucketKey,
			avgLatencyMs: avgLatency,
			avgThroughput,
			avgGenerationMs: avgGeneration,
			requests: bucket?.requests ?? 0,
			successPct,
		});
	}

	const successSeries: ModelSuccessPoint[] = [];
	const successStart = new Date(
		now.getTime() - SUCCESS_WINDOW_HOURS * 60 * 60 * 1000
	);
	const roundedMinutes = Math.floor(
		successStart.getUTCMinutes() / SUCCESS_BUCKET_MINUTES
	) * SUCCESS_BUCKET_MINUTES;
	successStart.setUTCMinutes(roundedMinutes, 0, 0);

	for (
		let cursor = new Date(successStart);
		cursor.getTime() <= now.getTime();
		cursor.setUTCMinutes(cursor.getUTCMinutes() + SUCCESS_BUCKET_MINUTES)
	) {
		const bucketKey = cursor.toISOString();
		const bucket = successBuckets.get(bucketKey);

		const overallSuccessPct =
			bucket && bucket.requests > 0
				? (bucket.successes / bucket.requests) * 100
				: null;

		let worstProviderPct: number | null = null;
		const providerMap = providerSuccessByBucket.get(bucketKey);
		providerMap?.forEach((stats) => {
			if (stats.requests === 0) return;
			const pct = (stats.successes / stats.requests) * 100;
			if (worstProviderPct === null || pct < worstProviderPct) {
				worstProviderPct = pct;
			}
		});

		successSeries.push({
			bucket: bucketKey,
			overallSuccessPct,
			worstProviderSuccessPct: worstProviderPct,
			requests: bucket?.requests ?? 0,
		});
	}

	const timeOfDay = await fetchTimeOfDayMetrics(
		client,
		modelId,
		TIME_OF_DAY_DAYS
	);

	let providerPerformance: ModelProviderPerformance[] = [];
	providerAggregates.forEach((stats, providerId) => {
		const uptimeBuckets = stats.uptimeBuckets
			.map((bucket, index) => {
				const bucketEnd = new Date(
					now.getTime() - index * PROVIDER_BUCKET_DURATION_MS
				);
				const bucketStart = new Date(
					bucketEnd.getTime() - PROVIDER_BUCKET_DURATION_MS
				);
				const successPct =
					bucket.requests > 0
						? (bucket.successes / bucket.requests) * 100
						: null;

				return {
					start: bucketStart.toISOString(),
					end: bucketEnd.toISOString(),
					successPct,
				};
			})
			.reverse();

		providerPerformance.push({
			provider: providerId,
			providerName: providerId,
			avgThroughput: percentile(stats.throughputs, 0.5),
			avgLatencyMs: percentile(stats.latencies, 0.5),
			avgGenerationMs: percentile(stats.generations, 0.5),
			requests: stats.requests,
			uptimePct:
				stats.requests > 0
					? (stats.successes / stats.requests) * 100
					: null,
			uptimeBuckets,
		});
	});
	providerPerformance.sort((a, b) => b.requests - a.requests);

	if (providerPerformance.length) {
		const providerIds = providerPerformance.map((p) => p.provider);
		try {
			const { data, error } = await client
				.from("data_api_providers")
				.select("api_provider_id, api_provider_name")
				.in("api_provider_id", providerIds);

			if (error) {
				console.warn("[model-performance] failed to load provider names", {
					error,
					providerIds,
				});
			} else if (data) {
				const nameMap = new Map<string, string>();
				for (const row of data) {
					if (!row?.api_provider_id) continue;
					nameMap.set(
						row.api_provider_id,
						row.api_provider_name ?? row.api_provider_id
					);
				}
				providerPerformance = providerPerformance.map((provider) => ({
					...provider,
					providerName:
						nameMap.get(provider.provider) ?? provider.provider,
				}));
			}
		} catch (error) {
			console.warn("[model-performance] error while mapping provider names", {
				error,
				providerIds,
			});
		}
	}

	const summary: ModelPerformanceSummary = {
		avgThroughput: percentile(throughputs, 0.5),
		avgLatencyMs: percentile(latencies, 0.5),
		avgGenerationMs: percentile(generations, 0.5),
		uptimePct:
			totalRequests > 0
				? (totalSuccesses / totalRequests) * 100
				: null,
		totalRequests,
		successfulRequests: totalSuccesses,
	};

	return {
		summary,
		hourly,
		successSeries,
		timeOfDay,
		providerPerformance,
		dataRange: {
			start: rangeStart,
			end: rangeEnd,
		},
	};
}
