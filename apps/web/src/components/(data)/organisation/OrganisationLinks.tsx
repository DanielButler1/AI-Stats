import Link from "next/link";
import Image from "next/image";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrganisationOverview as OrganisationOverviewType } from "@/lib/fetchers/organisations/getOrganisation";
import { cn } from "@/lib/utils";

// Map platform names to Tailwind hover classes
const PLATFORM_HOVER_CLASSES: Record<string, string> = {
	github: "hover:bg-neutral-100 dark:hover:bg-neutral-800",
	twitter: "hover:bg-blue-100 dark:hover:bg-blue-900/40",
	instagram: "hover:bg-pink-100 dark:hover:bg-pink-900/40",
	youtube: "hover:bg-red-100 dark:hover:bg-red-900/40",
	tiktok: "hover:bg-gradient-to-r hover:from-blue-100 hover:to-pink-100 dark:hover:from-blue-900/40 dark:hover:to-pink-900/40",
	hugging_face: "hover:bg-yellow-100 dark:hover:bg-yellow-900/40",
	website: "hover:bg-neutral-100 dark:hover:bg-neutral-800",
	discord: "hover:bg-indigo-100 dark:hover:bg-indigo-900/40",
	reddit: "hover:bg-orange-100 dark:hover:bg-orange-900/40",
	threads: "hover:bg-purple-100 dark:hover:bg-purple-900/40",
	x: "hover:bg-neutral-100 dark:hover:bg-neutral-800",
	linkedin: "hover:bg-blue-100 dark:hover:bg-blue-900/40",
};

export interface OrganisationLinksProps {
	organisation: OrganisationOverviewType;
}

// Helper to get SVG icon by platform name, with theme support for _light/_dark variants
const getSocialIcon = (platform: string) => {
	const name = platform.toLowerCase();
	if (["website", "site", "web"].includes(name)) {
		return (
			<Globe className="w-5 h-5 inline-block align-text-bottom transition-colors" />
		);
	}
	// Add hugging_face and tiktok as themed platforms
	const themedPlatforms = ["github", "threads", "x", "tiktok"];
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

export default function OrganisationLinks({
	organisation,
}: OrganisationLinksProps) {
	if (
		!organisation ||
		!Array.isArray(organisation.organisation_links) ||
		organisation.organisation_links.length === 0
	)
		return null;

	return (
		<div>
			<div className="grid grid-cols-4 gap-2 md:flex md:flex-row md:flex-wrap md:gap-2">
				{organisation.organisation_links
					.sort((a, b) => {
						const websiteKeys = ["website", "site", "web"];
						const aKey = (a.platform || "").toLowerCase();
						const bKey = (b.platform || "").toLowerCase();
						const aIsWebsite = websiteKeys.includes(aKey);
						const bIsWebsite = websiteKeys.includes(bKey);
						if (aIsWebsite && !bIsWebsite) return -1;
						if (!aIsWebsite && bIsWebsite) return 1;
						return a.platform.localeCompare(b.platform);
					})
					.map((link, idx) => {
						const hoverClass =
							PLATFORM_HOVER_CLASSES[
								link.platform.toLowerCase()
							] ||
							"hover:bg-neutral-100 dark:hover:bg-neutral-800";
						return (
							<Button
								asChild
								variant="outline"
								size="sm"
								key={link.platform + idx}
								aria-label={`Visit ${organisation.name} ${link.platform} page`}
								className={cn(
									"group flex items-center gap-1 rounded-full transition-colors",
									hoverClass
								)}
							>
								<Link
									href={link.url || "#"}
									target="_blank"
									rel="noopener noreferrer"
								>
									{getSocialIcon(link.platform)}
									<span className="text-sm hidden sm:inline">
										{link.platform.toLowerCase() ===
										"hugging_face"
											? "Hugging Face"
											: link.platform
													.charAt(0)
													.toUpperCase() +
											  link.platform.slice(1)}
									</span>
								</Link>
							</Button>
						);
					})}
			</div>
		</div>
	);
}
