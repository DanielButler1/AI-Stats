"use client";

import { useQueryState } from "nuqs";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ExtendedModel, SubscriptionPlans } from "@/data/types";
import ModelOverview from "@/components/model/overview/ModelOverview";
import ModelBenchmarksComparison from "@/components/model/benchmarks/ModelBenchmarksComparison";
import ModelReleaseTimeline from "@/components/model/ModelReleaseTimeline";
import ModelAPI from "@/components/model/overview/ModelAPI";
import ModelAPIProviders from "@/components/model/api_providers/ModelAPIProviders";
import ModelInProducts from "@/components/model/ModelInProducts";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ModelTabsProps {
	model: ExtendedModel;
	models: ExtendedModel[];
	subscriptionPlans: SubscriptionPlans[];
}

const tabs = [
	{ label: "Overview", key: "overview" },
	{ label: "Timeline", key: "timeline" },
	{ label: "Benchmarks", key: "benchmarks" },
	{ label: "Availability & Pricing", key: "pricing" },
	{ label: "Gateway", key: "gateway" },
];

export default function ModelTabs({
	model,
	models,
	subscriptionPlans,
}: ModelTabsProps) {
	const [activeTab, setActiveTab] = useQueryState("tab", {
		defaultValue: "overview",
	});

	return (
		<div className="w-full mt-6">
			{/* Desktop Tabs */}
			<div className="hidden md:flex gap-4 border-b mb-4">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						className={`pb-2 px-2 font-medium transition-colors duration-150 cursor-pointer ${
							activeTab === tab.key
								? "border-b-2 border-primary text-primary"
								: "border-b-2 border-transparent text-muted-foreground hover:text-primary"
						}`}
						onClick={() => setActiveTab(tab.key)}
						type="button"
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Mobile DropdownMenu */}
			<div className="md:hidden mb-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="w-full p-2 border rounded text-base bg-background text-foreground flex justify-between items-center">
							{tabs.find((tab) => tab.key === activeTab)?.label ||
								"Select"}
							<ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-full">
						{tabs.map((tab) => (
							<DropdownMenuItem
								key={tab.key}
								onSelect={() => setActiveTab(tab.key)}
								className={
									activeTab === tab.key
										? "bg-zinc-100 dark:bg-zinc-800 font-semibold"
										: ""
								}
							>
								{tab.label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div>
				{activeTab === "overview" && <ModelOverview model={model} />}
				{activeTab === "benchmarks" && (
					<ModelBenchmarksComparison
						model={model}
						allModels={models}
					/>
				)}
				{activeTab === "timeline" && (
					<ModelReleaseTimeline model={model} allModels={models} />
				)}
				{activeTab === "pricing" && (
					<div className="space-y-8">
						<div>
							<ModelInProducts
								model={model}
								plans={subscriptionPlans}
							/>
						</div>
						<div>
							<ModelAPIProviders model={model} />
						</div>
					</div>
				)}
				{activeTab === "gateway" && <ModelAPI />}
			</div>
		</div>
	);
}
