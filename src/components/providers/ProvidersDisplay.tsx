"use client";

import type { Provider } from "@/data/types";
import ProviderCard from "./ProviderCard";

interface ProvidersDisplayProps {
	providers: Provider[];
}

export default function ProvidersDisplay({ providers }: ProvidersDisplayProps) {
	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
				<h1 className="font-bold text-xl text-black mb-2 md:mb-0">
					Providers
				</h1>
			</div>
			<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
				{providers.map((provider) => (
					<ProviderCard
						key={provider.provider_id}
						provider={provider}
					/>
				))}
			</div>
		</>
	);
}
