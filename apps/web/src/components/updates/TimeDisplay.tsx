"use client";

import { useEffect, useReducer } from "react";

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

function isDateToday(dateStr: string) {
	const now = new Date();
	const date = new Date(dateStr);
	return (
		now.getFullYear() === date.getFullYear() &&
		now.getMonth() === date.getMonth() &&
		now.getDate() === date.getDate()
	);
}

function formatDate(dateStr: string) {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

export default function TimeDisplay({
	dateIso,
	isModelRelease,
}: {
	dateIso: string;
	isModelRelease: boolean;
}) {
	const [_, update] = useReducer(() => ({}), {});
	useEffect(() => {
		const interval = setInterval(update, 60000); // update every minute
		return () => clearInterval(interval);
	}, []);

	if (isModelRelease) {
		const today = isDateToday(dateIso);
		if (today) {
			return (
				<span className="text-[10px] uppercase tracking-wide font-semibold text-amber-800 bg-amber-200 dark:text-amber-200 dark:bg-amber-800 rounded px-2 py-0.5 border border-amber-300 dark:border-amber-700">
					Today
				</span>
			);
		} else {
			return <time dateTime={dateIso}>{formatDate(dateIso)}</time>;
		}
	} else {
		return <span>{relTime(dateIso)}</span>;
	}
}
