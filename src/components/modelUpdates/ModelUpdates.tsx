"use client";

import * as React from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Megaphone, Rocket, Ban, Archive } from "lucide-react";
import type { ExtendedModel } from "@/data/types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
	const [selectedProviders, setSelectedProviders] = React.useState<string[]>(
		[]
	);
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const isMobile = useIsMobile();

	const allProviders = React.useMemo(() => {
		const seen = new Set<string>();
		const arr: { id: string; name: string }[] = [];
		models.forEach((m) => {
			if (!seen.has(m.provider.provider_id)) {
				arr.push({ id: m.provider.provider_id, name: m.provider.name });
				seen.add(m.provider.provider_id);
			}
		});
		return arr;
	}, [models]);

	const half = Math.ceil(allProviders.length / 2);
	const columns = half;
	const providerRows = [
		allProviders.slice(0, half),
		allProviders.slice(half),
	];

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

	const filteredEvents = React.useMemo(() => {
		if (selectedProviders.length === 0) return events;
		return events.filter((e) =>
			selectedProviders.includes(e.model.provider.provider_id)
		);
	}, [events, selectedProviders]);

	const allEvents = filteredEvents
		.filter((e) => new Date(e.date).getTime() <= Date.now())
		.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);

	return (
		<Card className="shadow-lg">
			<CardHeader>
				<CardTitle className="text-2xl">All Model Updates</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="mb-4">
					{isMobile ? (
						<Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
							<SheetTrigger asChild>
								<Button
									variant="outline"
									className="w-full flex items-center justify-between"
								>
									<span>Filter Providers</span>
									<span className="flex items-center gap-1 ml-2">
										{selectedProviders.length === 0
											? [
													"openai",
													"google",
													"anthropic",
													"x-ai",
											  ].map((id) => (
													<span
														key={id}
														className="w-6 h-6 rounded-full bg-white border flex items-center justify-center"
													>
														<Image
															src={`/providers/${id}.svg`}
															alt={id}
															width={20}
															height={20}
															className="object-contain rounded-full"
														/>
													</span>
											  ))
											: [
													...selectedProviders
														.slice(0, 4)
														.map((id) => (
															<span
																key={id}
																className="w-6 h-6 rounded-full bg-white border flex items-center justify-center"
															>
																<Image
																	src={`/providers/${id}.svg`}
																	alt={id}
																	width={20}
																	height={20}
																	className="object-contain rounded-full"
																/>
															</span>
														)),
													selectedProviders.length >
														4 && (
														<span
															key="more"
															className="ml-1 text-xs font-medium text-zinc-500"
														>
															+
															{selectedProviders.length -
																4}
														</span>
													),
											  ]}
									</span>
								</Button>
							</SheetTrigger>
							<SheetContent
								side="bottom"
								className="max-h-[90vh] overflow-y-auto p-4 space-y-6"
							>
								<div className="font-semibold text-sm mb-2">
									Select Providers
								</div>
								<ToggleGroup
									type="multiple"
									value={selectedProviders}
									onValueChange={setSelectedProviders}
									className="grid grid-cols-2 gap-2"
								>
									{allProviders.map((provider) => (
										<ToggleGroupItem
											key={provider.id}
											value={provider.id}
											variant="outline"
											className="w-full rounded-full transition-all duration-200 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800 dark:data-[state=on]:bg-blue-900 dark:data-[state=on]:text-blue-100 hover:bg-blue-50 flex items-center gap-2 px-3 py-2 justify-center"
										>
											<Image
												src={`/providers/${provider.id}.svg`}
												alt={provider.name}
												width={18}
												height={18}
												className="rounded-sm"
											/>
											{provider.name}
										</ToggleGroupItem>
									))}
								</ToggleGroup>
							</SheetContent>
						</Sheet>
					) : (
						<ToggleGroup
							type="multiple"
							value={selectedProviders}
							onValueChange={setSelectedProviders}
							className="flex flex-col gap-2"
						>
							<div className="flex w-full gap-2">
								{providerRows[0].map((provider) => (
									<ToggleGroupItem
										key={provider.id}
										value={provider.id}
										variant="outline"
										className="flex-1 rounded-full transition-all duration-200 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800 dark:data-[state=on]:bg-blue-900 dark:data-[state=on]:text-blue-100 hover:bg-blue-50 flex items-center gap-2 px-3 py-1 justify-center"
									>
										<Image
											src={`/providers/${provider.id}.svg`}
											alt={provider.name}
											width={18}
											height={18}
											className="rounded-sm"
										/>
										{provider.name}
									</ToggleGroupItem>
								))}
							</div>
							<div className="flex w-full gap-2">
								{providerRows[1].map((provider) => (
									<ToggleGroupItem
										key={provider.id}
										value={provider.id}
										variant="outline"
										className="flex-1 rounded-full transition-all duration-200 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800 dark:data-[state=on]:bg-blue-900 dark:data-[state=on]:text-blue-100 hover:bg-blue-50 flex items-center gap-2 px-3 py-1 justify-center"
									>
										<Image
											src={`/providers/${provider.id}.svg`}
											alt={provider.name}
											width={18}
											height={18}
											className="rounded-sm"
										/>
										{provider.name}
									</ToggleGroupItem>
								))}
							</div>
						</ToggleGroup>
					)}
				</div>
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
								</TableHead>
								<TableHead className="min-w-[120px]">
									Date
								</TableHead>
								<TableHead className="min-w-[120px] text-right">
									&nbsp;
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{allEvents.map((event) => {
								const { model } = event;
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
													<Badge className="bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700 flex items-center gap-1 transition-colors hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-200">
														<Megaphone
															size={14}
															className="mr-1"
														/>{" "}
														Announced
													</Badge>
												)}
												{event.types.includes(
													"Released"
												) && (
													<Badge className="bg-green-100 text-green-800 border border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700 flex items-center gap-1 transition-colors hover:bg-green-200 hover:text-green-900 dark:hover:bg-green-800 dark:hover:text-green-200">
														<Rocket
															size={14}
															className="mr-1"
														/>{" "}
														Released
													</Badge>
												)}
												{event.types.includes(
													"Deprecated"
												) && (
													<Badge className="bg-red-100 text-red-800 border border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700 flex items-center gap-1 transition-colors hover:bg-red-200 hover:text-red-900 dark:hover:bg-red-800 dark:hover:text-red-200">
														<Ban
															size={14}
															className="mr-1"
														/>{" "}
														Deprecated
													</Badge>
												)}
												{event.types.includes(
													"Retired"
												) && (
													<Badge className="bg-zinc-300 text-zinc-800 border border-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 flex items-center gap-1 transition-colors hover:bg-zinc-400 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100">
														<Archive
															size={14}
															className="mr-1"
														/>{" "}
														Retired
													</Badge>
												)}
											</span>
										</TableCell>
										<TableCell className="min-w-[130px] font-medium align-middle">
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
												</div>
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
										</TableCell>
										<TableCell className="min-w-[120px] text-right align-middle">
											<Badge className="flex justify-center rounded-full px-3 py-1 text-xs border bg-zinc-200 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 transition-colors hover:bg-zinc-300 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100">
												{getRelativeTime(event.date)}
											</Badge>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
				<div className="flex flex-col gap-4 sm:hidden">
					{allEvents.map((event) => {
						const { model } = event;
						return (
							<Card
								key={model.name + event.date}
								className="w-full p-0 flex flex-col"
							>
								<div className="flex justify-between items-center w-full px-4 pt-4">
									{event.types.includes("Deprecated") ? (
										<Badge className="bg-red-100 text-red-800 border border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700 px-2 py-1 text-xs flex items-center gap-1 transition-colors hover:bg-red-200 hover:text-red-900 dark:hover:bg-red-800 dark:hover:text-red-200">
											<Ban size={14} className="mr-1" />{" "}
											Deprecated
										</Badge>
									) : event.types.includes("Released") ? (
										<Badge className="bg-green-100 text-green-800 border border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700 px-2 py-1 text-xs flex items-center gap-1 transition-colors hover:bg-green-200 hover:text-green-900 dark:hover:bg-green-800 dark:hover:text-green-200">
											<Rocket
												size={14}
												className="mr-1"
											/>{" "}
											Released
										</Badge>
									) : event.types.includes("Retired") ? (
										<Badge className="bg-zinc-300 text-zinc-800 border border-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 px-2 py-1 text-xs flex items-center gap-1 transition-colors hover:bg-zinc-400 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100">
											<Archive
												size={14}
												className="mr-1"
											/>{" "}
											Retired
										</Badge>
									) : (
										<Badge className="bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700 px-2 py-1 text-xs flex items-center gap-1 transition-colors hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-200">
											<Megaphone
												size={14}
												className="mr-1"
											/>{" "}
											Announced
										</Badge>
									)}
									<span className="text-xs">
										<Badge className="rounded-full px-2 py-1 text-xs border bg-zinc-200 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 transition-colors hover:bg-zinc-300 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100">
											{getRelativeTime(event.date)}
										</Badge>
									</span>
								</div>
								<div className="flex items-center w-full px-4 pb-4 pt-2">
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
											</span>
										</div>
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
