"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import MainCard from "./MainCard";
import PopularComparisons from "./PopularComparisons";
import ComparisonDisplay from "./ComparisonDisplay";
import { ExtendedModel } from "@/data/types";

export default function CompareDashboard({
	models,
}: {
	models: ExtendedModel[];
}) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const selected = searchParams.getAll("models");

	const [showComparison, setShowComparison] = useState(false);

	const setSelected = (ids: string[]) => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("models");
		ids.forEach((id) => params.append("models", id));
		router.replace(`?${params.toString()}`);
	};

	const selectedModels = models.filter(
		(m) => selected.includes(m.id) || selected.includes(m.name)
	);

	if (selected.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh]">
				<MainCard
					models={models}
					selected={selected}
					setSelected={setSelected}
					selectedModels={selectedModels}
					setShowComparison={setShowComparison}
				/>
				<Separator className="my-8 w-full max-w-4xl" />
				<PopularComparisons />
			</div>
		);
	}

	return <ComparisonDisplay selectedModels={selectedModels} />;
}
