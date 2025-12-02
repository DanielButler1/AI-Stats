// components/(data)/benchmark/BenchmarkTabs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const tabs = [{ label: "Overview", key: "overview" }];

export default function TabBar({ benchmarkId }: { benchmarkId: string }) {
	const pathname = usePathname();
	const pathnameSegments = pathname
		? pathname.split("/").filter(Boolean)
		: [];
	const lastSegment = pathnameSegments[pathnameSegments.length - 1];
	const activeKey = lastSegment
		? lastSegment === benchmarkId
			? "overview"
			: lastSegment
		: "overview";

	return (
		<>
			{/* Desktop */}
			<div className="hidden md:flex gap-4 border-b mb-4">
				{tabs.map((t) => {
					const href =
						t.key === "overview"
							? `/benchmarks/${benchmarkId}`
							: `/benchmarks/${benchmarkId}/${t.key}`;
					const isActive = activeKey === t.key;
					return (
						<Link
							key={t.key}
							href={href}
							className={`pb-2 text-sm font-medium transition-colors hover:text-foreground ${
								isActive
									? "border-b-2 border-foreground text-foreground"
									: "text-muted-foreground"
							}`}
						>
							{t.label}
						</Link>
					);
				})}
			</div>

			{/* Mobile */}
			<div className="md:hidden mb-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="group w-full justify-between"
						>
							{tabs.find((t) => t.key === activeKey)?.label ??
								"Overview"}
							<ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-(--radix-popper-anchor-width)"
					>
						{tabs.map((t) => {
							const href =
								t.key === "overview"
									? `/benchmarks/${benchmarkId}`
									: `/benchmarks/${benchmarkId}/${t.key}`;
							return (
								<DropdownMenuItem key={t.key} asChild>
									<Link href={href} className="w-full">
										{t.label}
									</Link>
								</DropdownMenuItem>
							);
						})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	);
}
