import React from "react";
import Image from "next/image";
import Header from "@/components/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProviderTabs from "@/components/provider/ProviderTabs";
import { ExtendedModel } from "@/data/types";

interface ProviderDisplayProps {
	provider: any;
	models: ExtendedModel[];
}

export default function ProviderDisplay({
	provider,
	models,
}: ProviderDisplayProps) {
	if (!provider || !models || models.length === 0) {
		return (
			<main className="flex min-h-screen flex-col">
				<Header />
				<div className="container mx-auto px-4 py-8">
					<div className="rounded-lg border border-dashed p-6 md:p-8 text-center bg-muted/30">
						<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
							<span className="text-xl">🏢</span>
						</div>
						<p className="text-base font-medium">
							Provider not found or has no models
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							We&apos;re continuously adding new providers and
							models. Have a provider to suggest or contribute?
						</p>
						<div className="mt-3">
							<a
								href="https://github.com/DanielButler1/AI-Stats"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
							>
								Contribute on GitHub
								<Image
									src="/social/github_light.svg"
									alt="GitHub Logo"
									width={16}
									height={16}
									className="inline dark:hidden"
								/>
								<Image
									src="/social/github_dark.svg"
									alt="GitHub Logo"
									width={16}
									height={16}
									className="hidden dark:inline"
								/>
							</a>
						</div>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<TooltipProvider>
				<div className="container mx-auto px-4 py-8">
					{/* Layout around logo, info, and flag */}
					<div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full gap-2 md:gap-0">
						{/* Left: logo + name + socials */}
						<div className="flex flex-col md:flex-row items-center gap-4">
							{/* Provider logo */}
							<div className="shrink-0 flex items-center justify-center">
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
							{/* Provider info: name and icons */}
							<div className="flex flex-col items-center md:items-start justify-center">
								<h1 className="text-3xl md:text-5xl font-bold mb-1 text-center md:text-left">
									{provider.name}
								</h1>
							</div>
						</div>
						{/* Right: flag, aligned with logo/name row */}
						{provider?.country_code && (
							<div className="mt-2 md:mt-0 md:ml-6 shrink-0 flex items-center h-full">
								<Image
									src={`/flags/${provider.country_code.toLowerCase()}.svg`}
									alt={provider.country_code}
									width={48}
									height={48}
									className="rounded-md border shadow-lg w-12 h-auto md:w-24 md:h-auto object-cover"
								/>
							</div>
						)}
					</div>

					{/* Tabs section below main provider heading */}
					<ProviderTabs provider={provider} models={models} />
				</div>
			</TooltipProvider>
		</main>
	);
}
