import React from "react";
import { ExtendedModel } from "@/data/types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

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
						<span
							key={m.id + "-provider"}
							className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-sm"
						>
							<Avatar className="h-5 w-5 border bg-white">
								<AvatarImage
									src={`/providers/${m.provider.provider_id}.svg`}
									alt={m.provider.name}
									className="object-contain"
								/>
							</Avatar>
							{m.provider.name}
						</span>
					))}
				</div>
			</div>
		</Card>
	);
}
