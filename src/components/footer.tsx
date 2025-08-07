import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { FilePlus, Book } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import LastUpdated from "@/components/last-updated";
import { Separator } from "@/components/ui/separator";

const currentYear = new Date().getFullYear();
const deployTime = process.env.NEXT_PUBLIC_DEPLOY_TIME ?? "";

export default function Footer() {
	return (
		<footer className="w-full border-t border-border mt-auto bg-white dark:bg-zinc-950 px-4">
			<div className="container mx-auto py-4 text-xs text-muted-foreground flex flex-col gap-4">
				<div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
					{/* Mobile grid with icon and text for all actions */}
					<div className="grid grid-cols-2 gap-3 sm:hidden mb-4">
						{/* Social: GitHub */}
						<Link
							href="https://github.com/DanielButler1/AI-Stats"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="GitHub"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors gap-2"
						>
							<Image
								src="/social/github_dark.svg"
								alt="GitHub"
								width={20}
								height={20}
								className="h-5 w-5 dark:block hidden"
							/>
							<Image
								src="/social/github_light.svg"
								alt="GitHub"
								width={20}
								height={20}
								className="h-5 w-5 block dark:hidden"
							/>
							<span className="text-xs">GitHub</span>
						</Link>
						{/* Social: Instagram */}
						<Link
							href="https://instagram.com/phaseoapp"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Instagram"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-pink-50 dark:hover:bg-pink-900 transition-colors gap-2"
						>
							<Image
								src="/social/instagram.svg"
								alt="Instagram"
								width={20}
								height={20}
								className="h-5 w-5"
							/>
							<span className="text-xs">Instagram</span>
						</Link>
						{/* Social: Reddit */}
						<Link
							href="https://reddit.com/r/yourreddit"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Reddit"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-orange-50 dark:hover:bg-orange-900 transition-colors gap-2"
						>
							<Image
								src="/social/reddit.svg"
								alt="Reddit"
								width={20}
								height={20}
								className="h-5 w-5"
							/>
							<span className="text-xs">Reddit</span>
						</Link>
						{/* Social: Twitter */}
						<Link
							href="https://twitter.com/phaseoapp"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Twitter"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors gap-2"
						>
							<Image
								src="/social/twitter_dark.svg"
								alt="Twitter"
								width={20}
								height={20}
								className="h-5 w-5 dark:block hidden"
							/>
							<Image
								src="/social/twitter_light.svg"
								alt="Twitter"
								width={20}
								height={20}
								className="h-5 w-5 block dark:hidden"
							/>
							<span className="text-xs">Twitter</span>
						</Link>
						<Separator className="col-span-2" />
						{/* Support: Discord */}
						<Link
							href="https://discord.gg/zDw73wamdX"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Discord"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors gap-2"
						>
							<Image
								src="/social/discord.svg"
								alt="Discord"
								width={20}
								height={20}
								className="h-5 w-5"
							/>
							<span className="text-xs">Discord</span>
						</Link>
						{/* Support: Buy Me a Coffee */}
						<Link
							href="https://coff.ee/phaseo"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Buy Me a Coffee"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors gap-2"
						>
							<Image
								src="/social/bmc.svg"
								alt="Buy Me a Coffee"
								width={20}
								height={20}
								className="h-5 w-5"
							/>
							<span className="text-xs">Buy Me A Coffee</span>
						</Link>
						<Separator className="col-span-2" />
						{/* Contribute */}
						<Link
							href="/contribute"
							aria-label="Contribute"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors gap-2"
						>
							<FilePlus className="h-5 w-5" />
							<span className="text-xs">Contribute</span>
						</Link>
						{/* Sources */}
						<Link
							href="/sources"
							aria-label="Sources"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors gap-2"
						>
							<Book className="h-5 w-5" />
							<span className="text-xs">Sources</span>
						</Link>
						<Separator className="col-span-2" />
						<div className="flex items-center justify-center col-span-2">
							<ThemeToggle />
						</div>
					</div>
					{/* Social Section - desktop only */}
					<div className="hidden sm:flex flex-col gap-2 items-center sm:items-start">
						<span className="font-semibold text-sm mb-1">
							Social
						</span>
						<div className="flex flex-row gap-2">
							<Link
								href="https://github.com/DanielButler1/AI-Stats"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="GitHub"
								className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
							>
								<Image
									src="/social/github_dark.svg"
									alt="GitHub"
									width={20}
									height={20}
									className="h-5 w-5 dark:block hidden"
								/>
								<Image
									src="/social/github_light.svg"
									alt="GitHub"
									width={20}
									height={20}
									className="h-5 w-5 block dark:hidden"
								/>
							</Link>
							<Link
								href="https://instagram.com/phaseoapp"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
								className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-pink-50 dark:hover:bg-pink-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
							>
								<Image
									src="/social/instagram.svg"
									alt="Instagram"
									width={20}
									height={20}
									className="h-5 w-5"
								/>
							</Link>
							<Link
								href="https://reddit.com/r/yourreddit"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Reddit"
								className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-orange-50 dark:hover:bg-orange-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
							>
								<Image
									src="/social/reddit.svg"
									alt="Reddit"
									width={20}
									height={20}
									className="h-5 w-5"
								/>
							</Link>
							<Link
								href="https://twitter.com/phaseoapp"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Twitter"
								className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
							>
								<Image
									src="/social/twitter_dark.svg"
									alt="Twitter"
									width={20}
									height={20}
									className="h-5 w-5 dark:block hidden"
								/>
								<Image
									src="/social/twitter_light.svg"
									alt="Twitter"
									width={20}
									height={20}
									className="h-5 w-5 block dark:hidden"
								/>
							</Link>
						</div>
					</div>
					{/* Support Section - desktop only */}
					<div className="hidden sm:flex flex-col gap-2 items-center">
						<span className="font-semibold text-sm mb-1 text-center">
							Support
						</span>
						<div className="flex flex-row gap-2">
							<Link
								href="https://coff.ee/phaseo"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Buy me a coffee"
								className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
							>
								<Image
									src="/social/bmc.svg"
									alt="Buy Me a Coffee"
									width={20}
									height={20}
									className="h-5 w-5"
								/>
							</Link>
							<Link
								href="https://discord.gg/zDw73wamdX"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Discord"
								className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
							>
								<Image
									src="/social/discord.svg"
									alt="Discord"
									width={20}
									height={20}
									className="h-5 w-5"
								/>
							</Link>
						</div>
					</div>
					{/* Other buttons row - desktop only */}
					<div className="hidden sm:flex flex-row gap-2 items-end justify-center sm:justify-end mt-4 sm:mt-0">
						{/* Contribute Button */}
						<div className="flex flex-col items-center">
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											href="contribute"
											rel="noopener noreferrer"
											aria-label="Contribute"
											className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
										>
											<FilePlus className="h-4 w-4" />
										</Link>
									</TooltipTrigger>
									<TooltipContent side="top" align="center">
										Contribute
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						{/* Sources Button */}
						<div className="flex flex-col items-center">
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											href="sources"
											aria-label="Sources"
											className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
										>
											<Book className="h-4 w-4" />
										</Link>
									</TooltipTrigger>
									<TooltipContent side="top" align="center">
										Sources
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						{/* Theme Toggle Button */}
						<div className="flex flex-col items-center">
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<span>
											<ThemeToggle />
										</span>
									</TooltipTrigger>
									<TooltipContent side="top" align="center">
										Toggle Theme
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
				</div>
				<hr className="border-t border-border" />
				<div className="flex flex-col items-center justify-center">
					<div className="text-center w-full px-4 sm:px-0">
						&copy; {currentYear} AI Stats
						<span className="block mt-1">
							If you run into any issues or notice any data
							errors, please visit our GitHub and report an issue.
						</span>
						<LastUpdated deployTime={deployTime} />
					</div>
				</div>
			</div>
		</footer>
	);
}
