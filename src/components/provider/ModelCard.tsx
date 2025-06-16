"use client";

import { useState } from "react";
import {
	Card,
	CardHeader,
	CardContent,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import {
	Book,
	Play,
	FileText,
	Megaphone,
	Github,
	Download,
	ExternalLink,
	ChevronDown,
	ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExtendedModel } from "@/data/types";
import Image from "next/image";

const linkIcons = {
	api_reference_link: Book,
	playground_link: Play,
	paper_link: FileText,
	announcement_link: Megaphone,
	repository_link: Github,
	weights_link: Download,
};

export function ModelCard({ model }: { model: ExtendedModel }) {
	const [expanded, setExpanded] = useState(false);

	return (
		<Card
			style={{
				borderColor: model.provider.colour || undefined,
			}}
			className={cn(
				"h-full flex flex-col shadow-lg relative dark:shadow-zinc-900/25 dark:bg-zinc-950 transition-transform transform hover:scale-[1.01] duration-200 ease-in-out",
				model.provider.colour && "border-2"
			)}
		>
			<CardHeader className="pb-0 flex flex-row items-center gap-3">
				<Link
					href={`/providers/${model.provider.provider_id}`}
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
					<Link
						href={`/models/${model.id}`}
						className="hover:bold font-semibold truncate text-lg leading-tight"
					>
						{model.name}
					</Link>
					<Link
						href={`/providers/${model.provider.provider_id}`}
						className="hover:bold text-xs text-muted-foreground truncate flex items-center gap-1"
					>
						{model.provider.name}
					</Link>
				</div>
				<div className="ml-auto flex gap-1">
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
							href={`/models/${model.id}`}
							aria-label={`Go to ${model.name} details`}
							tabIndex={-1}
						>
							<ArrowRight className="w-5 h-5 transition-colors group-hover:text-[color:var(--provider-color)]" />
						</Link>
					</Button>
				</div>
			</CardHeader>
			<CardHeader className="pb-2 pt-4">
				<div className="mt-2 grid grid-cols-2 gap-2">
					<div className="flex flex-col items-start">
						<Badge className="bg-blue-100 text-blue-800 border border-blue-300 mb-1 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700 hover:bg-blue-200 hover:text-blue-900 hover:border-blue-400 dark:hover:bg-blue-800 dark:hover:text-blue-200 dark:hover:border-blue-500 transition-colors">
							Announced
						</Badge>
						<span className="text-xs text-muted-foreground font-medium">
							{model.announced_date
								? new Date(
										model.announced_date
								  ).toLocaleDateString("en-GB", {
										day: "2-digit",
										month: "short",
										year: "numeric",
								  })
								: "-"}
						</span>
					</div>
					<div className="flex flex-col items-start">
						<Badge className="bg-green-100 text-green-800 border border-green-300 mb-1 dark:bg-green-900 dark:text-green-100 dark:border-green-700 hover:bg-green-200 hover:text-green-900 hover:border-green-400 dark:hover:bg-green-800 dark:hover:text-green-200 dark:hover:border-green-500 transition-colors">
							Released
						</Badge>
						<span className="text-xs text-muted-foreground font-medium">
							{model.release_date
								? new Date(
										model.release_date
								  ).toLocaleDateString("en-GB", {
										day: "2-digit",
										month: "short",
										year: "numeric",
								  })
								: "-"}
						</span>
					</div>{" "}
				</div>{" "}
				<div className="mt-4 space-x-2">
					{model.status && (
						<Badge
							variant="secondary"
							className={cn(
								model.status === "Available" &&
									"bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-800",
								model.status === "Deprecated" &&
									"bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-800",
								model.status === "Rumoured" &&
									"bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-800",
								model.status === "Announced" &&
									"bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-800",
								"border"
							)}
						>
							{model.status}
						</Badge>
					)}
					<Badge variant="secondary">
						{model.multimodal ? "Multimodal" : "Text"}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col justify-start">
				{model.description && (
					<CardDescription className="mt-2 relative group">
						<span
							className={cn(
								"block transition-all",
								expanded ? undefined : "line-clamp-3"
							)}
						>
							{model.description}
						</span>
						{model.description.length > 120 && (
							<button
								type="button"
								onClick={() => setExpanded((v) => !v)}
								className="absolute right-0 flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-70 transition-opacity duration-500 bg-white/80 px-1 py-0.5 rounded shadow"
								style={{ bottom: 0 }}
							>
								<ChevronDown
									className={cn(
										"w-4 h-4 text-blue-600 transition-transform duration-500",
										expanded && "rotate-180"
									)}
								/>
							</button>
						)}
					</CardDescription>
				)}
				<div className="flex gap-2 mt-4 flex-wrap">
					{[
						{
							key: "announcement_link",
							label: "Announcement",
							url: model.announcement_link,
						},
						{
							key: "paper_link",
							label: "Paper",
							url: model.paper_link,
						},
						{
							key: "api_reference_link",
							label: "API Reference",
							url: model.api_reference_link,
						},
						{
							key: "playground_link",
							label: "Playground",
							url: model.playground_link,
						},
						{
							key: "weights_link",
							label: "Weights",
							url: model.weights_link,
						},
						{
							key: "repository_link",
							label: "Repository",
							url: model.repository_link,
						},
					].map((link) => {
						const Icon =
							linkIcons[link.key as keyof typeof linkIcons] ||
							ExternalLink;
						return link.url ? (
							<Tooltip key={link.key} delayDuration={0}>
								<TooltipTrigger asChild>
									<Button
										asChild
										size="sm"
										variant="outline"
										className="group"
										style={
											{
												"--provider-color":
													model.provider.colour ??
													"inherit",
											} as React.CSSProperties
										}
									>
										<Link
											href={link.url}
											target="_blank"
											rel="noopener noreferrer"
											aria-label={link.label}
										>
											<Icon className="w-5 h-5 transition-colors group-hover:text-[color:var(--provider-color)]" />
										</Link>
									</Button>
								</TooltipTrigger>
								<TooltipContent className="dark:bg-zinc-950 dark:text-white">
									{link.label}
								</TooltipContent>
							</Tooltip>
						) : null;
					})}
				</div>
			</CardContent>
		</Card>
	);
}
