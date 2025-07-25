"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bot, Coffee, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Drawer, DrawerTrigger, DrawerContent } from "./ui/drawer";
import Image from "next/image";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";
import React from "react";
import { Separator } from "./ui/separator";

export default function Header() {
	const pathname = usePathname();

	const navLinks = (
		<>
			<Button asChild variant={"ghost"} className="text-md rounded-full">
				<Link
					href="/"
					className={cn(
						"text-sm font-medium transition-colors hover:text-primary",
						pathname === "/"
							? "text-blue-500 !font-bold"
							: "text-muted-foreground"
					)}
				>
					Leaderboard
				</Link>
			</Button>
			<Button asChild variant={"ghost"} className="text-md rounded-full">
				<Link
					href="/compare"
					className={cn(
						"text-sm font-medium transition-colors hover:text-primary",
						pathname.startsWith("/compare")
							? "text-blue-500 !font-bold"
							: "text-muted-foreground"
					)}
				>
					Comparisons
				</Link>
			</Button>
			<Button asChild variant={"ghost"} className="text-md rounded-full">
				<Link
					href="/providers"
					className={cn(
						"text-sm font-medium transition-colors hover:text-primary",
						pathname.startsWith("/providers")
							? "text-blue-500 !font-bold"
							: "text-muted-foreground"
					)}
				>
					Providers
				</Link>
			</Button>
			<Button asChild variant={"ghost"} className="text-md rounded-full">
				<Link
					href="/models"
					className={cn(
						"text-sm font-medium transition-colors hover:text-primary",
						pathname.startsWith("/models")
							? "text-blue-500 !font-bold"
							: "text-muted-foreground"
					)}
				>
					Models
				</Link>
			</Button>
			<Button asChild variant={"ghost"} className="text-md rounded-full">
				<Link
					href="/benchmarks"
					className={cn(
						"text-sm font-medium transition-colors hover:text-primary",
						pathname.startsWith("/benchmarks")
							? "text-blue-500 !font-bold"
							: "text-muted-foreground"
					)}
				>
					Benchmarks
				</Link>
			</Button>
			<Button asChild variant={"ghost"} className="text-md rounded-full">
				<Link
					href="/prices"
					className={cn(
						"text-sm font-medium transition-colors hover:text-primary",
						pathname.startsWith("/prices")
							? "text-blue-500 !font-bold"
							: "text-muted-foreground"
					)}
				>
					Prices
				</Link>
			</Button>
		</>
	);

	return (
		<>
			<header className="border-b sticky top-0 bg-white dark:bg-zinc-950 z-50">
				<div className="container mx-auto py-4 px-4">
					<div className="relative flex items-center justify-between">
						{/* Title: left on desktop, centered on mobile */}
						<Link
							href="/"
							className="flex items-center text-3xl font-bold mb-0 w-full md:w-auto text-center md:text-left group"
						>
							<Bot className="h-8 w-8 mr-2 group-hover:text-blue-500 transition-colors" />
							<span>AI Stats</span>
						</Link>

						{/* Desktop nav links: centered */}
						<nav className="hidden xl:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-6">
							{navLinks}
						</nav>

						{/* Desktop Github, Discord, BMAC: right-aligned */}
						<div className="hidden xl:flex items-center ml-auto gap-4">
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<a
											href="https://github.com/DanielButler1/AI-Stats"
											target="_blank"
											rel="noopener noreferrer"
											aria-label="Github"
											className="h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary"
										>
											<Github className="h-5 w-5" />
										</a>
									</TooltipTrigger>
									<TooltipContent side="top" align="center">
										Github
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
						</div>

						{/* Hamburger, right-aligned, only on mobile */}
						<div className="xl:hidden absolute right-0">
							<Drawer>
								<DrawerTrigger asChild>
									<Button variant="ghost" size="icon">
										<Menu className="h-6 w-6" />
										<span className="sr-only">
											Open menu
										</span>
									</Button>
								</DrawerTrigger>
								<DrawerContent>
									<div className="pt-4">
										<nav className="flex flex-col gap-2 px-6 pb-4">
											{navLinks}
										</nav>{" "}
										<div className="px-6 py-4 mt-auto border-t">
											<div className="flex justify-between items-center">
												<a
													href="https://discord.gg/zDw73wamdX"
													target="_blank"
													rel="noopener noreferrer"
													aria-label="Join our Discord"
													className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
												>
													<Image
														src="/discord.svg"
														alt="Discord"
														width={16}
														height={16}
														className="h-4 w-4"
													/>
													<span>
														Join our Discord
													</span>
												</a>
												<a
													href="https://coff.ee/phaseo"
													target="_blank"
													rel="noopener noreferrer"
													aria-label="Buy me a coffee"
													className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
												>
													<span>Buy Me a Coffee</span>
													<Coffee className="h-4 w-4" />
												</a>
											</div>
										</div>
									</div>
								</DrawerContent>
							</Drawer>
						</div>
					</div>
				</div>
			</header>
			{/* Support banner: visible on all screen sizes */}
			<div className="bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-200 text-center py-1 text-xs border-b dark:border-zinc-800 flex justify-center items-center">
				<div className="flex items-center gap-0 mx-auto">
					<Link
						href="https://github.com/DanielButler1/AI-Stats"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1 text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary font-medium transition-colors duration-200 px-2"
					>
						<Github className="h-4 w-4" />
						Github Repo
					</Link>
					<Separator
						orientation="vertical"
						className="mx-2 h-4 w-px bg-gray-300 dark:bg-zinc-700"
					/>
					<Link
						href="https://coff.ee/phaseo"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1 text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary font-medium transition-colors duration-200 px-2"
					>
						Buy Me A Coffee
						<Coffee className="h-4 w-4 transition-transform duration-300 group-hover:scale-125 group-hover:drop-shadow-md group-hover:animate-coffee-wiggle" />
					</Link>
				</div>
			</div>
		</>
	);
}
