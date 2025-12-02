"use client";

import { CommandItem, CommandShortcut } from "@/components/ui/command";
import { Logo } from "@/components/Logo";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { ICON_MAP } from "./Search.constants";
import type { SearchResultItem } from "./Search.types";

interface SearchItemProps {
	item: SearchResultItem;
	onSelect: (href: string) => void;
}

export function SearchItem({ item, onSelect }: SearchItemProps) {
	const Icon = ICON_MAP[item.icon];

	return (
		<CommandItem
			key={`${item.id}`}
			value={item.href}
			onSelect={() => onSelect(item.href)}
			className="h-auto items-start gap-3 rounded-lg border border-zinc-200 bg-white/80 p-3 hover:border-zinc-300 hover:bg-zinc-50/80 focus:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/60"
		>
			<SearchItemIcon item={item} />
			<div className="flex flex-1 flex-col gap-1 min-w-0">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
						{item.title}
					</span>
					{item.badge && (
						<span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
							<Sparkles className="size-3" />
							{item.badge}
						</span>
					)}
				</div>
				{item.subtitle && (
					<span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
						{item.subtitle}
					</span>
				)}
			</div>
			<CommandShortcut className="text-[10px] text-zinc-400 dark:text-zinc-500">
				<ArrowUpRight className="size-4" />
			</CommandShortcut>
		</CommandItem>
	);
}

function SearchItemIcon({ item }: { item: SearchResultItem }) {
	const Icon = ICON_MAP[item.icon];

	if (item.flagIso) {
		return (
			<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
				<img
					src={`/flags/${item.flagIso}.svg`}
					alt={item.title}
					className="h-8 w-8 object-contain"
				/>
			</div>
		);
	}

	if (item.leftLogoId && item.rightLogoId) {
		return (
			<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
				<div className="relative w-full h-full">
					<Logo
						id={item.leftLogoId}
						alt={`${item.title} left`}
						width={16}
						height={16}
						className="absolute top-0 left-0 h-6 w-6 object-contain text-zinc-900 dark:text-zinc-50"
						unoptimized
					/>
					<Logo
						id={item.rightLogoId}
						alt={`${item.title} right`}
						width={16}
						height={16}
						className="absolute bottom-0 right-0 h-6 w-6 object-contain text-zinc-900 dark:text-zinc-50"
						unoptimized
					/>
				</div>
			</div>
		);
	}

	if (item.logoId) {
		return (
			<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
				<Logo
					id={item.logoId}
					alt={item.title}
					width={32}
					height={32}
					className="h-8 w-8 object-contain"
					fallback={
						<Icon className="size-5 text-zinc-600 dark:text-zinc-300" />
					}
				/>
			</div>
		);
	}

	return (
		<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
			<Icon className="size-5 text-zinc-600 dark:text-zinc-300" />
		</div>
	);
}
