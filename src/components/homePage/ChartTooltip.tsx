"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ChartTooltipProps {
	trendLineData: any[];
	activePoint: any;
	setActivePoint: (point: any) => void;
	scoringType: "gpqa" | "glicko";
}

export const ChartTooltip = ({
	trendLineData,
	activePoint,
	setActivePoint,
	scoringType,
}: ChartTooltipProps) => {
	const [opacity, setOpacity] = useState(0);

	useEffect(() => {
		if (activePoint) {
			setOpacity(1);
		} else {
			setOpacity(0);
		}
	}, [activePoint]);

	// Only show tooltip if we have an activePoint (from hovering)
	if (!activePoint) return null;

	// Use the activePoint data
	const data = activePoint;
	const isSotaPoint = trendLineData.some(
		(point: any) =>
			point.date === data.date && point.isSota && point.name === data.name
	);

	// Determine if tooltip should be on left or right side based on position
	// If cx is more than 60% of the chart width, show tooltip on the left
	const showOnLeft =
		data.position && data.position.cx > window.innerWidth * 0.6;

	return (
		<div
			className="absolute"
			style={{
				transform: showOnLeft
					? "translate(-108%, -50%)" // Move left by same distance as right
					: "translate(20px, -50%)", // 20px right
				left: data.position ? data.position.cx : "50%",
				top: data.position ? data.position.cy : "-10px",
				transition: "opacity 0.3s ease-in-out",
				opacity: opacity,
				pointerEvents: "auto", // Enable pointer events
			}}
			onMouseEnter={() => setActivePoint(data)} // Retain tooltip on hover
			onMouseLeave={() => setActivePoint(null)} // Clear tooltip on leave
		>
			<Card className="p-3 border-2 bg-white w-64 shadow-lg">
				<div className="flex items-center gap-3 mb-2">
					<Link href={`/providers/${data.provider.provider_id}`}>
						<div className="w-8 h-8 relative flex items-center justify-center rounded-full border bg-white">
							<div className="w-6 h-6 relative">
								<Image
									src={`/providers/${data.provider.provider_id.toLowerCase()}.svg`}
									alt={data.provider.name}
									className="object-contain"
									fill
								/>
							</div>
						</div>
					</Link>
					<div>
						<Link href={`/models/${data.id}`}>
							<div className="font-semibold hover:font-bold">
								{data.name}
							</div>
						</Link>
						<Link href={`/providers/${data.provider.provider_id}`}>
							<div className="text-sm text-muted-foreground hover:font-semibold">
								{data.provider.name}
							</div>
						</Link>
					</div>
				</div>
				<Separator className="my-2" />
				<div className="space-y-1.5">
					<div className="flex items-center justify-between gap-2">
						<span className="text-sm text-muted-foreground">
							{scoringType === "gpqa"
								? "GPQA Score:"
								: "AI Stats Score:"}
						</span>
						<span className="font-medium">
							{scoringType === "gpqa"
								? `${data.score.toFixed(2)}%`
								: data.score.toFixed(2)}
						</span>
					</div>
					<div className="flex items-center justify-between gap-2">
						<span className="text-sm text-muted-foreground">
							{data.isReleased ? "Released:" : "Announced:"}
						</span>
						<span className="font-medium">
							{new Date(
								data.originalDate || data.date
							).toLocaleDateString(undefined, {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</span>
					</div>
					{isSotaPoint && (
						<Badge
							variant="default"
							className="mt-2 py-2 w-full justify-center items-center gap-2 text-sm"
						>
							<Sparkles className="h-6 w-6" />
							State of The Art
							<Sparkles className="h-6 w-6" />
						</Badge>
					)}
				</div>
			</Card>
		</div>
	);
};
