import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
	TooltipProvider,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModelUpdatesOnThisDayProps {
	todayEvents: any[];
	eventTypeOptions: any[];
	today: Date;
	formatDate: (dateStr: string) => string;
	getRelativeTime: (dateStr: string) => string | null;
}

export default function ModelUpdatesOnThisDay({
	todayEvents,
	eventTypeOptions,
	today,
	formatDate,
	getRelativeTime,
}: ModelUpdatesOnThisDayProps) {
	if (!todayEvents.length) return null;

	// Helper to check if a given date is today
	const isDateToday = (dateStr: string) => {
		const d = new Date(dateStr);
		return (
			today.getFullYear() === d.getFullYear() &&
			today.getMonth() === d.getMonth() &&
			today.getDate() === d.getDate()
		);
	};

	// Sort: today's events first, then prior events in descending order
	const sortedEvents = [...todayEvents].sort((a, b) => {
		const aToday = isDateToday(a.date);
		const bToday = isDateToday(b.date);
		if (aToday && !bToday) return -1;
		if (!aToday && bToday) return 1;
		// Descending by date
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	return (
		<div className="mb-6">
			<div className="font-bold text-xl mb-2">On This Day</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{sortedEvents.map((event) => {
					const { model } = event;
					const todayHighlight = isDateToday(event.date);
					return (
						<Card
							key={
								model.id +
								"-" +
								event.types.join("+") +
								"-" +
								event.date
							}
							className={`w-full flex flex-col border-2 ${
								todayHighlight
									? "border-amber-300 dark:border-amber-500 bg-amber-50/60 dark:bg-amber-900/20"
									: "border-blue-400"
							}`}
						>
							<div className="flex justify-between items-center w-full px-4 pt-4">
								<span className="flex gap-1">
									{event.types.map((type: string) => {
										const opt = eventTypeOptions.find(
											(o: any) => o.type === type
										);
										return opt ? (
											<Badge
												key={type}
												className={opt.badgeClass}
											>
												{opt.icon}
												{opt.label}
											</Badge>
										) : null;
									})}
								</span>
								<TooltipProvider>
									<Tooltip delayDuration={50}>
										<TooltipTrigger asChild>
											{todayHighlight ? (
												<span className="text-[10px] uppercase tracking-wide font-semibold text-amber-800 bg-amber-200 dark:text-amber-200 dark:bg-amber-800 rounded px-2 py-0.5 border border-amber-300 dark:border-amber-700 cursor-help">
													Today
												</span>
											) : (
												<span className="text-xs text-zinc-500 cursor-help">
													{getRelativeTime(
														event.date
													)}
												</span>
											)}
										</TooltipTrigger>
										<TooltipContent
											side="top"
											align="center"
										>
											{formatDate(event.date)}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
							<div className="flex items-center w-full px-4 pb-4 pt-2">
								<div className="flex items-center flex-1">
									<div className="shrink-0 w-10 h-10 relative flex items-center justify-center rounded-full border bg-white mr-4">
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
										<span
											className={`text-base font-semibold leading-tight${
												todayHighlight
													? " text-amber-900 dark:text-amber-200"
													: ""
											}`}
										>
											<Link
												href={`/models/${encodeURIComponent(
													model.id
												)}`}
												className={
													"truncate relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
												}
											>
												{model.name}
											</Link>
										</span>
										<span className="text-xs text-zinc-500">
											<Link
												href={`/providers/${encodeURIComponent(
													model.provider.provider_id
												)}`}
												className={
													"relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
												}
											>
												{model.provider.name}
											</Link>
										</span>
									</div>
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
