import * as React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book } from "lucide-react";
import type { ExtendedModel } from "@/data/types";

function getMonthDiff(date1: Date, date2: Date) {
	const years = date1.getFullYear() - date2.getFullYear();
	const months = date1.getMonth() - date2.getMonth();
	return years * 12 + months;
}

function formatDate(dateStr: string | null | undefined) {
	if (!dateStr) return "-";
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return "-";
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export default function KnowledgeCutoffTimeline({
	selectedModels,
}: {
	selectedModels: ExtendedModel[];
}) {
	const modelsWithCutoff = selectedModels.filter((m) => m.knowledge_cutoff);
	if (modelsWithCutoff.length < 2) {
		return (
			<div className="mb-6">
				<Card className="mb-4 shadow-lg">
					<CardHeader>
						<CardTitle className="text-xl font-bold">
							Knowledge Cutoff Timeline
						</CardTitle>
						<div className="text-muted-foreground text-sm font-normal">
							Not enough models with knowledge cutoff info
						</div>
					</CardHeader>
				</Card>
			</div>
		);
	}

	const modelsSorted = [...modelsWithCutoff].sort(
		(a, b) =>
			new Date(a.knowledge_cutoff!).getTime() -
			new Date(b.knowledge_cutoff!).getTime()
	);
	const oldest = modelsSorted[0];
	const newest = modelsSorted[modelsSorted.length - 1];
	const diffMonths = getMonthDiff(
		new Date(newest.knowledge_cutoff!),
		new Date(oldest.knowledge_cutoff!)
	);
	const badgeColor =
		diffMonths > 0
			? "bg-blue-100 text-blue-800 border-blue-300"
			: "bg-red-100 text-red-700 border-red-300";
	const badgeVariant = diffMonths > 0 ? "default" : "destructive";

	const spanMonths = getMonthDiff(
		new Date(newest.knowledge_cutoff!),
		new Date(oldest.knowledge_cutoff!)
	);
	const spanYears = Math.floor(spanMonths / 12);
	const spanRemMonths = Math.abs(spanMonths % 12);
	const spanString =
		[
			spanYears > 0 ? `${spanYears}y` : null,
			spanRemMonths > 0 ? `${spanRemMonths}m` : null,
		]
			.filter(Boolean)
			.join(" ") || "0m";

	const oldestDate = formatDate(oldest.knowledge_cutoff);
	const newestDate = formatDate(newest.knowledge_cutoff);

	const summarySection = (
		<Card className="mb-4 bg-muted/60 border-none shadow-none">
			<Card className="flex items-center gap-2 p-4 border-none mt-2">
				<span className="relative flex h-4 w-4 items-center justify-center mr-4 shrink-0">
					<span className="absolute h-6 w-6 rounded-full bg-blue-400/30" />
					<Book className="relative h-full w-full text-blue-500" />
				</span>
				<div className="text-sm">
					{selectedModels.length === 1 ? (
						<>
							<span className="block font-medium">
								{oldest.name} has knowledge cutoff at{" "}
								{oldestDate}.
							</span>
						</>
					) : (
						<>
							<span className="block font-medium">
								<span className="font-semibold">
									{newest.name}
								</span>{" "}
								has knowledge up to {newestDate}, while{" "}
								<span className="font-semibold">
									{oldest.name}
								</span>{" "}
								stops at {oldestDate}.
							</span>
							<span className="block text-xs text-muted-foreground mt-1">
								{newest.name}&apos;s knowledge is{" "}
								{Math.abs(diffMonths)} month
								{Math.abs(diffMonths) !== 1 ? "s" : ""} more
								recent than {oldest.name}&apos;s.
							</span>
						</>
					)}
				</div>
			</Card>
		</Card>
	);

	return (
		<div className="mb-6">
			<Card className="mb-4 shadow-lg">
				<CardHeader className="flex flex-row items-start justify-between border-b border-b-zinc-200">
					<div>
						<CardTitle className="text-lg font-semibold">
							Knowledge Cutoff Timeline
						</CardTitle>
						<CardDescription>
							Model knowledge cutoff chronology
						</CardDescription>
					</div>
					{modelsWithCutoff.length > 1 && (
						<Badge
							variant={badgeVariant}
							className={
								badgeColor +
								" px-3 py-1 text-xs font-semibold mt-1 transition-colors duration-150 hover:bg-blue-200 hover:text-blue-900 hover:border-blue-400 dark:hover:bg-blue-900 dark:hover:text-blue-100"
							}
						>
							{spanString} span
						</Badge>
					)}
				</CardHeader>
				<CardContent className="p-6">
					{summarySection}
					<div className="pt-2">
						{/* Timeline visualization */}
						<div className="relative flex flex-col items-center w-full px-2">
							<div className="flex w-full items-center justify-between mb-2">
								{modelsSorted.map((model, idx) => (
									<span
										key={model.id}
										className="text-xs font-medium min-w-[60px] text-center"
									>
										{formatDate(model.knowledge_cutoff)}
									</span>
								))}
							</div>
							<div className="relative w-full h-6 flex items-center">
								<div
									className="absolute left-0 right-0 top-1/2 h-1 bg-zinc-200 rounded-full"
									style={{ zIndex: 0 }}
								/>
								{modelsSorted.map((model, idx) => (
									<div
										key={model.id}
										className="absolute"
										style={{
											left: `${
												(idx /
													(modelsSorted.length - 1)) *
												100
											}%`,
											transform: "translateX(-50%)",
											zIndex: 1,
										}}
									>
										<div
											className={`w-4 h-4 rounded-full border-2 border-white shadow ${
												idx === modelsSorted.length - 1
													? "bg-blue-500"
													: "bg-zinc-400"
											}`}
										/>
									</div>
								))}
							</div>
							<div className="flex w-full items-center justify-between mt-2">
								{modelsSorted.map((model) => (
									<span
										key={model.id}
										className="text-xs text-zinc-700 font-semibold min-w-[60px] text-center truncate"
									>
										{model.name}
									</span>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
