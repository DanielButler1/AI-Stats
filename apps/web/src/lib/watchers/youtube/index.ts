import type { SupabaseClient } from "@supabase/supabase-js";

const ALLOWED = new Set([
    "UCXZCJLdBC09xxGZ6gcdrc6A", // OpenAI
    "UCYlq-KmwPjc1DtsGmthFqSQ", // Figure
    "UCP7jMXSY2xbc3KCAE0MHQ-A", // DeepMind
    "UCrDwWp7EBBv4NwvScIpBDOA", // Anthropic
]);

const MAX_RESULTS = 50;
const YT_API_KEY = process.env.YT_API_KEY ?? "";

type YoutubeRow = {
    type: "youtube";
    who: string;
    title: string;
    link: string;
    created_at: string;
};

type ChannelSummary = {
    channelId: string;
    rows: YoutubeRow[];
    error: string | null;
};

export type YoutubeWatcherSummary = {
    ok: boolean;
    channels: Array<{ channelId: string; insertedOrUpdated: number; error: string | null }>;
    total: number;
    startedAt: string;
    finishedAt: string;
    dbError: string | null;
};

async function fetchRecent(channelId: string, maxResults = 25, apiKey: string): Promise<YoutubeRow[]> {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("channelId", channelId);
    url.searchParams.set("type", "video");
    url.searchParams.set("order", "date");
    url.searchParams.set("maxResults", String(Math.min(maxResults, MAX_RESULTS)));

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(`search.list ${channelId} -> ${response.status} ${body}`);
    }

    type YoutubeSearchItem = {
        id?: { videoId?: string | null } | null;
        snippet?: {
            channelTitle?: string | null;
            title?: string | null;
            publishedAt?: string | null;
        } | null;
    };

    type YoutubeSearchResponse = {
        items?: YoutubeSearchItem[] | null;
    };

    const payload = (await response.json()) as YoutubeSearchResponse;
    const items = Array.isArray(payload?.items) ? payload.items : [];

    return items
        .map((item: YoutubeSearchItem): YoutubeRow | null => {
            const videoId = item?.id?.videoId ?? undefined;
            const snippet = item?.snippet ?? null;
            if (!videoId) return null;

            const who = snippet?.channelTitle ?? "Unknown Channel";
            const title = snippet?.title ?? "(untitled)";
            const created_at = snippet?.publishedAt ?? "";
            return {
                type: "youtube" as const,
                who,
                title,
                link: `https://www.youtube.com/watch?v=${videoId}`,
                created_at,
            };
        })
        .filter((item): item is YoutubeRow => Boolean(item));
}

export async function runYoutubeWatcher(
    supabase: SupabaseClient,
    options?: { channelIds?: string[]; maxResults?: number }
): Promise<YoutubeWatcherSummary> {
    const startedAt = new Date().toISOString();

    const apiKey = (() => {
        if (!YT_API_KEY) {
            throw new Error("Missing YT_API_KEY");
        }
        return YT_API_KEY;
    })();

    const channelIds =
        Array.isArray(options?.channelIds) && options.channelIds.length
            ? options.channelIds.filter((id) => ALLOWED.has(id))
            : Array.from(ALLOWED);

    const maxResults = Math.min(options?.maxResults ?? 25, MAX_RESULTS);

    const channelSummaries: ChannelSummary[] = await Promise.all(
        channelIds.map(async (id) => {
            try {
                const rows = await fetchRecent(id, maxResults, apiKey);
                return { channelId: id, rows, error: null };
            } catch (error: any) {
                return { channelId: id, rows: [], error: error?.message ?? String(error) };
            }
        })
    );

    const allRows = channelSummaries.flatMap((summary) => summary.rows);
    let dbError: string | null = null;
    if (allRows.length) {
        const { error } = await supabase.from("updates").upsert(allRows, { onConflict: "link" });
        if (error) {
            dbError = error.message;
        }
    }

    return {
        ok: dbError === null,
        startedAt,
        finishedAt: new Date().toISOString(),
        channels: channelSummaries.map((summary) => ({
            channelId: summary.channelId,
            insertedOrUpdated: summary.rows.length,
            error: summary.error,
        })),
        total: allRows.length,
        dbError,
    };
}
