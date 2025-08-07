import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { ExtendedModel } from "@/data/types";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Megaphone, Rocket, Ban, Archive, ArrowUpRight } from "lucide-react";

// Relative time helper
function getRelativeTime(dateStr: string | null | undefined) {
	if (!dateStr) return null;
	const now = new Date();
	const date = new Date(dateStr);
	const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diff < 60) return "just now";
	if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;

	// If it's today (same date)
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

interface RecentModelsProps {
	models: ExtendedModel[];
}

export default function ModelUpdates({ models }: RecentModelsProps) {
	// Group events by model and date to combine same-day events
	type EventType = "Announced" | "Released" | "Deprecated" | "Retired";
	interface ModelEvent {
		model: ExtendedModel;
		types: EventType[];
		date: string;
	}
	const events = models.flatMap((model) => {
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
				(e) => e.model.id === model.id && e.date === model.release_date
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
		// Add support for Retired status
		if ((model as any).retirement_date) {
			const r = (model as any).retirement_date;
			const existing = evts.find(
				(e) => e.model.id === model.id && e.date === r
			);
			if (existing) existing.types.push("Retired");
			else evts.push({ model, types: ["Retired"], date: r });
		}
		return evts;
	});
	const recentEvents = events
		.filter((e) => new Date(e.date).getTime() <= Date.now())
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, 5);

	// Helper to check if a given date is today (used for highlighting)
	const isDateToday = (dateStr: string) => {
		const now = new Date();
		const d = new Date(dateStr);
		return (
			now.getFullYear() === d.getFullYear() &&
			now.getMonth() === d.getMonth() &&
			now.getDate() === d.getDate()
		);
	};

	return (
		<Card className="border border-gray-200 dark:border-gray-700 border-b-2 border-b-gray-300 dark:border-b-gray-600">
			<CardHeader>
				<Link href="models/updates">
					<CardTitle className="text-2xl group relative cursor-pointer w-full text-center">
						<span className="inline-block relative">
							{/* Centered title text */}
							<span className="mx-auto block">
								Latest Model Updates
							</span>

							{/* Floating arrow, not affecting layout */}
							<span className="absolute -right-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
								<ArrowUpRight size={20} />
							</span>
						</span>
					</CardTitle>
				</Link>
				<CardDescription className="text-sm text-gray-500 dark:text-gray-400">
					We track every model announcement, release, deprecation, and
					retirement to keep you updated on the AI landscape.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
					{recentEvents.map((event: ModelEvent) => {
						const { model } = event;
						const today = isDateToday(event.date);
						return (
							<Card
								key={model.name}
								className={`w-full p-0 flex flex-col transition-colors ${
									today
										? "border-amber-300 dark:border-amber-500 bg-amber-50/60 dark:bg-amber-900/20"
										: ""
								}`}
							>
								{/* Top row: badge and relative time */}
								<div className="flex justify-between items-center w-full px-4 pt-4">
									{/* Event badge */}
									{event.types.includes("Deprecated") ? (
										<Badge className="bg-red-100 text-red-800 border border-red-300 px-2 py-1 text-xs flex items-center gap-1 transition-colors hover:bg-red-200 hover:text-red-900 hover:border-red-400 dark:bg-red-950 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900 dark:hover:text-red-200 dark:hover:border-red-700">
											<Ban size={14} className="mr-1" />
											Deprecation
										</Badge>
									) : event.types.includes("Released") ? (
										<Badge className="bg-green-100 text-green-800 border border-green-300 px-2 py-1 text-xs flex items-center gap-1 transition-colors hover:bg-green-200 hover:text-green-900 hover:border-green-400 dark:bg-green-950 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900 dark:hover:text-green-200 dark:hover:border-green-700">
											<Rocket
												size={14}
												className="mr-1"
											/>
											Release
										</Badge>
									) : event.types.includes("Retired") ? (
										<Badge className="bg-zinc-300 text-zinc-800 border border-zinc-400 px-2 py-1 text-xs flex items-center gap-1 transition-colors hover:bg-zinc-400 hover:text-zinc-900 hover:border-zinc-500 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:hover:border-zinc-600">
											<Archive
												size={14}
												className="mr-1"
											/>
											Retirement
										</Badge>
									) : (
										<Badge className="bg-blue-100 text-blue-800 border border-blue-300 px-2 py-1 text-xs flex items-center gap-1 transition-colors hover:bg-blue-200 hover:text-blue-900 hover:border-blue-400 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200 dark:hover:border-blue-700">
											<Megaphone
												size={14}
												className="mr-1"
											/>
											Announcement
										</Badge>
									)}
									{/* Relative time, with special Today highlight */}
									{today ? (
										<span className="text-[10px] uppercase tracking-wide font-semibold text-amber-800 bg-amber-200 dark:text-amber-200 dark:bg-amber-800 rounded px-2 py-0.5 border border-amber-300 dark:border-amber-700">
											Today
										</span>
									) : (
										<span className="text-xs text-zinc-500">
											{getRelativeTime(event.date)}
										</span>
									)}
								</div>
								{/* Content row: icon, name, provider */}
								<div className="flex items-center w-full px-4 pb-4 pt-2 overflow-hidden">
									<Link
										href={`providers/${encodeURIComponent(
											model.provider.provider_id
										)}`}
										className="rounded-full mr-2 shrink-0"
									>
										<Image
											src={`/providers/${model.provider.provider_id.toLowerCase()}.svg`}
											alt={model.provider.name}
											className="rounded-full border bg-white object-contain"
											width={28}
											height={28}
										/>
									</Link>

									<div className="flex flex-col min-w-0 text-left">
										<Link
											href={`models/${encodeURIComponent(
												model.id
											)}`}
											className={`truncate text-base font-semibold leading-tight relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full ${
												today
													? "text-amber-900 dark:text-amber-200"
													: ""
											}`}
										>
											{model.name}
										</Link>
										<Link
											href={`providers/${encodeURIComponent(
												model.provider.provider_id
											)}`}
											className="truncate text-xs text-zinc-500"
										>
											<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
												{model.provider.name}
											</span>
										</Link>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
