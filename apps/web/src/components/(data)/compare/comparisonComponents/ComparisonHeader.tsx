import React from "react";
import { ExtendedModel } from "@/data/types";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function ComparisonHeader({
	selectedModels,
}: {
	selectedModels: ExtendedModel[];
}) {
	return (
		<Card>
			<div className="text-center mt-8">
				<h2 className="text-lg font-medium text-pink-400 mb-3">
					MODEL COMPARISON
				</h2>
				<div className="flex flex-row items-center justify-center gap-3 mb-4 flex-wrap">
					{selectedModels.map((m, index) => (
						<React.Fragment key={m.id}>
							<span className="flex items-center text-4xl font-bold text-center sm:text-left">
								{m.name}
							</span>
							{index < selectedModels.length - 1 && (
								<span className="flex items-center text-lg text-muted-foreground font-medium mx-2">
									vs
								</span>
							)}
						</React.Fragment>
					))}
				</div>
				<div className="flex flex-wrap justify-center gap-2 my-8">
					{selectedModels.map((m) => (
						<Link
							key={m.id + "-provider"}
							href={`/organisations/${m.provider.provider_id}`}
							className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-sm hover:underline"
						>
							<Logo
								id={m.provider.provider_id}
								alt={m.provider.name}
								width={20}
								height={20}
								className="h-5 w-5 rounded-full border bg-white object-contain"
							/>
							{m.provider.name}
						</Link>
					))}
				</div>
			</div>
		</Card>
	);
}
