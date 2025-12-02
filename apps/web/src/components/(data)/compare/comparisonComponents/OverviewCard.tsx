import React from "react";
import { ExtendedModel } from "@/data/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function OverviewCard({
	selectedModels,
}: {
	selectedModels: ExtendedModel[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl font-bold">Overview</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-base">
					A detailed comparison of{" "}
					{selectedModels.map((m, i) => (
						<span key={m.id}>
							<strong>
								<a
									href={`/models/${m.id}`}
									className="text-primary text-lg font-bold border-b-2 border-pink-400"
								>
									{m.name}
								</a>
							</strong>
							{i < selectedModels.length - 2
								? ", "
								: i === selectedModels.length - 2
								? " and "
								: ""}
						</span>
					))}
					, focusing on their key differences and practical
					applications.
				</p>
			</CardContent>
		</Card>
	);
}
