import { unstable_cache } from "next/cache";
import { createClient } from "@/utils/supabase/client";
import type { UpdateCardProps } from "@/lib/fetchers/updates/getLatestUpdates";
import type React from "react";
import { MonitorPlay } from "lucide-react";

type DbRow = {
	id: string;
	who: string;
	title: string;
	link: string;
	created_at: string;
};

type CachedRow = {
	id: string;
	who: string;
	title: string;
	link: string;
	created_at: string;
};

const TABLE_NAME = "updates";
const DEFAULT_LIMIT = 60;

const YOUTUBE_BADGE_LABEL = "YouTube Watcher";
const YOUTUBE_BADGE_CLASS =
	"px-2 py-1 text-xs flex items-center gap-1 transition-colors bg-rose-100 text-rose-900 border border-rose-300 hover:bg-rose-200 hover:text-rose-900 hover:border-rose-400 dark:bg-rose-900/60 dark:text-rose-200 dark:border-rose-700 dark:hover:bg-rose-900 dark:hover:text-rose-200 dark:hover:border-rose-600 rounded-full";
const YOUTUBE_ACCENT_CLASS = "bg-rose-500";
const YouTubeIcon =
	MonitorPlay as unknown as React.ComponentType<{ className?: string }>;

function normaliseLimit(limit: number): number {
	if (!Number.isFinite(limit)) return DEFAULT_LIMIT;
	const value = Math.trunc(limit);
	return value > 0 ? value : DEFAULT_LIMIT;
}

function isExternal(href: string) {
	try {
		const url = new URL(href);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
}

function relTime(iso: string, now = new Date()) {
	const diffMs = +now - Date.parse(iso);
	const sec = Math.round(diffMs / 1000);
	const abs = Math.abs(sec);
	const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

	if (abs < 60) return rtf.format(-sec, "second");
	const min = Math.round(sec / 60);
	if (Math.abs(min) < 60) return rtf.format(-min, "minute");
	const hrs = Math.round(min / 60);
	if (Math.abs(hrs) < 24) return rtf.format(-hrs, "hour");
	const days = Math.round(hrs / 24);
	if (Math.abs(days) < 30) return rtf.format(-days, "day");
	const months = Math.round(days / 30);
	if (Math.abs(months) < 12) return rtf.format(-months, "month");
	const years = Math.round(months / 12);
	return rtf.format(-years, "year");
}

async function fetchYouTubeUpdateRows(limit: number): Promise<CachedRow[]> {
	const supabase = await createClient();

	const { data, error } = (await supabase
		.from(TABLE_NAME)
		.select("id,type,who,title,link,created_at")
		.eq("type", "youtube")
		.order("created_at", { ascending: false })
		.limit(limit)) as { data: (DbRow & { type?: string })[] | null; error: any };

	if (error) {
		console.error("[updates] failed to query Supabase updates table:", error);
		return [];
	}

	return (data ?? []).map((row) => ({
		id: row.id,
		title: row.title,
		who: row.who,
		link: row.link,
		created_at: new Date(row.created_at).toISOString(),
	}));
}

const getYouTubeUpdateRowsCached = unstable_cache(
	async (limit: number) => await fetchYouTubeUpdateRows(limit),
	["data:latest-youtube-updates"],
	{ revalidate: 60 * 60 * 24, tags: ["data:latest-youtube-updates"] }
);

function toUpdateCard(row: CachedRow): UpdateCardProps {
	const { created_at, ...rest } = row;
	return {
		id: rest.id,
		title: rest.title,
		subtitle: rest.who,
		link: {
			href: rest.link,
			external: isExternal(rest.link),
			cta: "Watch",
		},
		dateIso: created_at,
		relative: relTime(created_at),
		badges: [
			{
				label: YOUTUBE_BADGE_LABEL,
				icon: YouTubeIcon,
				className: YOUTUBE_BADGE_CLASS,
			},
		],
		accentClass: YOUTUBE_ACCENT_CLASS,
	};
}

export async function getYouTubeUpdates(
	limit: number
): Promise<UpdateCardProps[]> {
	const effectiveLimit = normaliseLimit(limit);
	const rows = await getYouTubeUpdateRowsCached(effectiveLimit);
	return rows.map(toUpdateCard);
}

export async function getYouTubeUpdatesCached(
	limit: number
): Promise<UpdateCardProps[]> {
	return await getYouTubeUpdates(limit);
}
