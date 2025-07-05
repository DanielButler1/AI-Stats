import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { ExtendedModel } from "@/data/types";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Megaphone, Rocket, Ban, Archive } from "lucide-react";

// Date formatting helper
function formatDate(dateStr: string | null | undefined) {
	if (!dateStr) return "-";
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

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

export default function RecentModels({ models }: RecentModelsProps) {
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

	return (
		<Card className="shadow-lg">
			<CardHeader>
				<CardTitle className="text-2xl">Model Updates</CardTitle>
			</CardHeader>
			<CardContent>
				{/* Desktop Table */}
				<div className="overflow-x-auto hidden sm:block">
					<Table className="min-w-[700px]">
						<TableHeader>
							<TableRow>
								<TableHead className="min-w-[110px]">
									Event
								</TableHead>
								<TableHead className="min-w-[130px]">
									Model
								</TableHead>
								<TableHead className="min-w-[130px]">
									Provider
								</TableHead>{" "}
								<TableHead className="min-w-[120px]">
									Date
								</TableHead>
								<TableHead className="min-w-[100px] text-center">
									AI Stats Score
								</TableHead>
								<TableHead className="min-w-[120px] text-right">
									&nbsp;
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{recentEvents.map((event, idx) => {
								const { model } = event;
								// Use event date directly
								return (
									<TableRow
										key={
											model.id +
											"-" +
											event.types.join("+") +
											"-" +
											event.date
										}
										className="items-center"
									>
										<TableCell className="min-w-[110px] align-middle">
											<span className="flex flex-col gap-1 sm:flex-row sm:gap-x-1 items-center">
												{event.types.includes(
													"Announced"
												) && (
													<Badge className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center gap-1">
														<Megaphone
															size={14}
															className="mr-1"
														/>
														Announced
													</Badge>
												)}
												{event.types.includes(
													"Released"
												) && (
													<Badge className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700 dark:hover:bg-green-800 transition-colors flex items-center gap-1">
														<Rocket
															size={14}
															className="mr-1"
														/>
														Released
													</Badge>
												)}
												{event.types.includes(
													"Deprecated"
												) && (
													<Badge className="bg-red-100 text-red-800 border border-red-300 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700 dark:hover:bg-red-800 transition-colors flex items-center gap-1">
														<Ban
															size={14}
															className="mr-1"
														/>
														Deprecated
													</Badge>
												)}
												{/* Add Retired badge */}
												{event.types.includes(
													"Retired"
												) && (
													<Badge className="bg-zinc-300 text-zinc-800 border border-zinc-400 hover:bg-zinc-400 dark:bg-zinc-700 dark:text-zinc-100 dark:border-zinc-500 dark:hover:bg-zinc-600 transition-colors flex items-center gap-1">
														<Archive
															size={14}
															className="mr-1"
														/>
														Retired
													</Badge>
												)}
											</span>
										</TableCell>
										<TableCell className="min-w-[130px] font-medium align-middle">
											{" "}
											<Link
												href={`/models/${encodeURIComponent(
													model.id
												)}`}
												className="flex items-center"
											>
												<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
													{model.name}
												</span>
											</Link>
										</TableCell>
										<TableCell className="min-w-[130px] align-middle">
											<Link
												href={`/providers/${encodeURIComponent(
													model.provider.provider_id
												)}`}
												className="flex items-center gap-2"
											>
												<div className="w-5 h-5 relative flex items-center justify-center rounded-full border bg-white">
													<div className="w-4 h-4 relative">
														<Image
															src={`/providers/${model.provider.provider_id.toLowerCase()}.svg`}
															alt={
																model.provider
																	.name
															}
															className="object-contain"
															fill
														/>
													</div>
												</div>{" "}
												<span className="flex items-center">
													<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
														{model.provider.name}
													</span>
												</span>
											</Link>
										</TableCell>
										<TableCell className="min-w-[120px] align-middle">
											<span className="flex items-center">
												{formatDate(event.date)}
											</span>
										</TableCell>{" "}
										<TableCell className="min-w-[100px] align-middle flex justify-center font-mono text-sm">
											{model.benchmark_results?.length &&
											model.benchmark_results.length >=
												3 ? (
												<span className="flex items-center gap-1">
													{model.glickoRating ? (
														<>
															{model.glickoRating.rating.toFixed(
																2
															)}
															{/* <span className="text-muted-foreground">
																±
																{model.glickoRating.rd.toFixed(
																	2
																)}
															</span> */}
														</>
													) : (
														"Processing..."
													)}
												</span>
											) : (
												<span className="text-muted-foreground">
													Awaiting...
												</span>
											)}
										</TableCell>
										<TableCell className="min-w-[120px] text-right align-middle">
											<div className="flex justify-center w-full">
												<Badge
													className={`flex justify-center rounded-full px-3 py-1 text-xs border ${
														idx <= 2
															? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700 dark:hover:bg-green-800"
															: idx === 3
															? "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700 dark:hover:bg-yellow-800"
															: "bg-zinc-200 text-zinc-700 border-zinc-300 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-700"
													}`}
												>
													{getRelativeTime(
														event.date
													)}
												</Badge>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>

				{/* Mobile Cards */}
				<div className="flex flex-col gap-4 sm:hidden">
					{recentEvents.map((event) => {
						const { model } = event;
						return (
							<Card
								key={model.name}
								className="w-full p-0 flex flex-col"
							>
								{/* Top row: badge and relative time */}
								<div className="flex justify-between items-center w-full px-4 pt-4">
									{/* Event badge */}
									{event.types.includes("Deprecated") ? (
										<Badge className="bg-red-100 text-red-800 border border-red-300 px-2 py-1 text-xs flex items-center gap-1">
											<Ban size={14} className="mr-1" />
											Deprecated
										</Badge>
									) : event.types.includes("Released") ? (
										<Badge className="bg-green-100 text-green-800 border border-green-300 px-2 py-1 text-xs flex items-center gap-1">
											<Rocket
												size={14}
												className="mr-1"
											/>
											Released
										</Badge>
									) : event.types.includes("Retired") ? (
										<Badge className="bg-zinc-300 text-zinc-800 border border-zinc-400 px-2 py-1 text-xs flex items-center gap-1">
											<Archive
												size={14}
												className="mr-1"
											/>
											Retired
										</Badge>
									) : (
										<Badge className="bg-blue-100 text-blue-800 border border-blue-300 px-2 py-1 text-xs flex items-center gap-1">
											<Megaphone
												size={14}
												className="mr-1"
											/>
											Announced
										</Badge>
									)}
									{/* Relative time, muted like provider */}
									<span className="text-xs text-zinc-500">
										{getRelativeTime(event.date)}
									</span>
								</div>
								{/* Content row: icon, name, provider with AI Stats Score */}
								<div className="flex items-center w-full px-4 pb-4 pt-2">
									{/* Icon and title */}
									<div className="flex items-center flex-1">
										<div className="flex-shrink-0 w-10 h-10 relative flex items-center justify-center rounded-full border bg-white mr-4">
											<div className="w-8 h-8 relative">
												<Image
													src={`/providers/${model.provider.provider_id.toLowerCase()}.svg`}
													alt={model.provider.name}
													className="object-contain"
													fill
												/>
											</div>
										</div>
										<div className="flex flex-col items-start justify-center">
											<span className="text-base font-semibold leading-tight">
												<Link
													href={`/models/${encodeURIComponent(
														model.id
													)}`}
													className="hover:text-blue-700"
												>
													<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-700 after:transition-all after:duration-300 hover:after:w-full">
														{model.name}
													</span>
												</Link>
											</span>
											<span className="text-xs text-zinc-500">
												<Link
													href={`/providers/${encodeURIComponent(
														model.provider
															.provider_id
													)}`}
													className="hover:text-blue-700"
												>
													<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-blue-700 after:transition-all after:duration-300 hover:after:w-full">
														{model.provider.name}
													</span>
												</Link>
												{/* AI Stats Score inline */}
												{" | AI Stats Score: "}
												{model.benchmark_results
													?.length &&
												model.benchmark_results
													.length >= 3 ? (
													model.glickoRating ? (
														<span className="font-mono text-xs text-zinc-500">
															{model.glickoRating.rating.toFixed(
																2
															)}
														</span>
													) : (
														<span className="font-mono text-xs text-zinc-500">
															Processing...
														</span>
													)
												) : (
													<span className="text-zinc-500 text-xs">
														Awaiting...
													</span>
												)}
											</span>
										</div>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			</CardContent>
			<CardFooter>
				<Button variant="outline" className="w-full" asChild>
					<Link href="/models">View All Models</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
