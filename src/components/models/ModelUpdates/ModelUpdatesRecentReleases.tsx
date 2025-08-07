import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import {
	TooltipProvider,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModelUpdatesRecentReleasesProps {
	filteredEvents: any[];
	eventTypeOptions: any[];
	formatDate: (dateStr: string) => string;
	getRelativeTime: (dateStr: string) => string | null;
}

export default function ModelUpdatesRecentReleases({
	filteredEvents,
	eventTypeOptions,
	formatDate,
	getRelativeTime,
}: ModelUpdatesRecentReleasesProps) {
	return (
		<div className="mb-6">
			<h1 className="font-bold text-xl mb-2 text-black">
				Recent Model Releases
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredEvents.map((event) => {
					const { model } = event;
					return (
						<Card
							key={
								model.id +
								"-" +
								event.types.join("+") +
								"-" +
								event.date
							}
							className="w-full flex flex-col border border-gray-200 dark:border-gray-700 border-b-2 border-b-gray-300 dark:border-b-gray-600"
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
											<span className="text-xs text-zinc-500 cursor-help">
												{getRelativeTime(event.date)}
											</span>
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
										<span className="text-base font-semibold leading-tight">
											<Link
												href={`/models/${encodeURIComponent(
													model.id
												)}`}
											>
												<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
													{model.name}
												</span>
											</Link>
										</span>
										<span className="text-xs text-zinc-500">
											<Link
												href={`/providers/${encodeURIComponent(
													model.provider.provider_id
												)}`}
											>
												<span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
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
		</div>
	);
}
