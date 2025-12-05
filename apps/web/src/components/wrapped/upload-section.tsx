import * as React from "react";
import UploadCard from "./upload-card";
import type { ProviderConfig, ProviderState, ProviderKey } from "./types";

interface UploadSectionProps {
	providers: ProviderConfig[];
	providerState: Record<ProviderKey, ProviderState>;
	onFileSelected: (provider: ProviderConfig, file: File | undefined) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
	providers,
	providerState,
	onFileSelected,
}) => (
	<section className="space-y-6">
		<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			{providers.map((provider) => (
				<UploadCard
					key={provider.key}
					config={provider}
					state={providerState[provider.key]}
					onFileSelected={(file) => onFileSelected(provider, file)}
				/>
			))}
		</div>
	</section>
);
