import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import type { ExtendedModel, Provider } from "@/data/types";

interface ModelHeaderProps {
	model: ExtendedModel;
	provider: Provider;
}

export default function ModelHeader({ model, provider }: ModelHeaderProps) {
	return (
		<Card className="mb-4 relative flex flex-col md:flex-row items-start gap-4 md:gap-8">
			<CardHeader>
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
				<div className="flex flex-col md:flex-row items-center w-full gap-2 md:gap-0">
					{/* Provider logo */}
					<div className="flex-shrink-0 flex flex-col items-center justify-center h-full mb-2 md:mb-0 md:mr-6">
						<Image
							src={`/providers/${provider.provider_id}.svg`}
							alt={provider.name}
							width={48}
							height={48}
							className="rounded-full border bg-white object-contain w-12 h-12 md:w-24 md:h-24"
						/>
					</div>
					{/* Model and provider info */}
					<div className="flex flex-col items-center md:items-start justify-center flex-1">
						<h1 className="text-3xl md:text-5xl font-bold mb-1 text-center md:text-left">
							{model.name}
						</h1>
						<Link
							href={`/providers/${provider.provider_id}`}
							className="text-base md:text-lg font-semibold text-primary hover:font-bold flex items-center gap-2 w-fit text-center md:text-left"
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
