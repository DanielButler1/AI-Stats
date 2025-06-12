"use client";

import { type ExtendedModel } from "@/data/types";
import {
	ComposedChart,
	Scatter,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	Area,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as DataProcessor from "./ChartDataProcessor";
import { ChartTooltip } from "./ChartTooltip";
import { ChartScatterDot } from "./ChartScatterDot";
import { ChartControls } from "./ChartControls";

interface PerformanceTrendChartProps {
	models: ExtendedModel[];
}

export default function PerformanceTrendChart({
	models,
}: PerformanceTrendChartProps) {
	const [isToScale, setIsToScale] = useState(false);
	const [activePoint, setActivePoint] = useState<any>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
	const [selectedModels, setSelectedModels] = useState<string[]>([]);
	const [scoringType, setScoringType] = useState<"gpqa" | "glicko">("gpqa");
	const router = useRouter();

	// Mobile detection
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Process data for the scatter plot
	const allChartData = DataProcessor.processModelData(models, scoringType);

	// Get unique providers and models for filtering
	const uniqueProviders = Array.from(
		new Set(allChartData.map((d) => d.provider.provider_id))
	).sort();

	const uniqueModels = Array.from(
		new Set(allChartData.map((d) => d.name))
	).sort();

	// Helper function to get all models for a provider
	const getModelsForProvider = (providerId: string) => {
		return DataProcessor.getModelsForProvider(providerId, allChartData);
	};

	// Apply filters to chart data
	const chartData = allChartData.filter((point) => {
		const hasProviderFilter = selectedProviders.length > 0;
		const hasModelFilter = selectedModels.length > 0;

		if (!hasProviderFilter && !hasModelFilter) {
			return true;
		}
		if (hasProviderFilter && !hasModelFilter) {
			return selectedProviders.includes(point.provider.provider_id);
		}
		if (!hasProviderFilter && hasModelFilter) {
			return selectedModels.includes(point.name);
		}
		return (
			selectedProviders.includes(point.provider.provider_id) &&
			selectedModels.includes(point.name)
		);
	});

	// Calculate trend line data (maximum score at each date)
	const trendLineData = DataProcessor.generateTrendLineData(chartData);

	// For condensed mode, create an index-based mapping for dates
	const dateToIndexMap = DataProcessor.createDateToIndexMap(chartData);

	// Transform data for condensed mode
	const transformedData = isToScale
		? chartData
		: DataProcessor.transformDataToCondensed(chartData, dateToIndexMap);

	const transformedTrendLine = isToScale
		? trendLineData
		: DataProcessor.transformDataToCondensed(trendLineData, dateToIndexMap);
	// Filter data for mobile
	const mobileChartData = isMobile
		? DataProcessor.filterDataForMobile(
				isToScale ? chartData : transformedData,
				isToScale
					? (trendLineData as DataProcessor.TrendPoint[])
					: (transformedTrendLine as DataProcessor.TrendPoint[]),
				isToScale
		  )
		: isToScale
		? chartData
		: transformedData;

	const mobileTrendLine = isMobile
		? DataProcessor.filterTrendLineForMobile(
				isToScale
					? (trendLineData as DataProcessor.TrendPoint[])
					: (transformedTrendLine as DataProcessor.TrendPoint[]),
				isToScale
		  )
		: isToScale
		? trendLineData
		: transformedTrendLine;

	// Calculate tick values based on mode and mobile
	const tickValues = DataProcessor.calculateTickValues(
		chartData,
		isToScale,
		isMobile
	);

	// Get unique dates for axis formatting
	const uniqueDates = Array.from(
		new Set(
			chartData.map((d) => {
				const date = new Date(d.date);
				date.setHours(0, 0, 0, 0);
				return date.getTime();
			})
		)
	).sort((a, b) => a - b);
	// Debug effect to track data issues
	useEffect(() => {
		// Debug functionality removed for production
	}, [scoringType, allChartData, chartData]);

	return (
		<Card className="shadow-lg">
			<CardHeader className="relative">
				<CardTitle className={isMobile ? "text-lg" : "text-2xl"}>
					{isMobile
						? `Top AI Models - ${
								scoringType === "gpqa" ? "GPQA" : "Glicko"
						  }`
						: `Model Performance Over Time - ${
								isToScale ? "To Scale" : "Condensed"
						  } (${
								scoringType === "gpqa" ? "GPQA" : "Glicko Score"
						  })`}
				</CardTitle>
				<CardDescription>
					{isMobile
						? "State of the Art Models Only"
						: `${
								scoringType === "gpqa" ? "GPQA" : "Glicko"
						  } Scores Across Model Releases`}
				</CardDescription>

				{!isMobile && (
					<ChartControls
						isToScale={isToScale}
						setIsToScale={setIsToScale}
						scoringType={scoringType}
						setScoringType={setScoringType}
						selectedProviders={selectedProviders}
						setSelectedProviders={setSelectedProviders}
						selectedModels={selectedModels}
						setSelectedModels={setSelectedModels}
						uniqueProviders={uniqueProviders}
						uniqueModels={uniqueModels}
						allChartData={allChartData}
						getModelsForProvider={getModelsForProvider}
					/>
				)}
			</CardHeader>
			<CardContent>
				<div
					className="w-full"
					onMouseLeave={() => setActivePoint(null)}
					onMouseEnter={() => setActivePoint(null)}
				>
					<ResponsiveContainer
						width="100%"
						height={isMobile ? 400 : 600}
					>
						<ComposedChart
							onMouseLeave={() => setActivePoint(null)}
						>
							<defs>
								<linearGradient
									id="areaGradient"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="0%"
										stopColor="#60a5fa"
										stopOpacity={0.3}
									/>
									<stop
										offset="75%"
										stopColor="#60a5fa"
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<XAxis
								dataKey="date"
								domain={
									isToScale
										? [
												Math.min(
													...chartData.map(
														(d) => d.date
													)
												),
												Math.max(
													...chartData.map(
														(d) => d.date
													)
												) +
													7 * 24 * 60 * 60 * 1000,
										  ]
										: [0, uniqueDates.length - 1]
								}
								name="Date"
								tickFormatter={(value) => {
									if (!isToScale) {
										const originalDate = uniqueDates[value];
										return new Date(
											originalDate
										).toLocaleDateString(undefined, {
											month: isMobile ? "short" : "short",
											year: isMobile
												? "2-digit"
												: "numeric",
										});
									}
									return new Date(value).toLocaleDateString(
										undefined,
										{
											month: "short",
											year: isMobile
												? "2-digit"
												: "numeric",
										}
									);
								}}
								type="number"
								interval={
									isToScale
										? isMobile
											? 4
											: 2
										: isMobile
										? 2
										: 1
								}
								height={isMobile ? 60 : 75}
								angle={isMobile ? -30 : -45}
								textAnchor="end"
								ticks={
									isToScale
										? tickValues
										: Array.from(
												{ length: uniqueDates.length },
												(_, i) => i
										  ).filter((_, index) =>
												isMobile
													? index % 2 === 0
													: true
										  )
								}
							/>
							<YAxis
								dataKey="score"
								name={
									scoringType === "gpqa"
										? "GPQA Score"
										: "Glicko Score"
								}
								domain={
									scoringType === "gpqa"
										? [0, 100]
										: ["dataMin - 50", "dataMax + 50"]
								}
								tickFormatter={(value) =>
									scoringType === "gpqa"
										? `${value.toFixed(0)}%`
										: value.toFixed(0)
								}
								ticks={
									isMobile
										? scoringType === "gpqa"
											? Array.from(
													{ length: 6 },
													(_, i) => i * 20
											  )
											: undefined // Let recharts auto-calculate for Glicko
										: scoringType === "gpqa"
										? Array.from(
												{ length: 11 },
												(_, i) => i * 10
										  )
										: undefined // Let recharts auto-calculate for Glicko
								}
							/>{" "}
							<Tooltip
								content={
									<ChartTooltip
										trendLineData={mobileTrendLine as any}
										activePoint={activePoint}
										setActivePoint={setActivePoint}
										scoringType={scoringType}
									/>
								}
								cursor={false}
							/>
							<CartesianGrid
								horizontal={true}
								vertical={false}
								strokeDasharray="0 0 0 0"
								stroke="#e2e8f0"
							/>{" "}
							<Area
								data={mobileTrendLine.filter(
									(point) => point.isSota === true
								)}
								dataKey="score"
								stroke="#60a5fa"
								strokeWidth={2}
								fill="url(#areaGradient)"
								fillOpacity={1}
								activeDot={false}
								isAnimationActive={true}
								style={{ pointerEvents: "none" }}
							/>
							<Scatter
								data={mobileChartData}
								shape={(props: any) => (
									<ChartScatterDot
										{...props}
										trendLineData={mobileTrendLine as any}
										setActivePoint={setActivePoint}
									/>
								)}
								onClick={(data: any) => {
									router.push(
										`/models/${encodeURIComponent(data.id)}`
									);
								}}
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
