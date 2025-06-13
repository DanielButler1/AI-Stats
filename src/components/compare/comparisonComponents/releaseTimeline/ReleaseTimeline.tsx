import * as React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import type { ExtendedModel } from "@/data/types";

function getMonthDiff(date1: Date, date2: Date) {
	const years = date1.getFullYear() - date2.getFullYear();
	const months = date1.getMonth() - date2.getMonth();
	return years * 12 + months;
}

function formatDate(dateStr: string) {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export default function ReleaseTimeline({
	selectedModels,
}: {
	selectedModels: ExtendedModel[];
}) {
	const modelsWithDates = selectedModels.filter(
		(model): model is ExtendedModel & { release_date: string } =>
			model.release_date !== null
	);

	if (!modelsWithDates || modelsWithDates.length < 1) {
		return null;
	}

	const modelsSorted = [...modelsWithDates].sort(
		(a, b) =>
			new Date(a.release_date).getTime() -
			new Date(b.release_date).getTime()
	);

	const oldest = modelsSorted[0];
	const newest = modelsSorted[modelsSorted.length - 1];
	const diffMonths = getMonthDiff(
		new Date(newest.release_date),
		new Date(oldest.release_date)
	);
	const badgeColor =
		diffMonths > 0
			? "bg-green-100 text-green-800 border-green-300"
			: "bg-red-100 text-red-700 border-red-300";
	const badgeVariant = diffMonths > 0 ? "default" : "destructive";

	// Calculate time span between oldest and newest
	const spanMonths = getMonthDiff(
		new Date(newest.release_date),
		new Date(oldest.release_date)
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

	// Build summary mini-section comparing oldest and newest
	const oldestDate = formatDate(oldest.release_date);
	const newestDate = formatDate(newest.release_date);
	const summarySection = (
		<Card className="mb-4 bg-muted/60 border-none shadow-none">
			<Card className="flex items-center gap-2 p-4 border-none mt-2">
				<span className="relative flex h-4 w-4 items-center justify-center mr-4 shrink-0">
					<span className="absolute h-6 w-6 rounded-full bg-pink-400/30" />
					<Calendar className="relative h-full w-full text-pink-500" />
				</span>
				<div className="text-sm">
					{modelsWithDates.length === 1 ? (
						<>
							<span className="block font-medium">
								{oldest.name} was released on {oldestDate}.
							</span>
						</>
					) : (
						<>
							<span className="block font-medium">
								<span className="font-semibold">
									{newest.name}
								</span>{" "}
								was released on {newestDate}, while{" "}
								<span className="font-semibold">
									{oldest.name}
								</span>{" "}
								was released on {oldestDate}.
							</span>
							<span className="block text-xs text-muted-foreground mt-1">
								{newest.name} is {Math.abs(diffMonths)} month
								{Math.abs(diffMonths) !== 1 ? "s" : ""} newer
								than {oldest.name}.
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
							Release Timeline
						</CardTitle>
						<CardDescription className="text-muted-foreground text-sm">
							Model release chronology
						</CardDescription>
					</div>
					{modelsWithDates.length > 1 && (
						<Badge
							variant={badgeVariant}
							className={
								badgeColor +
								" px-3 py-1 text-xs font-semibold mt-1 transition-colors duration-150 hover:bg-green-200 hover:text-green-900 hover:border-green-400 dark:hover:bg-green-900 dark:hover:text-green-100"
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
										{formatDate(model.release_date)}
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
											left:
												modelsWithDates.length === 1
													? "50%"
													: `${
															(idx /
																(modelsSorted.length -
																	1)) *
															100
													  }%`,
											transform: "translateX(-50%)",
											zIndex: 1,
										}}
									>
										<div
											className={`w-4 h-4 rounded-full border-2 border-white shadow ${
												idx === modelsSorted.length - 1
													? "bg-pink-500"
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
