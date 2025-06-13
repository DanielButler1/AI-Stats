import { ExtendedModel } from "@/data/types";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ContextWindowBarChart from "./ContextWindowBarChart";
import Image from "next/image";
import React from "react";
import { Star, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ContextWindowComparisonProps {
	selectedModels: ExtendedModel[];
}

function getBarChartData(models: ExtendedModel[]) {
	return [
		{
			type: "Input Context",
			...Object.fromEntries(
				models.map((m) => [
					m.name,
					m.input_context_length != null
						? m.input_context_length
						: null,
				])
			),
		},
		{
			type: "Output Context",
			...Object.fromEntries(
				models.map((m) => [
					m.name,
					m.output_context_length != null
						? m.output_context_length
						: null,
				])
			),
		},
	];
}

function getInfoSentence(models: ExtendedModel[]) {
	if (models.length < 2) return null;
	// Sort by input context length descending
	const sorted = [...models].sort(
		(a, b) => (b.input_context_length || 0) - (a.input_context_length || 0)
	);
	const [first, second] = sorted;
	return `${first.name} accepts ${
		first.input_context_length?.toLocaleString() ?? "-"
	} input tokens compared to ${second.name}'s ${
		second.input_context_length?.toLocaleString() ?? "-"
	}. ${first.name} can generate responses up to ${
		first.output_context_length?.toLocaleString() ?? "-"
	} tokens, while ${second.name} is limited to ${
		second.output_context_length?.toLocaleString() ?? "-"
	} tokens.`;
}

function BarChartTooltip({ active, payload, label }: any) {
	if (!active || !payload || payload.length === 0) return null;
	return (
		<div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-3 border border-zinc-200 dark:border-zinc-800 min-w-[225px]">
			<div className="font-semibold text-sm mb-1">{label}</div>
			{payload.map((p: any) => (
				<div key={p.name} className="flex justify-between text-xs mb-1">
					<span>{p.name}</span>
					<span>
						{p.value != null ? p.value.toLocaleString() : "-"}{" "}
						tokens
					</span>
				</div>
			))}
		</div>
	);
}

function getModelCountBadge(models: ExtendedModel[]) {
	const withInfo = models.filter(
		(m) => m.input_context_length != null && m.output_context_length != null
	);
	if (withInfo.length === models.length) {
		return <Badge className="absolute top-4 right-4">All Models</Badge>;
	}
	if (withInfo.length === 1) {
		return (
			<Badge className="absolute top-4 right-4">1 Model With Info</Badge>
		);
	}
	if (withInfo.length === 0) {
		return (
			<Badge className="absolute top-4 right-4">
				No Models With Info
			</Badge>
		);
	}
	return (
		<Badge className="absolute top-4 right-4">
			{models.length - withInfo.length} Model
			{models.length - withInfo.length > 1 ? "s" : ""} Missing
		</Badge>
	);
}

export default function ContextWindowComparison({
	selectedModels,
}: ContextWindowComparisonProps) {
	if (!selectedModels || selectedModels.length === 0) return null;
	const infoSentence = getInfoSentence(selectedModels);
	return (
		<Card className="mb-6 bg-white dark:bg-zinc-950 rounded-lg shadow">
			<CardHeader className="flex flex-col items-start justify-between border-b border-b-zinc-200">
				<CardTitle className="text-lg font-semibold">
					Context Window
				</CardTitle>
				<CardDescription className="text-muted-foreground text-sm">
					Maximum input and output token capacity
				</CardDescription>
				{getModelCountBadge(selectedModels)}
			</CardHeader>
			<CardContent className="p-6">
				{infoSentence && (
					<div className="mb-4">
						<Card className="border-none shadow-lg">
							<CardContent className="py-4 text-sm text-left flex items-center justify-start">
								<span className="relative flex h-4 w-4 items-center justify-center mr-4 shrink-0">
									<span className="absolute h-6 w-6 rounded-full bg-blue-400/30" />
									<Info className="relative h-full w-full text-blue-500 shrink-0" />
								</span>
								<span>{infoSentence}</span>
							</CardContent>
						</Card>
					</div>
				)}
				<div className="flex flex-col md:flex-row w-full gap-4 mb-6">
					{selectedModels.map((model) => (
						<Card
							key={model.id}
							className="shadow border-none flex flex-col justify-between flex-1 min-w-0 mb-4 md:mb-0"
							style={{ minWidth: 0 }}
						>
							<CardHeader className="flex flex-row items-center gap-3 pb-2">
								<Image
									src={`/providers/${model.provider.provider_id}.svg`}
									alt={model.provider.name}
									width={32}
									height={32}
									className="rounded-full border bg-white object-contain"
								/>
								<div className="font-semibold truncate text-base leading-tight">
									{model.name}
								</div>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm mb-1">
									<span className="text-muted-foreground">
										Input Context Length
									</span>
									<span className="font-mono font-bold mt-1 sm:mt-0">
										{model.input_context_length != null
											? formatTokens(
													model.input_context_length
											  )
											: "-"}
									</span>
								</div>
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
									<span className="text-muted-foreground">
										Output Context Length
									</span>
									<span className="font-mono font-bold mt-1 sm:mt-0">
										{model.output_context_length != null
											? formatTokens(
													model.output_context_length
											  )
											: "-"}
									</span>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
				<div className="hidden sm:block bg-muted p-4 rounded-lg text-center mb-4">
					<ContextWindowBarChart
						chartData={getBarChartData(selectedModels)}
						models={selectedModels.map((m) => ({
							name: m.name,
							provider: m.provider.name,
						}))}
						CustomTooltip={BarChartTooltip}
						barGap={32}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

// Helper for K/M/B formatting
function formatTokens(val: number | null | undefined): string {
	if (val == null) return "-";
	if (val >= 1_000_000_000)
		return (val / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
	if (val >= 1_000_000)
		return (val / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
	if (val >= 1_000) return (val / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
	return val.toLocaleString();
}
