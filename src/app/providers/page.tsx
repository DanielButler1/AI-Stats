import fs from "fs/promises";
import path from "path";
import Header from "@/components/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Provider } from "@/data/types";
import Image from "next/image";
import Link from "next/link";
import { Globe, ArrowRight, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

// Static SEO metadata for providers listing
export const metadata: Metadata = {
	title: "All Providers",
	description:
		"Browse all AI providers and explore their models and benchmarks.",
	keywords: ["AI providers", "machine learning providers", "model providers"],
};

async function getAllProviders(): Promise<Provider[]> {
	const providersDir = path.join(process.cwd(), "src/data/providers");
	const providerFolders = await fs.readdir(providersDir);
	const providers: Provider[] = [];

	for (const folder of providerFolders) {
		const providerPath = path.join(providersDir, folder, "provider.json");
		try {
			const file = await fs.readFile(providerPath, "utf-8");
			const provider = JSON.parse(file);
			providers.push(provider);
		} catch {
			// Ignore folders without provider.json
		}
	}
	return providers;
}

// Helper to get the most recent model for a provider
async function getMostRecentModel(providerId: string) {
	const modelsDir = path.join(process.cwd(), "src/data/models", providerId);
	let mostRecent: { name: string; release_date: string; id: string } | null =
		null;
	try {
		const modelFolders = await fs.readdir(modelsDir);
		for (const folder of modelFolders) {
			const modelPath = path.join(modelsDir, folder, "model.json");
			try {
				const file = await fs.readFile(modelPath, "utf-8");
				const model = JSON.parse(file);
				if (
					model.release_date &&
					(!mostRecent ||
						new Date(model.release_date) >
							new Date(mostRecent.release_date))
				) {
					mostRecent = {
						name: model.name,
						release_date: model.release_date,
						id: model.id,
					};
				}
			} catch {
				// Ignore models that can't be read/parsed
			}
		}
	} catch {
		// Ignore providers with no models directory
	}
	return mostRecent;
}

// Helper to format date as '15 Mar 2025'
function formatDate(dateStr?: string) {
	if (!dateStr) return "-";
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export default async function ProvidersPage() {
	const providers = await getAllProviders();
	// Fetch most recent model for each provider
	const recentModels = await Promise.all(
		providers.map((p) => getMostRecentModel(p.provider_id))
	);

	// Pair providers with their most recent model and sort providers alphabetically
	const providerPairs = providers
		.map((provider, i) => ({
			provider,
			recent: recentModels[i],
		}))
		.sort((a, b) => a.provider.name.localeCompare(b.provider.name));

	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<div className="container mx-auto px-4 py-8">
				<Card className="shadwow-lg mb-4 p-4">
					<h2 className="text-3xl font-bold">Providers</h2>
				</Card>
				<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
					{providerPairs.map(({ provider, recent }) => (
						<Card
							key={provider.provider_id}
							style={{
								borderColor: provider.colour || undefined,
							}}
							className={cn(
								"h-full transition-shadow shadow-lg hover:shadow-lg relative",
								provider.colour && "border-2"
							)}
						>
							<CardHeader className="flex flex-row items-center gap-4 pb-2">
								<Link
									href={`/providers/${provider.provider_id}`}
									className="group"
								>
									<div className="w-12 h-12 relative flex items-center justify-center rounded-full border bg-white">
										<div className="w-9 h-9 relative">
											<Image
												src={`/providers/${provider.provider_id}.svg`}
												alt={provider.name}
												className="object-contain group-hover:opacity-80 transition"
												fill
											/>
										</div>
									</div>
								</Link>
								<div className="flex flex-col flex-1 min-w-0">
									<CardTitle className="truncate flex flex-col items-start gap-1">
										<Link
											href={`/providers/${provider.provider_id}`}
											className="hover:underline font-semibold"
										>
											<span>{provider.name}</span>
										</Link>
										{provider.country_code && (
											<span className="mt-1">
												<Image
													src={`/flags/${provider.country_code.toLowerCase()}.svg`}
													alt={provider.country_code}
													width={20}
													height={14}
													className="inline-block rounded-sm border"
												/>
											</span>
										)}
									</CardTitle>
								</div>
								<div className="flex gap-1 absolute top-4 right-4 z-10">
									{provider.twitter && (
										<Button
											asChild
											size="icon"
											variant="ghost"
											tabIndex={-1}
											className="group"
											style={
												{
													"--provider-arrow-color":
														provider.colour ??
														"inherit",
												} as React.CSSProperties
											}
										>
											<Link
												href={provider.twitter}
												target="_blank"
												rel="noopener noreferrer"
												aria-label={`Visit ${provider.name} website`}
												tabIndex={-1}
											>
												<Twitter
													className={cn(
														"w-5 h-5 transition-colors group-hover:text-[color:var(--provider-arrow-color)]"
													)}
												/>
											</Link>
										</Button>
									)}
									{provider.website && (
										<Button
											asChild
											size="icon"
											variant="ghost"
											tabIndex={-1}
											className="group"
											style={
												{
													"--provider-arrow-color":
														provider.colour ??
														"inherit",
												} as React.CSSProperties
											}
										>
											<Link
												href={provider.website}
												target="_blank"
												rel="noopener noreferrer"
												aria-label={`Visit ${provider.name} website`}
												tabIndex={-1}
											>
												<Globe
													className={cn(
														"w-5 h-5 transition-colors group-hover:text-[color:var(--provider-arrow-color)]"
													)}
												/>
											</Link>
										</Button>
									)}
									<Button
										asChild
										size="icon"
										variant="ghost"
										tabIndex={-1}
										style={
											{
												"--provider-arrow-color":
													provider.colour ??
													"inherit",
											} as React.CSSProperties
										}
									>
										<Link
											href={`/providers/${provider.provider_id}`}
											aria-label={`Go to ${provider.name} details`}
											tabIndex={-1}
											className="group"
										>
											<ArrowRight
												className={cn(
													"w-5 h-5 transition-colors group-hover:text-[color:var(--provider-arrow-color)]"
												)}
											/>
										</Link>
									</Button>
								</div>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="mt-4">
									<div className="text-xs text-muted-foreground mb-1 font-medium">
										Most Recent Model
									</div>
									{recent ? (
										<div className="flex flex-col">
											<Link
												href={`/models/${recent.id}`}
												className="font-medium text-sm truncate hover:underline"
											>
												{recent.name}
											</Link>
											<span className="text-xs text-zinc-500">
												Released{" "}
												{formatDate(
													recent.release_date
												)}
											</span>
										</div>
									) : (
										<span className="text-xs text-zinc-400">
											No models found
										</span>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</main>
	);
}
