"use client";

import { useRouter } from "next/navigation";

interface ChartScatterDotProps {
	cx: number;
	cy: number;
	payload: any;
	trendLineData: any[];
	setActivePoint: (point: any | null) => void;
}

export const ChartScatterDot = ({
	cx,
	cy,
	payload,
	trendLineData,
	setActivePoint,
}: ChartScatterDotProps) => {
	const router = useRouter();
	const isSota = trendLineData.some(
		(p: { date: any; isSota: any; name: any }) =>
			p.date === payload.date && p.isSota && p.name === payload.name
	);

	const handleClick = () => {
		router.push(`/models/${encodeURIComponent(payload.id)}`);
	};

	const handleMouseEnter = () =>
		setActivePoint({ ...payload, position: { cx, cy } });
	const handleMouseLeave = () => setActivePoint(null);

	return (
		<g
			onClick={handleClick}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={{
				cursor: "pointer",
				pointerEvents: "all",
			}}
		>
			{isSota && (
				<circle
					cx={cx}
					cy={cy}
					r={14}
					fill="#60a5fa"
					opacity={0.15}
					pointerEvents="none"
				/>
			)}
			<circle
				cx={cx}
				cy={cy}
				r={10}
				fill="white"
				stroke={isSota ? "#60a5fa" : "#e2e8f0"}
				strokeWidth={isSota ? 2 : 1}
				opacity={payload.isAnnouncedOnly ? 0.4 : isSota ? 1 : 0.7}
				pointerEvents="all"
			/>
			<image
				href={`/providers/${payload.provider.provider_id}.svg`}
				x={cx - 8}
				y={cy - 8}
				width={16}
				height={16}
				preserveAspectRatio="xMidYMid meet"
				opacity={payload.isAnnouncedOnly ? 0.4 : isSota ? 1 : 0.7}
				pointerEvents="none"
			/>
		</g>
	);
};
