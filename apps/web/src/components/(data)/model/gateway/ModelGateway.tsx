import Hero from "./Hero";
import Providers from "./Providers";
import Quickstart from "./Quickstart";
import Streaming from "./Streaming";
import Endpoints from "./Endpoints";
import Errors from "./Errors";
import Support from "./Support";
import Identifiers from "./Identifiers";
import Unavailable from "./Unavailable";
import { SHOW_COMING_SOON } from "./config";
import ComingSoon from "@/components/(data)/ComingSoon";
import { Home } from "lucide-react";
import type { ModelGatewayMetadata } from "@/lib/fetchers/models/getModelGatewayMetadata";
import Link from "next/link";

interface ModelGatewayProps {
	metadata: ModelGatewayMetadata;
}

export default function ModelGateway({ metadata }: ModelGatewayProps) {
	if (SHOW_COMING_SOON) {
		return (
			<ComingSoon
				title="Model Gateway"
				subtitle="Access and manage any model through our unified API gateway"
				description="We're building the largest and most detailed API gateway experience so you can easily integrate and build with the greatest technology ever made."
				eta="Oct 2025"
				primaryAction={{
					label: "Read the roadmap",
					href: "/roadmap",
				}}
				secondaryAction={{
					label: "Back to home",
					href: "/",
					icon: <Home className="h-4 w-4" />,
				}}
				variant="minimal"
			/>
		);
	}

	const isAvailable = metadata.activeProviders.length > 0;
	const endpoint =
		metadata.activeProviders.find((p) => p.endpoint)?.endpoint ??
		metadata.providers.find((p) => p.endpoint)?.endpoint ??
		null;
	const normalizedEndpoint = endpoint?.toLowerCase() ?? null;
	const supportsStreaming = !normalizedEndpoint || normalizedEndpoint === "chat.completions";

	return (
		<div className="space-y-8">
			<Hero metadata={metadata} />
			<Identifiers modelId={metadata.modelId} aliases={metadata.aliases} />
			<Providers
				active={metadata.activeProviders}
				inactive={metadata.inactiveProviders}
			/>
			{isAvailable ? (
				<div className="space-y-8">
					<Quickstart
						modelId={metadata.modelId}
						aliases={metadata.aliases}
						endpoint={endpoint}
					/>
					{supportsStreaming ? (
						<Streaming modelId={metadata.modelId} endpoint={endpoint} />
					) : null}
					<Endpoints />
					<Errors />
					<Support />
				</div>
			) : (
				<Unavailable modelId={metadata.modelId} />
			)}
		</div>
	);
}
