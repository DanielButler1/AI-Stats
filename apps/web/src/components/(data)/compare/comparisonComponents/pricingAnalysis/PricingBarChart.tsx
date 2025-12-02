import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	Legend,
} from "recharts";

interface PricingBarChartProps {
	chartData: { [key: string]: string | number | null }[];
	models: { name: string; provider: string }[]; // Add provider field
	CustomTooltip: React.FC<any>;
}

export default function PricingBarChart({
	chartData,
	models,
	CustomTooltip,
}: PricingBarChartProps) {
	const data = models.map((model) => ({
		model: model.name,
		input: chartData[0][model.name],
		inputProvider: model.provider,
		output: chartData[1][model.name],
		outputProvider: model.provider,
	}));

	const COLORS = {
		input: "#fb923c", // your orange
		output: "#d946ef", // your fuchsia
	};

	function getNumber(val: string | number | undefined | null): number {
		if (typeof val === "number") return val;
		if (typeof val === "string") return parseFloat(val) || 0;
		return 0;
	}

	// Calculate max value for x-axis
	const allVals = [
		...data.map((d) => (typeof d.input === "number" ? d.input : 0)),
		...data.map((d) => (typeof d.output === "number" ? d.output : 0)),
	];
	const maxVal = Math.max(...allVals, 0);
	// Find a nice rounded max (e.g., 10, 20, 50, 100, 200, etc.)
	function getNiceMax(val: number) {
		if (val <= 10) return 10;
		const pow = Math.pow(10, Math.floor(Math.log10(val)));
		return Math.ceil(val / pow) * pow;
	}
	const niceMax = getNiceMax(maxVal);
	// Generate ticks (5 intervals)
	const tickCount = 5;
	const tickStep = Math.ceil(niceMax / tickCount);
	const ticks = Array.from({ length: tickCount + 1 }, (_, i) => i * tickStep);

	return (
		<ResponsiveContainer
			width="100%"
			height={300} // Match ContextWindowBarChart for consistent spacing
		>
			<BarChart
				data={data}
				layout="vertical"
				margin={{ top: 16, right: 80, bottom: 32, left: 32 }}
				barCategoryGap={32}
			>
				<CartesianGrid
					stroke="#e5e7eb"
					horizontal={false} // Remove horizontal grid lines
					vertical={true} // Show vertical grid lines
				/>
				<XAxis
					type="number"
					tick={{ fontSize: 13 }}
					axisLine={false}
					tickLine={false}
					domain={[0, niceMax]} // Ensure consistent max
					ticks={ticks}
					tickFormatter={(v) =>
						`$${Number(v).toLocaleString(undefined, {
							maximumFractionDigits: 0,
						})}`
					}
					allowDecimals={false}
				/>
				<YAxis
					type="category"
					dataKey="model"
					tick={{ fontSize: 16, fontWeight: 600 }}
					axisLine={false}
					tickLine={false}
					width={140}
				/>
				<Tooltip content={<CustomTooltip />} />
				<Legend
					verticalAlign="top"
					align="center"
					iconType="circle"
					wrapperStyle={{ fontSize: 14, marginBottom: 12 }}
				/>
				<Bar
					dataKey="input"
					name="Input"
					fill={COLORS.input}
					barSize={36} // Thicker bars
					radius={[0, 10, 10, 0]}
					isAnimationActive={false}
				/>
				<Bar
					dataKey="output"
					name="Output"
					fill={COLORS.output}
					barSize={36} // Thicker bars
					radius={[0, 10, 10, 0]}
					isAnimationActive={false}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
}
