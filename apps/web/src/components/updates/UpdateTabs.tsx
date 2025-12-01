"use client";
import Link from "next/link";
import { UPDATE_TAB_ORDER, type UpdateTabId } from "@/lib/content/updates";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const TAB_LABELS: Record<UpdateTabId, string> = {
	overview: "Overview",
	models: "Model Updates",
	web: "Web",
	youtube: "YouTube",
	calendar: "Model Calendar",
};

export default function UpdateTabs() {
	const pathname = usePathname() || "/updates";

	const activeCategory =
		UPDATE_TAB_ORDER.find(
			(cat) =>
				pathname === `/updates/${cat}` ||
				(cat === "overview" && pathname === "/updates")
		) || "overview";

	return (
		<>
			{/* Desktop */}
			<div className="hidden md:flex gap-4 border-b mb-4 mt-6">
				{UPDATE_TAB_ORDER.map((category) => {
					const isActive = activeCategory === category;
					return (
						<Link
							key={category}
							href={
								category === "overview"
									? "/updates"
									: `/updates/${category}`
							}
							prefetch={false}
							className={`pb-2 px-2 font-medium transition-colors duration-150 ${
								isActive
									? "border-b-2 border-muted-foreground text-primary"
									: "border-b-2 border-transparent text-foreground hover:text-primary"
							}`}
						>
							{TAB_LABELS[category]}
						</Link>
					);
				})}
			</div>

			{/* Mobile */}
			<div className="md:hidden mb-4 mt-6">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="w-full p-2 border rounded text-base bg-background text-foreground flex justify-between items-center">
							{TAB_LABELS[activeCategory]}
							<ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-full">
						{UPDATE_TAB_ORDER.map((category) => (
							<DropdownMenuItem key={category} asChild>
								<Link
									href={
										category === "overview"
											? "/updates"
											: `/updates/${category}`
									}
								>
									{TAB_LABELS[category]}
								</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	);
}
