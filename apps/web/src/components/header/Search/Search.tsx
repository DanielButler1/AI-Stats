"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import {
	Loader2,
	Search as SearchIcon,
	Sparkles,
	ArrowUpRight,
} from "lucide-react";
import type {
	Props,
	ResultGroup,
	ApiSearchResponse,
	SearchResultItem,
} from "./Search.types";
import {
	MIN_SEARCH_CHARS,
	FETCH_DEBOUNCE_MS,
	curatedGroups,
} from "./Search.constants";
import { SearchItem } from "./SearchItem";

export default function Search({ className }: Props) {
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<ResultGroup[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [shortcutKeys, setShortcutKeys] = useState<string[]>(["Ctrl", "K"]);

	useEffect(() => {
		const isApple =
			typeof navigator !== "undefined" &&
			/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
		setShortcutKeys(isApple ? ["Cmd", "K"] : ["Ctrl", "K"]);
	}, []);

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			const mod = event.metaKey || event.ctrlKey;
			if (!mod) return;
			if (event.key.toLowerCase() === "k") {
				event.preventDefault();
				setOpen((value) => !value);
			}
		}

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	useEffect(() => {
		if (!open) {
			setQuery("");
			setResults([]);
			setLoading(false);
			setError(null);
		}
	}, [open]);

	useEffect(() => {
		const trimmed = query.trim();
		if (!open || trimmed.length < MIN_SEARCH_CHARS) {
			setLoading(false);
			setError(null);
			setResults([]);
			return;
		}

		const controller = new AbortController();
		let cancelled = false;

		setLoading(true);
		setError(null);

		const timeoutId = window.setTimeout(async () => {
			try {
				const response = await fetch(
					`/api/search?q=${encodeURIComponent(trimmed)}`,
					{
						signal: controller.signal,
					}
				);

				if (!response.ok) {
					throw new Error(
						`Search request failed (${response.status})`
					);
				}

				const payload = (await response.json()) as ApiSearchResponse;
				if (!cancelled) {
					const mappedGroups = (
						payload.groups ?? []
					).map<ResultGroup>((group) => ({
						type: group.type,
						label: group.label,
						items: group.items.map<SearchResultItem>((item) => ({
							...item,
							icon: item.icon,
						})),
					}));
					setResults(mappedGroups);
				}
			} catch (err) {
				if (controller.signal.aborted || cancelled) {
					return;
				}
				console.error("[search] request failed", err);
				setResults([]);
				setError(
					"We couldn't reach search just now. Please try again."
				);
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}, FETCH_DEBOUNCE_MS);

		return () => {
			cancelled = true;
			controller.abort();
			window.clearTimeout(timeoutId);
		};
	}, [open, query]);

	const handleSelect = (href: string) => {
		setOpen(false);
		router.push(href);
	};

	const hasQuery = query.trim().length >= MIN_SEARCH_CHARS;

	const groupsToRender: ResultGroup[] = hasQuery
		? [curatedGroups[0], ...results]
		: curatedGroups;

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className={cn(
					"hidden lg:flex h-9 w-full max-w-3xs items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-left text-sm text-zinc-500 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400 dark:hover:bg-zinc-900"
				)}
				aria-label="Open search"
			>
				<SearchIcon className="size-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
				<span className="flex-1 truncate">
					Search models, organisations, benchmarks...
				</span>
				<KbdGroup>
					{shortcutKeys.map((key) => (
						<Kbd key={key}>{key}</Kbd>
					))}
				</KbdGroup>
			</button>

			<button
				type="button"
				onClick={() => setOpen(true)}
				className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 dark:text-zinc-300 dark:hover:bg-zinc-800 lg:hidden"
				aria-label="Open search"
			>
				<SearchIcon className="size-5" />
			</button>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<DialogTitle className="sr-only">Search</DialogTitle>
				<CommandInput
					value={query}
					onValueChange={setQuery}
					placeholder="Search the database..."
					aria-label="Search catalogue"
				/>
				<CommandList className="min-h-[60vh] lg:min-h-[80vh] space-y-6">
					{!loading && !error
						? groupsToRender.map((group, index) => (
								<Fragment key={group.type}>
									<CommandGroup
										heading={group.label}
										className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 space-y-2 pt-6 pb-4"
									>
										<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
											{group.items
												.slice(0, 9)
												.map((item) => (
													<SearchItem
														key={`${group.type}-${item.id}`}
														item={item}
														onSelect={handleSelect}
													/>
												))}
										</div>
									</CommandGroup>
									{index < groupsToRender.length - 1 ? (
										<CommandSeparator />
									) : null}
								</Fragment>
						  ))
						: null}

					<CommandEmpty className="py-12">
						{loading ? (
							<div className="flex flex-col items-center gap-3">
								<div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
									<Loader2 className="size-6 animate-spin text-zinc-500" />
								</div>
								<div className="text-center">
									<p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
										Searching...
									</p>
									<p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
										Finding the best matches
									</p>
								</div>
							</div>
						) : error ? (
							<div className="flex flex-col items-center gap-3">
								<div className="size-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
									<SearchIcon className="size-6 text-red-600 dark:text-red-400" />
								</div>
								<div className="text-center">
									<p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
										Search temporarily unavailable
									</p>
									<p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
										{error}
									</p>
								</div>
							</div>
						) : hasQuery ? (
							<div className="flex flex-col items-center gap-3">
								<div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
									<SearchIcon className="size-6 text-zinc-400" />
								</div>
								<div className="text-center">
									<p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
										No results found
									</p>
									<p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
										Try different keywords or check your
										spelling
									</p>
								</div>
							</div>
						) : (
							<div className="flex flex-col items-center gap-3">
								<div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
									<Sparkles className="size-6 text-zinc-400" />
								</div>
								<div className="text-center">
									<p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
										Start typing to search
									</p>
									<p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
										Search for models, organisations,
										benchmarks, and more
									</p>
								</div>
							</div>
						)}
					</CommandEmpty>
				</CommandList>
			</CommandDialog>
		</div>
	);
}
