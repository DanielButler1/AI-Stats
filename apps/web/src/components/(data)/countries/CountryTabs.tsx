"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tabs = [
	{ label: "Overview", key: "overview" },
	{ label: "Models", key: "models" },
	{ label: "Trends", key: "trends" },
];

interface CountryTabsProps {
	iso: string;
}

export default function CountryTabs({ iso }: CountryTabsProps) {
	const pathname = usePathname();
	const segments = pathname ? pathname.split("/").filter(Boolean) : [];
	const lastSegment = segments[segments.length - 1];
	const activeKey =
		!lastSegment || lastSegment === iso.toLowerCase() ? "overview" : lastSegment;

	const hrefFor = (key: string) =>
		key === "overview"
			? `/countries/${iso.toLowerCase()}`
			: `/countries/${iso.toLowerCase()}/${key}`;

	return (
		<>
			<div className="hidden gap-4 border-b pb-1 md:flex">
				{tabs.map((tab) => {
					const isActive = activeKey === tab.key;
					return (
						<Link
							key={tab.key}
							href={hrefFor(tab.key)}
							className={`pb-2 px-2 text-sm font-semibold transition-colors ${
								isActive
									? "border-b-2 border-primary text-primary"
									: "border-b-2 border-transparent text-muted-foreground hover:text-primary"
							}`}
						>
							{tab.label}
						</Link>
					);
				})}
			</div>

			<div className="md:hidden">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="group flex w-full items-center justify-between rounded-xl border px-3 py-2 text-base">
							{tabs.find((tab) => tab.key === activeKey)?.label ?? "Overview"}
							<ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-(--radix-popper-anchor-width)"
					>
						{tabs.map((tab) => (
							<DropdownMenuItem key={tab.key} asChild>
								<Link href={hrefFor(tab.key)}>{tab.label}</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	);
}
