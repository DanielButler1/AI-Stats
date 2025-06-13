import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Coffee, Github, FilePlus, Book } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import LastUpdated from "@/components/last-updated";

const currentYear = new Date().getFullYear();
const deployTime = process.env.NEXT_PUBLIC_DEPLOY_TIME ?? "";

export default function Footer() {
	return (
		<footer className="w-full border-t border-border mt-auto bg-white dark:bg-zinc-950 relative">
			<div className="container mx-auto py-4 text-xs text-muted-foreground relative flex flex-col sm:flex-row items-center sm:items-center justify-between gap-2 sm:gap-0">
				<div className="order-1 sm:order-2 w-full sm:w-auto flex justify-center sm:justify-end mb-2 sm:mb-0 sm:ml-4">
					<div className="flex flex-row gap-2">
						<TooltipProvider delayDuration={0}>
							<Tooltip>
								<TooltipTrigger asChild>
									<a
										href="https://coff.ee/phaseo"
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Buy me a coffee"
										className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<Coffee className="h-4 w-4" />
									</a>
								</TooltipTrigger>
								<TooltipContent side="top" align="center">
									Buy Me a Coffee
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<TooltipProvider delayDuration={0}>
							<Tooltip>
								<TooltipTrigger asChild>
									<a
										href="https://discord.gg/zDw73wamdX"
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Discord"
										className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<Image
											src="/discord.svg"
											alt="Discord"
											width={20}
											height={20}
											className="h-5 w-5"
										/>
									</a>
								</TooltipTrigger>
								<TooltipContent side="top" align="center">
									Discord
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<TooltipProvider delayDuration={0}>
							<Tooltip>
								<TooltipTrigger asChild>
									<a
										href="https://github.com/DanielButler1/AI-Stats"
										target="_blank"
										rel="noopener noreferrer"
										aria-label="GitHub"
										className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<Github className="h-4 w-4" />
									</a>
								</TooltipTrigger>
								<TooltipContent side="top" align="center">
									GitHub
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<TooltipProvider delayDuration={0}>
							<Tooltip>
								<TooltipTrigger asChild>
									<a
										href="/contribute"
										rel="noopener noreferrer"
										aria-label="Contribute"
										className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<FilePlus className="h-4 w-4" />
									</a>
								</TooltipTrigger>
								<TooltipContent side="top" align="center">
									Contribute
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<TooltipProvider delayDuration={0}>
							<Tooltip>
								<TooltipTrigger asChild>
									<a
										href="/sources"
										aria-label="Sources"
										className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<Book className="h-4 w-4" />
									</a>
								</TooltipTrigger>
								<TooltipContent side="top" align="center">
									Sources
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
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
				<div className="flex-1 flex justify-start order-2 sm:order-1 w-full sm:w-auto">
					<div className="text-left w-full px-4 sm:px-0">
						&copy; {currentYear} AI Stats{" "}
						<span className="block mt-1">
							Contributions welcome! If you find any issues or
							errors, please visit our GitHub and report an issue.
						</span>
						<LastUpdated deployTime={deployTime} />
					</div>
				</div>
			</div>
		</footer>
	);
}
