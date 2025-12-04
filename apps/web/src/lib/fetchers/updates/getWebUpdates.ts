import { unstable_cache } from "next/cache";
import { createClient } from "@/utils/supabase/client";
import type { UpdateCardProps } from "@/lib/fetchers/updates/getLatestUpdates";
import type React from "react";
import { Globe } from "lucide-react";

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

const WEB_BADGE_LABEL = "Web Update";
const WEB_BADGE_CLASS =
	"px-2 py-1 text-xs flex items-center gap-1 transition-colors bg-sky-100 text-sky-900 border border-sky-300 hover:bg-sky-200 hover:text-sky-900 hover:border-sky-400 dark:bg-sky-900/60 dark:text-sky-200 dark:border-sky-700 dark:hover:bg-sky-900 dark:hover:text-sky-200 dark:hover:border-sky-600 rounded-full";
const WEB_ACCENT_CLASS = "bg-sky-500";
const WebIcon =
	Globe as unknown as React.ComponentType<{ className?: string }>;

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

async function fetchWebUpdateRows(limit: number): Promise<CachedRow[]> {
	const supabase = await createClient();

	const { data, error } = (await supabase
		.from(TABLE_NAME)
		.select("id,type,who,title,link,created_at")
		.eq("type", "web")
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

const getWebUpdateRowsCached = unstable_cache(
	async (limit: number) => await fetchWebUpdateRows(limit),
	["data:latest-web-updates"],
	{ revalidate: 60 * 60 * 24, tags: ["data:latest-web-updates"] }
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
			cta: "Open",
		},
		dateIso: created_at,
		// relative: relTime(created_at),
		badges: [
			{
				label: WEB_BADGE_LABEL,
				icon: WebIcon,
				className: WEB_BADGE_CLASS,
			},
		],
		accentClass: WEB_ACCENT_CLASS,
	};
}

export async function getWebUpdates(
	limit: number
): Promise<UpdateCardProps[]> {
	const effectiveLimit = normaliseLimit(limit);
	const rows = await getWebUpdateRowsCached(effectiveLimit);
	return rows.map(toUpdateCard);
}

export async function getWebUpdatesCached(
	limit: number
): Promise<UpdateCardProps[]> {
	return await getWebUpdates(limit);
}
