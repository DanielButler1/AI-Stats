"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

import type { NavGroup, NavItem } from "./Sidebar.config";
import { SETTINGS_SIDEBAR } from "./Sidebar.config";

export default function SettingsSidebar() {
	const pathname = usePathname();

	const allItems: NavItem[] = SETTINGS_SIDEBAR.flatMap((g) => g.items);
	const activeItem =
		allItems.find(
			(item) =>
				!item.disabled &&
				!item.external &&
				(pathname === item.href ||
					pathname?.startsWith(item.href + "/"))
		) ?? null;

	const baseLinkClasses =
		"block w-full text-left px-3 py-2 rounded-md text-sm font-medium select-none transition-colors";

	function NavBlock({
		group,
		variant,
	}: {
		group: NavGroup;
		variant: "desktop" | "drawer";
	}) {
		return (
			<div>
				<div className="text-xs text-muted-foreground px-3 mb-2">
					{group.heading}
				</div>
				<ul className="space-y-1">
					{group.items.map((item) => (
						<li key={`${group.heading}-${item.href}`}>
							{renderNavItem(item, variant)}
						</li>
					))}
				</ul>
			</div>
		);
	}

	function renderNavItem(item: NavItem, variant: "desktop" | "drawer") {
		const active =
			!item.disabled &&
			!item.external &&
			(pathname === item.href || pathname?.startsWith(item.href + "/"));

		if (item.disabled) {
			return (
				<div
					role="link"
					aria-disabled="true"
					tabIndex={-1}
					className={cn(
						"cursor-not-allowed text-muted-foreground",
						"block w-full text-left px-3 py-2 rounded-md text-sm select-none transition-colors"
					)}
				>
					{item.label}
				</div>
			);
		}

		const classes = cn(
			baseLinkClasses,
			active
				? "bg-slate-100 dark:bg-zinc-800"
				: "hover:bg-slate-50 dark:hover:bg-zinc-900"
		);

		// External links: open in new tab + trailing icon
		const content = (
			<>
				<span className="truncate">{item.label}</span>
				{item.external && (
					<ExternalLink
						aria-hidden="true"
						className="ml-auto h-4 w-4 opacity-70"
					/>
				)}
			</>
		);

		if (item.external) {
			const anchor = (
				<a
					href={item.href}
					target="_blank"
					rel="noreferrer"
					className={cn(classes, "flex items-center gap-2")}
					aria-label={`${item.label} (opens in a new tab)`}
				>
					{content}
				</a>
			);
			// Close drawer when selecting an external item on mobile
			return variant === "drawer" ? (
				<DrawerClose asChild>{anchor}</DrawerClose>
			) : (
				anchor
			);
		}

		const link = (
			<Link
				href={item.href}
				aria-current={active ? "page" : undefined}
				className={cn(classes, "flex items-center gap-2")}
			>
				{content}
			</Link>
		);
		return variant === "drawer" ? (
			<DrawerClose asChild>{link}</DrawerClose>
		) : (
			link
		);
	}

	function renderNav(variant: "desktop" | "drawer") {
		return (
			<nav
				className={cn(
					"flex flex-col gap-0 py-4",
					variant === "desktop" ? "h-full" : undefined
				)}
			>
				{SETTINGS_SIDEBAR.map((group, idx) => (
					<div key={group.heading}>
						<NavBlock group={group} variant={variant} />
						{idx < SETTINGS_SIDEBAR.length - 1 && (
							<Separator className="my-4" />
						)}
					</div>
				))}
			</nav>
		);
	}

	return (
		<>
			{/* Mobile */}
			<div className="md:hidden">
				<Drawer>
					<DrawerTrigger asChild>
						<Button
							variant="outline"
							className="w-full justify-between"
							aria-haspopup="dialog"
						>
							<span>{activeItem?.label ?? "Settings"}</span>
							<ChevronDown
								className="h-4 w-4"
								aria-hidden="true"
							/>
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader className="px-4 pb-0">
							<DrawerTitle>Settings</DrawerTitle>
						</DrawerHeader>
						<div className="px-4 pb-6">{renderNav("drawer")}</div>
					</DrawerContent>
				</Drawer>
			</div>

			{/* Desktop */}
			<aside className="hidden md:block w-64 border-r pr-4">
				{renderNav("desktop")}
			</aside>
		</>
	);
}
