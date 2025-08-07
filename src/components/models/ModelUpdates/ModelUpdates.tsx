"use client";

import * as React from "react";
import type { ExtendedModel } from "@/data/types";
import ModelUpdatesFilters from "./ModelUpdatesFilters";
import ModelUpdatesOnThisDay from "./ModelUpdatesOnThisDay";
import ModelUpdatesRecentReleases from "./ModelUpdatesRecentReleases";
import { Megaphone, Rocket, Ban, Archive } from "lucide-react";

function formatDate(dateStr: string | null | undefined) {
	if (!dateStr) return "-";
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

function getRelativeTime(dateStr: string | null | undefined) {
	if (!dateStr) return null;
	const now = new Date();
	const date = new Date(dateStr);
	const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
	if (diff < 60) return "just now";
	if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
	const isToday =
		now.getFullYear() === date.getFullYear() &&
		now.getMonth() === date.getMonth() &&
		now.getDate() === date.getDate();
	if (isToday) return "Today";
	const days = Math.floor(diff / 86400);
	if (days === 1) return "1 day ago";
	if (days < 30) return `${days} days ago`;
	const months = Math.floor(diff / 2592000);
	if (months === 1) return "1 mo ago";
	if (months < 12) return `${months} mo ago`;
	const years = Math.floor(diff / 31536000);
	if (years === 1) return "1 yr ago";
	return `${years} yr ago`;
}

type EventType = "Announced" | "Released" | "Deprecated" | "Retired";
interface ModelEvent {
	model: ExtendedModel;
	types: EventType[];
	date: string;
}

interface ModelUpdatesPageProps {
	models: ExtendedModel[];
}

export default function ModelUpdatesPage({ models }: ModelUpdatesPageProps) {
	// Filter states
	const [selectedProviders, setSelectedProviders] = React.useState<string[]>(
		[]
	);
	const [selectedEvents, setSelectedEvents] = React.useState<EventType[]>([]);

	// Providers
	const allProviders = React.useMemo(() => {
		const seen = new Set<string>();
		const arr: { id: string; name: string }[] = [];
		models.forEach((m) => {
			if (!seen.has(m.provider.provider_id)) {
				arr.push({
					id: m.provider.provider_id,
					name: m.provider.name,
				});
				seen.add(m.provider.provider_id);
			}
		});
		return arr;
	}, [models]);

	// Events
	const events = React.useMemo(
		() =>
			models.flatMap((model) => {
				const evts: ModelEvent[] = [];
				if (model.announced_date) {
					evts.push({
						model,
						types: ["Announced"],
						date: model.announced_date,
					});
				}
				if (model.release_date) {
					const existing = evts.find(
						(e) =>
							e.model.id === model.id &&
							e.date === model.release_date
					);
					if (existing) existing.types.push("Released");
					else
						evts.push({
							model,
							types: ["Released"],
							date: model.release_date,
						});
				}
				if ((model as any).deprecation_date) {
					const d = (model as any).deprecation_date;
					const existing = evts.find(
						(e) => e.model.id === model.id && e.date === d
					);
					if (existing) existing.types.push("Deprecated");
					else evts.push({ model, types: ["Deprecated"], date: d });
				}
				if ((model as any).retirement_date) {
					const r = (model as any).retirement_date;
					const existing = evts.find(
						(e) => e.model.id === model.id && e.date === r
					);
					if (existing) existing.types.push("Retired");
					else evts.push({ model, types: ["Retired"], date: r });
				}
				return evts;
			}),
		[models]
	);

	// Highlight events for today (same day/month, any year)
	const today = React.useMemo(() => new Date(), []);
	const todayEvents = React.useMemo(() => {
		return events.filter((e) => {
			const d = new Date(e.date);
			return (
				d.getDate() === today.getDate() &&
				d.getMonth() === today.getMonth()
			);
		});
	}, [events, today]);

	// Filtering logic
	const filteredEvents = React.useMemo(() => {
		return events
			.filter((e) => {
				// Provider filter
				if (
					selectedProviders.length > 0 &&
					!selectedProviders.includes(e.model.provider.provider_id)
				)
					return false;
				// Event type filter
				if (
					selectedEvents.length > 0 &&
					!selectedEvents.some((type) => e.types.includes(type))
				)
					return false;
				// Only show events up to today
				if (new Date(e.date).getTime() > Date.now()) return false;
				return true;
			})
			.sort(
				(a, b) =>
					new Date(b.date).getTime() - new Date(a.date).getTime()
			);
	}, [events, selectedProviders, selectedEvents]);

	// Event type options
	const eventTypeOptions: {
		type: EventType;
		label: string;
		icon: React.ReactNode;
		badgeClass: string;
	}[] = [
		{
			type: "Announced",
			label: "Announcement",
			icon: <Megaphone size={14} className="mr-1" />,
			badgeClass:
				"bg-blue-100 text-blue-800 border border-blue-300 px-2 py-1 text-xs flex items-center gap-1 transition-colors hover:bg-blue-200 hover:text-blue-900 hover:border-blue-400 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200 dark:hover:border-blue-700",
		},
		{
			type: "Released",
			label: "Release",
			icon: <Rocket size={14} className="mr-1" />,
			badgeClass:
				"bg-green-100 text-green-800 border border-green-300 px-2 py-1 text-xs flex items-center gap-1 transition-colors hover:bg-green-200 hover:text-green-900 hover:border-green-400 dark:bg-green-950 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900 dark:hover:text-green-200 dark:hover:border-green-700",
		},
		{
			type: "Deprecated",
			label: "Deprecation",
			icon: <Ban size={14} className="mr-1" />,
			badgeClass:
				"bg-red-100 text-red-800 border border-red-300 px-2 py-1 text-xs flex items-center gap-1 transition-colors hover:bg-red-200 hover:text-red-900 hover:border-red-400 dark:bg-red-950 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900 dark:hover:text-red-200 dark:hover:border-red-700",
		},
		{
			type: "Retired",
			label: "Retirement",
			icon: <Archive size={14} className="mr-1" />,
			badgeClass:
				"bg-zinc-300 text-zinc-800 border border-zinc-400 px-2 py-1 text-xs flex items-center gap-1 transition-colors hover:bg-zinc-400 hover:text-zinc-900 hover:border-zinc-500 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:hover:border-zinc-600",
		},
	];

	// Layout
	return (
		<div className="w-full">
			<ModelUpdatesFilters
				allProviders={allProviders}
				eventTypeOptions={eventTypeOptions}
				selectedProviders={selectedProviders}
				setSelectedProviders={setSelectedProviders}
				selectedEvents={selectedEvents.map((e) => e as string)}
				setSelectedEvents={(vals) =>
					setSelectedEvents(vals.map((v) => v as EventType))
				}
			/>
			<ModelUpdatesOnThisDay
				todayEvents={todayEvents}
				eventTypeOptions={eventTypeOptions}
				today={today}
				formatDate={formatDate}
				getRelativeTime={getRelativeTime}
			/>
			<ModelUpdatesRecentReleases
				filteredEvents={filteredEvents}
				eventTypeOptions={eventTypeOptions}
				formatDate={formatDate}
				getRelativeTime={getRelativeTime}
			/>
		</div>
	);
}
