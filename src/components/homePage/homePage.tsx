"use client";

import SoTAModel from "@/components/homePage/SoTAModels";
import PerformanceTrendChart from "@/components/homePage/PerformanceTrendChart";
import KeyInsights from "@/components/homePage/KeyInsights";
import RecentModels from "@/components/homePage/RecentModels";
import TableWrapper from "@/components/homePage/table/TableWrapper";
import Header from "@/components/header";
import type { ExtendedModel } from "@/data/types";
import { motion } from "motion/react";

interface HomePageProps {
	models: ExtendedModel[];
}

export default function HomePage({ models }: HomePageProps) {
	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<motion.section
				className="py-4 container mx-auto px-4"
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				viewport={{ once: true, amount: 0.2 }}
			>
				<SoTAModel models={models} />
			</motion.section>
			<motion.section
				className="py-4 container mx-auto px-4"
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
				viewport={{ once: true, amount: 0.2 }}
			>
				<RecentModels models={models} />
			</motion.section>
			<motion.section
				className="py-4 container mx-auto px-4 flex flex-col space-y-4"
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
				viewport={{ once: true, amount: 0.2 }}
			>
				<PerformanceTrendChart models={models} />
				<KeyInsights models={models} />
			</motion.section>
			<motion.section
				className="py-4 mx-auto md:px-4 w-[90vw]"
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
				viewport={{ once: true, amount: 0.2 }}
			>
				<TableWrapper models={models} />
			</motion.section>
		</main>
	);
}
