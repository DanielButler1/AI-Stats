"use client";

import React from "react";
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

const tabs = [
	{ label: "Overview", key: "overview" },
	{ label: "Features", key: "features" },
	{ label: "Models", key: "models" },
];

export default function SubscriptionPlanTabs({ planId }: { planId: string }) {
	const pathname = usePathname();
	const pathnameSegments = pathname
		? pathname.split("/").filter(Boolean)
		: [];
	const lastSegment = pathnameSegments[pathnameSegments.length - 1];
	const activeKey = lastSegment
		? lastSegment === planId
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
							? `/subscription-plans/${planId}`
							: `/subscription-plans/${planId}/${t.key}`;
					const isActive = activeKey === t.key;
					return (
						<Link
							key={t.key}
							href={href}
							prefetch={false}
							className={`pb-2 px-2 font-medium transition-colors duration-150 ${
								isActive
									? "border-b-2 border-primary text-primary"
									: "border-b-2 border-transparent text-muted-foreground hover:text-primary"
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
						<Button className="w-full p-2 border rounded text-base bg-background text-foreground flex justify-between items-center">
							{tabs.find((t) => t.key === activeKey)?.label ??
								"Overview"}
							<ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-full">
						{tabs.map((t) => (
							<DropdownMenuItem key={t.key} asChild>
								<Link
									href={
										t.key === "overview"
											? `/subscription-plans/${planId}`
											: `/subscription-plans/${planId}/${t.key}`
									}
								>
									{t.label}
								</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	);
}