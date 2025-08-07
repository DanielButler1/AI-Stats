"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	TooltipProvider,
} from "@/components/ui/tooltip";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExtendedModel } from "@/data/types";
import Image from "next/image";

export function ModelCard({ model }: { model: ExtendedModel }) {
	return (
		<Card
			style={{ borderColor: model.provider.colour || undefined }}
			className={cn(
				"h-full flex flex-col shadow-lg relative dark:shadow-zinc-900/25 dark:bg-zinc-950 transition-transform transform hover:scale-105 duration-200 ease-in-out",
				model.provider.colour && "border-2"
			)}
		>
			<CardContent className="flex flex-row items-center gap-3 pt-6">
				<Link
					href={`providers/${model.provider.provider_id}`}
					className="group"
				>
					<div className="w-10 h-10 relative flex items-center justify-center rounded-full border bg-white">
						<div className="w-7 h-7 relative">
							<Image
								src={`/providers/${model.provider.provider_id}.svg`}
								alt={model.provider.name}
								className="group-hover:opacity-80 transition object-contain"
								fill
							/>
						</div>
					</div>
				</Link>
				<div className="flex flex-col min-w-0 flex-1">
					<TooltipProvider>
						<Tooltip delayDuration={250}>
							<TooltipTrigger asChild>
								<Link
									href={`models/${model.id}`}
									className="font-semibold truncate text-lg leading-tight"
								>
									<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
										{model.name}
									</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent align="start">
								{model.id}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<Link
						href={`providers/${model.provider.provider_id}`}
						className="text-xs text-muted-foreground truncate flex items-center gap-1"
					>
						<span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
							{model.provider.name}
						</span>
					</Link>
				</div>
				<div className="ml-auto flex items-center gap-1">
					<Button
						asChild
						size="icon"
						variant="ghost"
						tabIndex={-1}
						className="group"
						style={
							{
								"--provider-color":
									model.provider.colour ?? "inherit",
							} as React.CSSProperties
						}
					>
						<Link
							href={`models/${model.id}`}
							aria-label={`Go to ${model.name} details`}
							tabIndex={-1}
						>
							<ArrowRight className="w-5 h-5 transition-colors group-hover:text-(--provider-color)" />
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
