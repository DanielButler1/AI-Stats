"use client";

import React from "react";
import ModelsDisplay from "@/components/provider/ModelsDisplay";
import { ExtendedModel } from "@/data/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import Image from "next/image";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useQueryState } from "nuqs";

interface Social {
	platform: string;
	url?: string;
}

interface Provider {
	name: string;
	description?: string;
	socials?: Social[];
	[key: string]: any;
}

interface ProviderTabsProps {
	provider: Provider;
	models: ExtendedModel[];
}

// Helper to get SVG icon by platform name, with theme support for _light/_dark variants
const getSocialIcon = (platform: string) => {
	const name = platform.toLowerCase();
	if (["website", "site", "web"].includes(name)) {
		return (
			<Globe className="w-5 h-5 inline-block align-text-bottom transition-colors group-hover:text-(--provider-color)" />
		);
	}
	const themedPlatforms = ["github", "threads", "twitter"];
	if (themedPlatforms.includes(name)) {
		return (
			<>
				<Image
					src={`/social/${name}_light.svg`}
					alt={platform}
					width={20}
					height={20}
					className="w-5 h-5 object-contain align-text-bottom dark:hidden"
				/>
				<Image
					src={`/social/${name}_dark.svg`}
					alt={platform}
					width={20}
					height={20}
					className="w-5 h-5 object-contain align-text-bottom hidden dark:inline"
				/>
			</>
		);
	}
	return (
		<Image
			src={`/social/${name}.svg`}
			alt={platform}
			width={20}
			height={20}
			className="w-5 h-5 object-contain align-text-bottom"
		/>
	);
};

export default function ProviderTabs({ provider, models }: ProviderTabsProps) {
	const [activeTab, setActiveTab] = useQueryState("tab", {
		defaultValue: "overview",
	});

	// Define tabs once to reuse for both desktop and mobile
	const tabs = [
		{ label: "Overview", key: "overview" as const },
		{ label: "Models", key: "models" as const },
	];

	return (
		<div className="w-full mt-6">
			{/* Desktop Tabs */}
			<div className="hidden md:flex gap-4 border-b mb-4">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						className={`pb-2 px-2 font-medium transition-colors duration-150 ${
							activeTab === tab.key
								? "border-b-2 border-primary text-primary"
								: "border-b-2 border-transparent text-muted-foreground hover:text-primary"
						}`}
						onClick={() => setActiveTab(tab.key)}
						type="button"
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Mobile Dropdown */}
			<div className="md:hidden mb-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="w-full p-2 border rounded text-base bg-background text-foreground flex justify-between items-center">
							{tabs.find((t) => t.key === activeTab)?.label ||
								"Select"}
							<ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-full">
						{tabs.map((tab) => (
							<DropdownMenuItem
								key={tab.key}
								onSelect={() => setActiveTab(tab.key)}
								className={
									activeTab === tab.key
										? "bg-zinc-100 dark:bg-zinc-800 font-semibold"
										: ""
								}
							>
								{tab.label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{activeTab === "overview" && (
				<div className="space-y-8">
					{provider.description && (
						<div>
							<h2 className="text-xl font-bold mb-1">
								About {provider.name}
							</h2>
							<p>{provider.description}</p>
						</div>
					)}
					{(provider.website ||
						(Array.isArray(provider.socials) &&
							provider.socials.length > 0)) && (
						<div>
							<h3 className="text-lg font-semibold mb-1">
								Links
							</h3>
							<div className="flex flex-row gap-2 flex-wrap">
								{provider.website && (
									<Button
										asChild
										variant="outline"
										size="sm"
										className="group flex items-center gap-1 rounded-full"
										aria-label={`Visit ${provider.name} website`}
									>
										<Link
											href={provider.website}
											target="_blank"
											rel="noopener noreferrer"
										>
											{getSocialIcon("website")}
											<span className="text-sm hidden sm:inline">
												Website
											</span>
										</Link>
									</Button>
								)}
								{Array.isArray(provider.socials) &&
									provider.socials.length > 0 &&
									(provider.socials as Social[])
										.sort((a: Social, b: Social) =>
											a.platform.localeCompare(b.platform)
										)
										.map((social: Social, idx: number) => (
											<Button
												asChild
												variant="outline"
												size="sm"
												className="group flex items-center gap-1 rounded-full"
												key={social.platform + idx}
												aria-label={`Visit ${provider.name} ${social.platform} page`}
											>
												<Link
													href={social.url || "#"}
													target="_blank"
													rel="noopener noreferrer"
												>
													{getSocialIcon(
														social.platform
													)}
													<span className="text-sm hidden sm:inline">
														{social.platform
															.charAt(0)
															.toUpperCase() +
															social.platform.slice(
																1
															)}
													</span>
												</Link>
											</Button>
										))}
							</div>
						</div>
					)}
					<div>
						<h3 className="text-lg font-semibold mb-1">
							Latest Models
						</h3>
						<ModelsDisplay
							models={[...models]
								.sort(
									(a, b) =>
										(b.release_date
											? new Date(b.release_date).getTime()
											: 0) -
										(a.release_date
											? new Date(a.release_date).getTime()
											: 0)
								)
								.slice(0, 8)}
							showStatusHeadings={false}
						/>
					</div>
				</div>
			)}

			{activeTab === "models" && <ModelsDisplay models={models} />}
		</div>
	);
}
