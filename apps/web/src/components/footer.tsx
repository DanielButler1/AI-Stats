import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import {
	FilePlus,
	Book,
	Milestone,
	Hammer,
	FileText,
	ShieldCheck,
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import LastUpdated from "@/components/last-updated";
import { Separator } from "@/components/ui/separator";
import { withUTM } from "@/lib/utm";

const currentYear = new Date().getFullYear();
const deployTime = process.env.NEXT_PUBLIC_DEPLOY_TIME ?? "";

const externalLinks = {
	discord: withUTM("https://discord.gg/zDw73wamdX", {
		campaign: "footer-social",
		content: "discord",
	}),
	github: withUTM("https://github.com/DanielButler1/AI-Stats", {
		campaign: "footer-social",
		content: "github",
	}),
	insta: withUTM("https://instagram.com/ai__stats", {
		campaign: "footer-social",
		content: "instagram",
	}),
	reddit: withUTM("https://reddit.com/r/AIStats/", {
		campaign: "footer-social",
		content: "reddit",
	}),
	x: withUTM("https://x.com/ai_stats_team", {
		campaign: "footer-social",
		content: "x",
	}),
};

export default function Footer() {
	return (
		<footer className="w-full border-t border-border mt-auto bg-white dark:bg-zinc-950 px-4">
			<div className="container mx-auto py-4 text-xs text-muted-foreground flex flex-col gap-4">
				<div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-6">
					{/* Mobile grid with icon and text for all actions */}
					<div className="grid grid-cols-2 gap-3 sm:hidden mb-4">
						{/* --- Social --- */}
						<div className="col-span-2 font-semibold text-sm">
							Social
						</div>
						{/* Social: Discord */}
						<Link
							href={externalLinks.discord}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Discord"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors gap-2"
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
						{/* Social: GitHub */}
						<Link
							href={externalLinks.github}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="GitHub"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors gap-2"
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
							href={externalLinks.insta}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Instagram"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors gap-2"
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
							href={externalLinks.reddit}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Reddit"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors gap-2"
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
						{/* Social: X */}
						<Link
							href={externalLinks.x}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="X"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors gap-2"
						>
							<Image
								src="/social/x_dark.svg"
								alt="X Logo"
								width={20}
								height={20}
								className="h-5 w-5 dark:block hidden"
							/>
							<Image
								src="/social/x_light.svg"
								alt="X Logo"
								width={20}
								height={20}
								className="h-5 w-5 block dark:hidden"
							/>
							<span className="text-xs">X</span>
						</Link>

						<Separator className="col-span-2" />

						{/* --- Explore --- */}
						<div className="col-span-2 font-semibold text-sm">
							Explore
						</div>
						{/* Docs - mobile */}
						<Link
							href="https://docs.ai-stats.phaseo.app"
							aria-label="Documentation"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors gap-2"
						>
							<Book className="h-5 w-5" />
							<span className="text-xs">Docs</span>
						</Link>
						{/* Roadmap - mobile */}
						<Link
							href="/roadmap"
							aria-label="Roadmap"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors gap-2"
						>
							<Milestone className="h-5 w-5" />
							<span className="text-xs">Roadmap</span>
						</Link>
						{/* Tools - mobile */}
						<Link
							href="/tools"
							aria-label="Tools"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors gap-2"
						>
							<Hammer className="h-5 w-5" />
							<span className="text-xs">Tools</span>
						</Link>
						{/* Wrapped - mobile (coming soon) */}
						<button
							aria-label="Coming Christmas 2025"
							disabled
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 opacity-60 cursor-not-allowed transition-colors gap-2"
						>
							<span className="inline-block" aria-hidden>
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="opacity-80"
								>
									<path
										d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<circle
										cx="12"
										cy="12"
										r="2"
										stroke="currentColor"
										strokeWidth="1.2"
									/>
								</svg>
							</span>
							<span className="text-xs">
								Coming Christmas 2025
							</span>
						</button>

						<Separator className="col-span-2" />

						{/* --- Actions --- */}
						<div className="col-span-2 font-semibold text-sm">
							Actions
						</div>
						{/* Contribute */}
						<Link
							href="/contribute"
							aria-label="Contribute"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover=g-zinc-900 transition-colors gap-2"
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

						{/* --- Legal --- */}
						<div className="col-span-2 font-semibold text-sm">
							Legal
						</div>
						<Link
							href="/terms"
							aria-label="Terms of Service"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors gap-2"
						>
							<FileText className="h-5 w-5" />
							<span className="text-xs">Terms</span>
						</Link>
						<Link
							href="/privacy"
							aria-label="Privacy Policy"
							className="flex items-center justify-center h-12 rounded-lg border border-border bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors gap-2"
						>
							<ShieldCheck className="h-5 w-5" />
							<span className="text-xs">Privacy</span>
						</Link>

						<Separator className="col-span-2" />

						{/* Theme */}
						<div className="col-span-2 flex items-center justify-center">
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										{/* Outer span is the trigger so tooltip still appears; inner span disables interaction */}
										<span className="cursor-default">
											<span
												className="pointer-events-none opacity-50"
												aria-hidden="true"
											>
												<ThemeToggle />
											</span>
										</span>
									</TooltipTrigger>
									<TooltipContent side="top" align="center">
										Dark Mode Coming Soon!
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>

					{/* --- Desktop: Social --- */}
					<div className="hidden sm:flex flex-col gap-2 items-center sm:items-start">
						<span className="font-semibold text-sm mb-1">
							Social
						</span>
						<div className="flex flex-row gap-2">
							<Link
								href={externalLinks.discord}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Discord"
								className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/40 focus:outline-hidden focus:ring-2 focus:ring-primary"
							>
								<Image
									src="/social/discord.svg"
									alt="Discord"
									width={20}
									height={20}
									className="h-5 w-5"
								/>
							</Link>
							<Link
								href={externalLinks.github}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="GitHub"
								className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-primary"
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
								href={externalLinks.insta}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
								className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-pink-100 dark:hover:bg-pink-900/40 focus:outline-hidden focus:ring-2 focus:ring-primary"
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
								href={externalLinks.reddit}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Reddit"
								className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-orange-100 dark:hover:bg-orange-900/40 focus:outline-hidden focus:ring-2 focus:ring-primary"
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
								href={externalLinks.x}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="X"
								className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-primary"
							>
								<Image
									src="/social/x_dark.svg"
									alt="X"
									width={20}
									height={20}
									className="h-5 w-5 dark:block hidden"
								/>
								<Image
									src="/social/x_light.svg"
									alt="X"
									width={20}
									height={20}
									className="h-5 w-5 block dark:hidden"
								/>
							</Link>
						</div>
					</div>

					{/* --- Desktop: Explore (Docs + Roadmap + Wrapped) --- */}
					{/* <div className="hidden sm:flex flex-col items-center justify-center"> */}
					<div className="hidden sm:flex flex-col gap-2 items-center">
						<span className="font-semibold text-sm mb-2">
							Explore
						</span>
						<div className="flex items-center gap-2">
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											href="https://docs.ai-stats.phaseo.app"
											aria-label="Documentation"
											className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
										>
											<Book className="h-4 w-4 text-primary" />
										</Link>
									</TooltipTrigger>
									<TooltipContent side="top" align="center">
										Docs
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											href="/roadmap"
											aria-label="Roadmap"
											className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
										>
											<Milestone className="h-4 w-4 text-primary" />
										</Link>
									</TooltipTrigger>
									<TooltipContent side="top" align="center">
										Roadmap
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											href="/tools"
											aria-label="Tools"
											className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
										>
											<Hammer className="h-4 w-4 text-primary" />
										</Link>
									</TooltipTrigger>
									<TooltipContent side="top" align="center">
										Tools
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="cursor-default">
											<button
												aria-label="Coming Christmas 2025"
												disabled
												className="h-9 w-9 text-primary rounded-full border border-border flex items-center justify-center opacity-60 cursor-not-allowed bg-white dark:bg-zinc-950"
											>
												<span
													className="inline-block"
													aria-hidden
												>
													<svg
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
														className="opacity-80"
													>
														<path
															d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
															stroke="currentColor"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<circle
															cx="12"
															cy="12"
															r="2"
															stroke="currentColor"
															strokeWidth="1.2"
														/>
													</svg>
												</span>
											</button>
										</span>
									</TooltipTrigger>
									<TooltipContent side="top" align="center">
										Coming Christmas 2025
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>

					{/* --- Desktop: Actions (Contribute, Sources, Theme) --- */}
					<div className="hidden sm:flex flex-col gap-2 items-center justify-center">
						<span className="font-semibold text-sm mb-2">
							Actions
						</span>
						<div className="flex flex-row gap-2">
							{/* Contribute */}
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											href="/contribute"
											rel="noopener noreferrer"
											aria-label="Contribute"
											className="h-9 w-9 text-primary rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
										>
											<FilePlus className="h-4 w-4" />
										</Link>
									</TooltipTrigger>
									<TooltipContent side="top" align="center">
										Contribute
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							{/* Sources */}
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											href="/sources"
											aria-label="Sources"
											className="h-9 w-9 text-primary rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
										>
											<Book className="h-4 w-4" />
										</Link>
									</TooltipTrigger>
									<TooltipContent side="top" align="center">
										Sources
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							{/* Theme */}
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										{/* Outer span is the trigger; inner span disables interaction */}
										<span className="cursor-default">
											<span
												className="pointer-events-none opacity-50"
												aria-hidden="true"
											>
												<ThemeToggle />
											</span>
										</span>
									</TooltipTrigger>
									<TooltipContent side="top" align="center">
										Dark Mode Coming Soon!
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
					{/* --- Desktop: Legal --- */}
					<div className="hidden sm:flex flex-col gap-2 items-end justify-center">
						<span className="font-semibold text-sm mb-2">
							Legal
						</span>
						<div className="flex flex-row gap-2">
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											href="/terms"
											aria-label="Terms of Service"
											className="h-9 w-9 text-primary rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
										>
											<FileText className="h-4 w-4 text-primary" />
										</Link>
									</TooltipTrigger>
									<TooltipContent side="top" align="center">
										Terms
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											href="/privacy"
											aria-label="Privacy Policy"
											className="h-9 w-9 text-primary rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
										>
											<ShieldCheck className="h-4 w-4 text-primary" />
										</Link>
									</TooltipTrigger>
									<TooltipContent side="top" align="center">
										Privacy
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
