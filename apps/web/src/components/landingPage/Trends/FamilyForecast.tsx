"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const SAMPLE_ROWS = [
	{
		family: "Claude",
		medianDays: 120,
		lastRelease: "2025-06-04",
		predictedNext: "2025-10-02",
	},
	{
		family: "GPT",
		medianDays: 150,
		lastRelease: "2025-05-22",
		predictedNext: "2025-10-19",
	},
	{
		family: "Qwen",
		medianDays: 95,
		lastRelease: "2025-06-15",
		predictedNext: "2025-09-18",
	},
	{
		family: "DeepSeek",
		medianDays: 110,
		lastRelease: "2025-07-01",
		predictedNext: "2025-10-19",
	},
];

export default function FamilyForecastCard({
	rows = SAMPLE_ROWS,
}: {
	rows?: Array<{
		family: string;
		medianDays: number;
		lastRelease: string;
		predictedNext: string;
	}>;
}) {
	return (
		<Card className="border-none bg-white/70 shadow-sm ring-1 ring-inset ring-zinc-200/60 backdrop-blur-sm dark:bg-zinc-950/60 dark:ring-zinc-800/60">
			<CardHeader className="pb-2">
				<CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
					Upcoming Model Family Releases
				</CardTitle>
				<CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
					Median cadence based on the past four launches per family
				</CardDescription>
			</CardHeader>
			<CardContent className="overflow-x-auto">
				<table className="w-full min-w-[520px] text-sm">
					<thead className="text-left text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
						<tr className="border-b border-zinc-200/70 dark:border-zinc-800/70">
							<th className="py-3 pr-4">Family</th>
							<th className="py-3 pr-4 text-right">Median gap</th>
							<th className="py-3 pr-4 text-right">Last release</th>
							<th className="py-3 text-right">Predicted next</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row, index) => (
							<tr
								key={row.family}
								className="border-b border-zinc-200/50 text-zinc-700 last:border-none dark:border-zinc-800/50 dark:text-zinc-300"
							>
								<td className="py-3 pr-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
									{row.family}
								</td>
								<td className="py-3 pr-4 text-right text-sm font-medium">
									{row.medianDays} days
								</td>
								<td className="py-3 pr-4 text-right text-sm">
									{row.lastRelease}
								</td>
								<td className="py-3 text-right text-sm font-medium text-emerald-600 dark:text-emerald-300">
									{row.predictedNext}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
					Predictions update automatically when the watcher records a new family release.
				</p>
			</CardContent>
		</Card>
	);
}
