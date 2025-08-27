"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import React from "react";
import SearchPopover from "./SearchPopover";
import { ExtendedModel } from "@/data/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
	aggregateData: ExtendedModel[];
}

export default function HeaderClient({ aggregateData }: HeaderProps) {
	const pathname = usePathname();

	const navLinks = (
		<>
			<Button asChild variant={"ghost"} className="text-md rounded-full">
				<Link
					href="/"
					className={cn(
						"text-sm font-medium transition-colors hover:text-primary",
						pathname === "/"
							? "text-blue-500 font-bold!"
							: "text-muted-foreground"
					)}
				>
					Home
				</Link>
			</Button>
			<Button asChild variant={"ghost"} className="text-md rounded-full">
				<Link
					href="/compare"
					className={cn(
						"text-sm font-medium transition-colors hover:text-primary",
						pathname.startsWith("/compare")
							? "text-blue-500 font-bold!"
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
							? "text-blue-500 font-bold!"
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
							? "text-blue-500 font-bold!"
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
							? "text-blue-500 font-bold!"
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
							? "text-blue-500 font-bold!"
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
							<Bot className="h-8 w-8 mr-2" />
							<span>AI Stats</span>
						</Link>

						{/* Desktop nav links: left-aligned next to title */}
						<nav className="hidden xl:flex gap-6 ml-8">
							{navLinks}
						</nav>

						{/* Desktop Search */}
						<div className="hidden xl:flex items-center ml-auto gap-4">
							<SearchPopover aggregateData={aggregateData} />
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Avatar>
										<AvatarFallback>
											<User className="h-4 w-4 text-muted-foreground" />
										</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent sideOffset={4} align="end">
									<DropdownMenuItem>Profile</DropdownMenuItem>
									<DropdownMenuItem>
										Settings
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										Sign Out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
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
										</nav>
										<div className="px-6 py-4 mt-auto border-t">
											<Button
												variant="ghost"
												className="w-full"
											>
												Sign In
											</Button>
										</div>
									</div>
								</DrawerContent>
							</Drawer>
						</div>
					</div>
				</div>
			</header>
		</>
	);
}
