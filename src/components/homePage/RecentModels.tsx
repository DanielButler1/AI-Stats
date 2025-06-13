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
	// Include models that were announced (with or without release date)
	const filteredModels = models.filter((model) => model.announced_date);

	// Sort by the most recent of announced or release date (if present)
	const recentModels = filteredModels
		.sort((a, b) => {
			const aMostRecent = Math.max(
				a.announced_date ? new Date(a.announced_date).getTime() : 0,
				a.release_date ? new Date(a.release_date).getTime() : 0
			);
			const bMostRecent = Math.max(
				b.announced_date ? new Date(b.announced_date).getTime() : 0,
				b.release_date ? new Date(b.release_date).getTime() : 0
			);
			return bMostRecent - aMostRecent;
		})
		.slice(0, 5);

	return (
		<Card className="shadow-lg">
			<CardHeader>
				<CardTitle className="text-2xl">New Models</CardTitle>
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
								</TableHead>
								<TableHead className="min-w-[120px]">
									Announced Date
								</TableHead>
								<TableHead className="min-w-[120px]">
									Release Date
								</TableHead>
								<TableHead className="min-w-[120px] text-right">
									&nbsp;
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{recentModels.map((model) => {
								const isSameDay =
									model.announced_date &&
									model.release_date &&
									model.announced_date === model.release_date;
								const mainDate =
									model.release_date || model.announced_date;
								return (
									<TableRow
										key={model.name}
										className="items-center"
									>
										<TableCell className="min-w-[110px] align-middle">
											<span className="flex flex-col gap-1 sm:flex-row sm:gap-x-1 items-center">
												{isSameDay ? (
													<>
														<Badge className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700 dark:hover:bg-blue-800 transition-colors">
															Announced
														</Badge>
														<Badge className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700 dark:hover:bg-green-800 transition-colors">
															Released
														</Badge>
													</>
												) : (
													<>
														{model.announced_date && (
															<Badge className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700 dark:hover:bg-blue-800 transition-colors">
																Announced
															</Badge>
														)}
														{model.release_date && (
															<Badge className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700 dark:hover:bg-green-800 transition-colors">
																Released
															</Badge>
														)}
													</>
												)}
											</span>
										</TableCell>
										<TableCell className="min-w-[130px] font-medium align-middle">
											<Link
												href={`/models/${encodeURIComponent(
													model.id
												)}`}
												className="hover:underline hover:decoration-2 hover:underline-offset-2 transition-colors  flex items-center"
											>
												{model.name}
											</Link>
										</TableCell>
										<TableCell className="min-w-[130px] align-middle">
											<Link
												href={`/providers/${encodeURIComponent(
													model.provider.provider_id
												)}`}
												className="flex items-center gap-2 hover:underline hover:decoration-2 hover:underline-offset-2 transition-colors"
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
													{model.provider.name}
												</span>
											</Link>
										</TableCell>
										<TableCell className="min-w-[120px] align-middle">
											<span className="flex items-center">
												{formatDate(
													model.announced_date
												)}
											</span>
										</TableCell>
										<TableCell className="min-w-[120px] align-middle">
											<span className="flex items-center">
												{formatDate(model.release_date)}
											</span>
										</TableCell>
										<TableCell className="min-w-[120px] text-right align-middle">
											<div className="flex justify-center w-full">
												{mainDate && (
													<Badge
														className={`flex justify-center rounded-full px-3 py-1 text-xs border ${(() => {
															const idx =
																recentModels.findIndex(
																	(m) =>
																		m.id ===
																		model.id
																);
															if (
																idx === 0 ||
																idx === 1 ||
																idx === 2
															)
																return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700 dark:hover:bg-green-800";
															if (idx === 3)
																return "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700 dark:hover:bg-yellow-800";
															return "bg-zinc-200 text-zinc-700 border-zinc-300 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-700";
														})()}`}
													>
														{getRelativeTime(
															mainDate
														)}
													</Badge>
												)}
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
					{recentModels.map((model) => {
						const mainDate =
							model.release_date || model.announced_date;
						return (
							<Card
								key={model.name}
								className="w-full p-0 relative min-h-[72px] flex items-center"
							>
								<div className="flex items-center w-full px-4 py-4">
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
									<div className="flex flex-col flex-1 items-start justify-center min-h-[40px]">
										<span className="text-base font-semibold leading-tight">
											<Link
												href={`/models/${encodeURIComponent(
													model.id
												)}`}
												className="hover:underline hover:decoration-2 hover:underline-offset-2 transition-colors hover:text-blue-700"
											>
												{model.name}
											</Link>
										</span>
										<span className="text-xs text-zinc-500">
											<Link
												href={`/providers/${encodeURIComponent(
													model.provider.provider_id
												)}`}
												className="hover:underline hover:decoration-2 hover:underline-offset-2 transition-colors hover:text-blue-700"
											>
												{model.provider.name}
											</Link>
										</span>
									</div>
									{mainDate && (
										<span className="absolute bottom-2 right-4 text-xs text-zinc-400">
											{getRelativeTime(mainDate)}
										</span>
									)}
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
