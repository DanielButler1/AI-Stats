import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, CheckCircle, FileWarning, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import type { ExtendedModel } from "@/data/types";

interface ModelCardProps {
	model: ExtendedModel;
	status: "critical" | "warning" | "complete";
	criticalErrors: string[];
	warnings: string[];
	suggestions: string[];
	hiddenCriticalCount: number;
	hiddenWarningCount: number;
	hiddenSuggestionCount: number;
	allCriticalErrors: string[];
	allWarnings: string[];
	allSuggestions: string[];
}

export function ModelCard({
	model,
	status,
	criticalErrors,
	warnings,
	suggestions,
	hiddenCriticalCount,
	hiddenWarningCount,
	hiddenSuggestionCount,
	allCriticalErrors,
	allWarnings,
	allSuggestions,
}: ModelCardProps) {
	const statusStyles =
		status === "complete"
			? "border-muted/60 hover:border-muted/80"
			: status === "critical"
			? "border-red-300/80 hover:border-red-400/90 shadow-[0_0_0_1px_rgba(248,113,113,0.2)]"
			: "border-yellow-300/80 hover:border-yellow-400/90 shadow-[0_0_0_1px_rgba(250,204,21,0.2)]";

	const isRumoured = model.status === "Rumoured";
	const dashedIfRumoured = isRumoured ? "border-dashed" : "";

	return (
		<Card
			className={`transition-colors duration-150 ${statusStyles} ${dashedIfRumoured} ${
				status === "complete" ? "opacity-70" : ""
			}`}
		>
			<CardHeader className="relative flex flex-row items-center gap-3 pb-2">
				<Link
					href={`/providers/${model.provider?.provider_id}`}
					className="group"
					tabIndex={-1}
					aria-label={`Go to ${
						model.provider?.name || model.provider?.provider_id
					} details`}
				>
					<div className="w-9 h-9 relative flex items-center justify-center rounded-full border bg-white">
						<Image
							src={`/providers/${model.provider?.provider_id}.svg`}
							alt={model.provider?.name || "Provider"}
							className="transition group-hover:opacity-80 object-contain p-1.5"
							fill
							style={{ objectFit: "contain" }}
						/>
					</div>
				</Link>
				<div className="flex-1 min-w-0">
					<Tooltip delayDuration={0}>
						<TooltipTrigger asChild>
							<Link
								href={`/models/${model.id}`}
								className="hover:underline font-semibold truncate text-base leading-tight block"
								aria-label={`Go to ${model.name} details`}
							>
								{model.name}
							</Link>
						</TooltipTrigger>
						<TooltipContent
							align="start"
							className="flex justify-start items-start"
						>
							{model.id}
						</TooltipContent>
					</Tooltip>
					<div className="mt-1.5 flex items-center gap-2">
						<Badge
							className={`h-6 px-2.5 text-xs ${
								status === "complete"
									? "border-green-500 text-green-700 bg-transparent hover:bg-green-50 dark:hover:bg-green-900/30"
									: status === "critical"
									? "border-red-500 text-red-700 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/30"
									: "border-yellow-500 text-yellow-700 bg-transparent hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
							}`}
							variant="outline"
						>
							<span className="flex items-center gap-1.5">
								{status === "complete" && (
									<CheckCircle className="w-4 h-4 text-green-500" />
								)}
								{status === "critical" && (
									<Users className="w-4 h-4 text-red-500" />
								)}
								{status === "warning" && (
									<FileWarning className="w-4 h-4 text-yellow-500" />
								)}
								{status === "complete"
									? "Complete"
									: status === "critical"
									? "Needs Contributions"
									: "Needs Review"}
							</span>
						</Badge>
					</div>
				</div>
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<Link
							href={`https://github.com/DanielButler1/AI-Stats/blob/main/src/data/models/${model.provider?.provider_id}/${model.id}/model.json`}
							className="absolute top-2 right-2 p-2 rounded-full hover:bg-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-primary"
							aria-label="Propose Changes"
						>
							<Pencil className="w-4 h-4 text-zinc-500" />
						</Link>
					</TooltipTrigger>
					<TooltipContent>Propose Changes</TooltipContent>
				</Tooltip>
			</CardHeader>
			{/* Content */}
			{status !== "complete" && !isRumoured && (
				<CardContent className="pt-2">
					<ul className="list-disc list-inside text-sm space-y-1.5">
						{criticalErrors.map((err, i) => (
							<li key={i} className="text-red-700">
								{err}
							</li>
						))}
						{hiddenCriticalCount > 0 && (
							<Tooltip delayDuration={0}>
								<TooltipTrigger asChild>
									<li className="text-red-600 font-medium cursor-help">
										+{hiddenCriticalCount} more critical
										issues...
									</li>
								</TooltipTrigger>
								<TooltipContent className="max-w-[300px]">
									<ul className="list-disc list-inside space-y-1">
										{allCriticalErrors
											.slice(criticalErrors.length)
											.map((err, i) => (
												<li key={i}>{err}</li>
											))}
									</ul>
								</TooltipContent>
							</Tooltip>
						)}
						{warnings.map((warn, i) => (
							<li key={i} className="text-yellow-700">
								{warn}
							</li>
						))}
						{hiddenWarningCount > 0 && (
							<Tooltip delayDuration={0}>
								<TooltipTrigger asChild>
									<li className="text-yellow-600 font-medium cursor-help">
										+{hiddenWarningCount} more warnings...
									</li>
								</TooltipTrigger>
								<TooltipContent className="max-w-[300px]">
									<ul className="list-disc list-inside space-y-1">
										{allWarnings
											.slice(warnings.length)
											.map((warn, i) => (
												<li key={i}>{warn}</li>
											))}
									</ul>
								</TooltipContent>
							</Tooltip>
						)}
						{suggestions.map((suggest, i) => (
							<li key={i} className="text-gray-700">
								{suggest}
							</li>
						))}
						{hiddenSuggestionCount > 0 && (
							<Tooltip delayDuration={0}>
								<TooltipTrigger asChild>
									<li className="text-gray-600 font-medium cursor-help">
										+{hiddenSuggestionCount} more
										suggestions...
									</li>
								</TooltipTrigger>
								<TooltipContent className="max-w-[300px]">
									<ul className="list-disc list-inside space-y-1">
										{allSuggestions
											.slice(suggestions.length)
											.map((suggest, i) => (
												<li key={i}>{suggest}</li>
											))}
									</ul>
								</TooltipContent>
							</Tooltip>
						)}
					</ul>
				</CardContent>
			)}
			{/* Rumoured models: hide errors and show neutral note */}
			{isRumoured && <CardContent className="pt-2 pb-3"></CardContent>}
			{status === "complete" && !isRumoured && (
				<CardContent className="pt-2 pb-3">
					<p className="text-green-700 text-sm">No issues found.</p>
				</CardContent>
			)}
		</Card>
	);
}
