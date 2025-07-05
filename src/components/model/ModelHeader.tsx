import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	TooltipProvider,
} from "@/components/ui/tooltip";
import type { ExtendedModel, Provider } from "@/data/types";

interface ModelHeaderProps {
	model: ExtendedModel;
	provider: Provider;
}

export default function ModelHeader({ model, provider }: ModelHeaderProps) {
	// Determine if the model is provisional (has benchmark_results or prices, but not released)
	const isProvisional =
		model.status === "Rumoured" ||
		(((Array.isArray(model.benchmark_results) &&
			model.benchmark_results.length > 0) ||
			(Array.isArray(model.prices) && model.prices.length > 0)) &&
			!model.release_date);

	return (
		<Card className="relative flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 shadow-lg">
			<CardHeader className="w-full">
				{/* Provider flag aligned vertically in the center */}
				{provider.country_code && (
					<div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 flex justify-center md:block w-full md:w-auto mb-2 md:mb-0 md:pr-6">
						<Image
							src={`/flags/${provider.country_code.toLowerCase()}.svg`}
							alt={provider.country_code}
							width={48}
							height={48}
							className="rounded-md border shadow-lg w-12 h-auto md:w-24 md:h-auto aspect-auto object-cover"
						/>
					</div>
				)}
				{/* Layout around logo and info */}
				<div className="flex flex-col md:flex-row items-center w-full gap-4 md:gap-0">
					{/* Provider logo */}
					<div className="flex-shrink-0 flex flex-col items-center justify-center h-full mb-2 md:mb-0 md:mr-6">
						<div className="w-12 h-12 md:w-24 md:h-24 relative flex items-center justify-center rounded-full border bg-white">
							<div className="w-10 h-10 md:w-20 md:h-20 relative">
								<Image
									src={`/providers/${provider.provider_id}.svg`}
									alt={provider.name}
									className="object-contain"
									fill
								/>
							</div>
						</div>
					</div>
					{/* Model and provider info */}
					<div className="flex flex-col items-center md:items-start justify-center flex-1 w-full text-center md:text-left">
						<div className="flex items-center gap-2 mb-1">
							<h1 className="text-3xl md:text-5xl font-bold mr-2">
								{model.name}
							</h1>
							{isProvisional && (
								<TooltipProvider>
									<Tooltip delayDuration={0}>
										<TooltipTrigger asChild>
											<span>
												<Badge variant="warning">
													Provisional
												</Badge>
											</span>
										</TooltipTrigger>
										<TooltipContent side="top">
											This model is yet to release, any
											information included on this page,
											is all subject to change
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</div>
						<Link
							href={`/providers/${provider.provider_id}`}
							className="text-base md:text-lg font-semibold text-primary hover:font-bold flex items-center justify-center md:justify-start gap-2 mx-auto md:mx-0"
							aria-label={`View ${provider.name} details`}
						>
							{provider.name}
						</Link>
					</div>
				</div>
			</CardHeader>
		</Card>
	);
}
