"use client";

import SoTAModel from "@/components/homePage/SoTAModels";
import PerformanceTrendChart from "@/components/homePage/PerformanceTrendChart";
import KeyInsights from "@/components/homePage/KeyInsights";
import RecentModels from "@/components/homePage/ModelUpdates";
import TableWrapper from "@/components/homePage/table/TableWrapper";
import Header from "@/components/header";
import type { ExtendedModel } from "@/data/types";

interface HomePageProps {
	models: ExtendedModel[];
}

export default function HomePage({ models }: HomePageProps) {
	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<section className="py-4 container mx-auto px-4">
				<SoTAModel models={models} />
			</section>
			<section className="py-4 container mx-auto px-4">
				<RecentModels models={models} />
			</section>
			<section className="py-4 container mx-auto px-4 flex flex-col space-y-4">
				<PerformanceTrendChart models={models} />
				<KeyInsights models={models} />
			</section>
			<section className="py-4 mx-auto md:px-4 w-[90vw]">
				<TableWrapper models={models} />
			</section>
		</main>
	);
}
