import type { Model, ExtendedModel } from "@/data/types";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";

interface KeyInsightsProps {
	models: ExtendedModel[];
}

interface SotaJump {
	date: Date;
	score: number;
	modelName: string;
}

export default function KeyInsights({ models }: KeyInsightsProps) {
	// Track SOTA progression and get yearly peaks
	const getSotaProgression = () => {
		const sortedModels = models
			.filter((model) => {
				if (!model.glickoRating || !model.release_date) return false;
				const aiStatsScore = model.glickoRating.rating;
				const date = new Date(model.release_date);
				return aiStatsScore && !isNaN(date.getTime());
			})
			.sort((a, b) => {
				const dateA = new Date(a.release_date!).getTime();
				const dateB = new Date(b.release_date!).getTime();
				return dateA - dateB;
			});

		let currentSota = 0;
		const sotaJumps: SotaJump[] = [];

		for (const model of sortedModels) {
			const aiStatsScore = model.glickoRating?.rating;
			const date = new Date(model.release_date!);

			if (aiStatsScore !== undefined && aiStatsScore !== null) {
				const numericScore = aiStatsScore;

				if (numericScore > currentSota) {
					sotaJumps.push({
						date,
						score: numericScore,
						modelName: model.name,
					});
					currentSota = numericScore;
				}
			}
		}

		// Group SOTA achievements by year
		const yearlyPeaks = sotaJumps.reduce<Record<number, number>>(
			(acc, jump) => {
				const year = jump.date.getFullYear();
				// Only update if the new score is higher
				if (!acc[year] || jump.score > acc[year]) {
					acc[year] = jump.score;
				}
				return acc;
			},
			{}
		);

		return { sotaJumps, yearlyPeaks };
	};

	const { sotaJumps, yearlyPeaks } = getSotaProgression();
	const years = Object.keys(yearlyPeaks)
		.map(Number)
		.sort((a, b) => b - a);
	const currentYear = years[0];
	const prevYear = years[1];

	// Calculate YoY growth using SOTA peaks
	const currentYearSota = yearlyPeaks[currentYear] || 0;
	const prevYearSota = yearlyPeaks[prevYear] || 0;
	const yoyGrowth =
		prevYearSota > 0
			? (((currentYearSota - prevYearSota) / prevYearSota) * 100).toFixed(
					1
			  )
			: "N/A";

	// Calculate average time between SOTA improvements
	const calculateSotaMetrics = () => {
		if (sotaJumps.length < 2) return { months: 0, acceleration: 0 };

		// Calculate time gaps and apply exponential weighting
		const gaps: { months: number; weight: number }[] = [];
		const decayFactor = 0.85; // Each older gap has 85% the weight of the next one

		for (let i = sotaJumps.length - 1; i > 0; i--) {
			const date1 = sotaJumps[i - 1].date;
			const date2 = sotaJumps[i].date;
			const monthsDiff =
				(date2.getFullYear() - date1.getFullYear()) * 12 +
				(date2.getMonth() - date1.getMonth());

			// Weight is exponentially higher for more recent gaps
			const weight = Math.pow(decayFactor, sotaJumps.length - 1 - i);
			gaps.push({ months: monthsDiff, weight });
		}

		// Calculate weighted average
		const totalWeight = gaps.reduce((sum, gap) => sum + gap.weight, 0);
		const weightedMonths = gaps.reduce(
			(sum, gap) => sum + gap.months * gap.weight,
			0
		);
		const avgMonths = Math.round(weightedMonths / totalWeight);

		// New Progress Acceleration: gradient between lowest and highest SOTA
		let acceleration = 0;
		if (sotaJumps.length >= 2) {
			// Find the jump with the lowest score (earliest SOTA)
			const minJump = sotaJumps.reduce((min, curr) =>
				curr.score < min.score ? curr : min
			);
			// Find the jump with the highest score (latest SOTA)
			const maxJump = sotaJumps.reduce((max, curr) =>
				curr.score > max.score ? curr : max
			);
			const monthsDiff =
				(maxJump.date.getFullYear() - minJump.date.getFullYear()) * 12 +
				(maxJump.date.getMonth() - minJump.date.getMonth());
			if (monthsDiff > 0) {
				acceleration = (maxJump.score - minJump.score) / monthsDiff;
			}
		}

		return {
			months: avgMonths,
			acceleration:
				!isNaN(acceleration) && isFinite(acceleration)
					? acceleration
					: 0,
		};
	};

	const { months: avgMonthsToSota, acceleration } = calculateSotaMetrics();

	// Calculate total improvement using SOTA progression
	const improvement = (() => {
		const oldestYear = years[years.length - 1];
		const newestYear = years[0];
		const oldestScore = yearlyPeaks[oldestYear];
		const newestScore = yearlyPeaks[newestYear];

		// Return N/A if we don't have valid scores to compare
		if (!oldestScore || !newestScore) return "N/A";
		return (newestScore / oldestScore).toFixed(1);
	})();
	const statsList = [
		{
			title: "AI Stats Score Growth",
			value: yoyGrowth === "N/A" ? "New Peak" : `${yoyGrowth}%`,
			subtitle: "Year-over-year SOTA improvement",
			description:
				"Percentage improvement in AI Stats Score compared to the highest score from the previous year.",
		},
		{
			title: "Innovation Cycle",
			value: avgMonthsToSota > 0 ? `${avgMonthsToSota} months` : "N/A",
			subtitle: "Avg. time between SOTA records",
			description:
				"Weighted average time between State-of-the-Art (SOTA) achievements, with recent gaps weighted more heavily to better reflect the current pace of innovation. This reduces the impact of historically longer gaps between breakthroughs.",
		},
		{
			title: "Progress Acceleration (Beta)",
			value:
				acceleration === 0 || isNaN(acceleration)
					? "N/A"
					: `${acceleration > 0 ? "+" : ""}${acceleration.toFixed(
							4
					  )}`,
			subtitle: "Change in improvement rate (points/month²)",
			description:
				"Measures how quickly the rate of improvement is changing. A positive value means progress is accelerating, while negative means it's slowing down.",
		},
		{
			title: "Historical Progress",
			value: improvement === "N/A" ? "N/A" : `${improvement}x`,
			subtitle: `Total AI Stats Score improvement since ${
				years[years.length - 1]
			}`,
			description: `Total multiplication in AI Stats Score performance from ${
				years[years.length - 1]
			} to present. Shows overall progress made in the field.`,
		},
	];

	return (
		<div className="w-full">
			<dl className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{" "}
				{statsList.map((item) => (
					<Card key={item.title} className="p-6 py-4 shadow-lg">
						<div className="flex items-center justify-between">
							<dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
								{item.title}
								<HoverCard>
									<HoverCardTrigger asChild>
										<Info className="h-4 w-4 text-muted-foreground/50 hover:text-muted-foreground cursor-help" />
									</HoverCardTrigger>
									<HoverCardContent className="text-sm">
										{item.description}
									</HoverCardContent>
								</HoverCard>
							</dt>
						</div>
						<dd className="mt-2 flex items-baseline justify-between">
							<div>
								<p className="text-2xl font-semibold text-foreground">
									{item.value}
								</p>
								<p className="text-sm text-muted-foreground">
									{item.subtitle}
								</p>
							</div>
						</dd>
					</Card>
				))}
			</dl>
		</div>
	);
}
