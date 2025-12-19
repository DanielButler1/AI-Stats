"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	BarChart3,
	Settings,
	CheckCircle2,
	XCircle,
	Network,
	Clock,
	Archive,
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	TokenTripleSection,
	ImageGenSection,
	VideoGenSection,
	AdvancedTable,
	CacheWriteSection,
} from "@/components/(data)/model/pricing/sections";
import { buildProviderSections } from "@/components/(data)/model/pricing/pricingHelpers";
import type { ProviderPricing } from "@/lib/fetchers/models/getModelPricing";
import { Logo } from "@/components/Logo";

export default function ProviderCard({
	provider,
	plan,
}: {
	provider: ProviderPricing;
	plan: string;
}) {
	const sec = useMemo(
		() => buildProviderSections(provider, plan),
		[provider, plan]
	);

	const hasActiveGateway = provider.provider_models.some(
		(pm) => pm.is_active_gateway
	);
	const now = new Date().getTime();
	const isRetiredFor = (item: ProviderPricing["provider_models"][number]) => {
		const effectiveToStr = item.effective_to || null;
		if (!effectiveToStr || typeof effectiveToStr !== "string") return false;
		const eff = new Date(effectiveToStr);
		return !isNaN(eff.getTime()) && eff.getTime() < now;
	};
	const isComingSoonFor = (
		item: ProviderPricing["provider_models"][number]
	) => {
		const effectiveFromStr = item.effective_from || null;
		if (!effectiveFromStr || typeof effectiveFromStr !== "string") {
			return Boolean(item.provider_model_slug || item.endpoint);
		}
		const eff = new Date(effectiveFromStr);
		return !isNaN(eff.getTime()) && eff.getTime() > now;
	};
	const isAllRetired =
		provider.provider_models.length > 0 &&
		provider.provider_models.every(isRetiredFor);
	const isComingSoon = provider.provider_models.some(isComingSoonFor);

	const status = hasActiveGateway
		? "Active"
		: isAllRetired
			? "Retired"
			: isComingSoon
				? "Coming Soon"
				: "Inactive";

	// Define all possible endpoints grouped by category
	const endpointCategories = [
		{
			name: "Text",
			endpoints: [
				{ key: "responses", label: "Responses" },
				{ key: "chat.completions", label: "Chat Completions" },
			]
		},
		{
			name: "Image",
			endpoints: [
				{ key: "image.generations", label: "Image Generations" },
				{ key: "image.edits", label: "Image Edits" },
			]
		},
		{
			name: "Video",
			endpoints: [
				{ key: "video.generations", label: "Video Generations" },
			]
		},
		{
			name: "Audio",
			endpoints: [
				{ key: "audio.transcriptions", label: "Audio Transcriptions" },
				{ key: "audio.speech", label: "Audio Speech" },
				{ key: "audio.translations", label: "Audio Translations" },
			]
		},
		{
			name: "Specialized",
			endpoints: [
				{ key: "embeddings", label: "Embeddings" },
				{ key: "moderations", label: "Moderations" },
				{ key: "batch", label: "Batch" },
			]
		}
	];

	// Get gateway-supported endpoints from provider models
	const gatewaySupportedEndpoints = new Set(
		provider.provider_models
			.filter((pm) => pm.is_active_gateway)
			.map((pm) => pm.endpoint)
	);

	const allEmpty =
		!sec.textTokens &&
		!sec.imageTokens &&
		!sec.audioTokens &&
		!sec.videoTokens &&
		!sec.imageGen &&
		!sec.videoGen &&
		!sec.cacheWrites?.length &&
		!sec.otherRules.length;

	if (allEmpty) return null;

	return (
		<Card className="border-slate-200">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Link href={`/api-providers/${sec.providerId}`} className="group">
							<div className="w-10 h-10 relative flex items-center justify-center rounded-xl border">
								<div className="w-7 h-7 relative">
									<Logo
										id={sec.providerId}
										alt={`${sec.providerName} logo`}
										className="object-contain group-hover:opacity-80 transition"
										fill
									/>
								</div>
							</div>
						</Link>
						<Link href={`/api-providers/${sec.providerId}`} className="group">
							<CardTitle className="text-lg group-hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
								{sec.providerName}
							</CardTitle>
						</Link>
						<div className="flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1">
							{hasActiveGateway ? (
								<CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
							) : isAllRetired ? (
								<Archive className="h-3.5 w-3.5 text-slate-500" />
							) : isComingSoon ? (
								<Clock className="h-3.5 w-3.5 text-amber-500" />
							) : (
								<XCircle className="h-3.5 w-3.5 text-red-500" />
							)}
							<span className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">
								{status}
							</span>
						</div>
					</div>
					<div className="flex items-center gap-2">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<span>
											<Button
												variant="ghost"
												size="sm"
												disabled
												className="h-8 w-8 p-0"
											>
												<BarChart3 className="h-4 w-4" />
											</Button>
										</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>Coming Soon: Performance Stats</p>
									</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<span>
											<Button
												variant="ghost"
												size="sm"
												disabled
												className="h-8 w-8 p-0"
											>
												<Settings className="h-4 w-4" />
											</Button>
										</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>Coming Soon: Supported Parameters</p>
									</TooltipContent>
								</Tooltip>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0"
											title="Supported Endpoints"
										>
											<Network className="h-4 w-4" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-72" side="right">
										<div className="space-y-4">
											<h4 className="font-semibold text-sm">Gateway Endpoint Support</h4>
											<div className="space-y-4">
												{endpointCategories.map((category) => (
													<div key={category.name} className="space-y-2">
														<h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
															{category.name}
														</h5>
														<div className="space-y-1">
															{category.endpoints.map((endpoint) => {
																const isSupported = gatewaySupportedEndpoints.has(endpoint.key);
																return (
																	<div key={endpoint.key} className="flex items-center justify-between">
																		<span className="text-sm">{endpoint.label}</span>
																		{isSupported ? (
																			<CheckCircle2 className="h-4 w-4 text-green-600" />
																		) : (
																			<XCircle className="h-4 w-4 text-red-500" />
																		)}
																	</div>
																);
															})}
														</div>
													</div>
												))}
											</div>
										</div>
									</PopoverContent>
								</Popover>
							</TooltipProvider>
						</div>
					</div>
				</CardHeader>
			<CardContent className="space-y-6">
				{/* Text Tokens */}
				{sec.textTokens && (
					<TokenTripleSection title="Text Tokens" triple={sec.textTokens} />
				)}
				{/* Cache Writes for Text */}
				{sec.cacheWrites && sec.cacheWrites.length > 0 && (
					<CacheWriteSection rows={sec.cacheWrites} />
				)}

				{/* Image Tokens */}
				{sec.imageTokens && (
					<TokenTripleSection title="Image Tokens" triple={sec.imageTokens} />
				)}
				{/* Image Generation */}
				{sec.imageGen && <ImageGenSection rows={sec.imageGen} />}

				{/* Audio Tokens */}
				{sec.audioTokens && (
					<TokenTripleSection title="Audio Tokens" triple={sec.audioTokens} />
				)}

				{/* Video Tokens */}
				{sec.videoTokens && (
					<TokenTripleSection title="Video Tokens" triple={sec.videoTokens} />
				)}
				{/* Video Generation */}
				{sec.videoGen && <VideoGenSection rows={sec.videoGen} />}

				{/* Advanced pricing */}
				{sec.otherRules.length > 0 && (
					<AdvancedTable rows={sec.otherRules} />
				)}
			</CardContent>
		</Card>
	);
}
