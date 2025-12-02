import { Card, CardContent } from "@/components/ui/card";
import ModelCombobox from "./ModelCombobox";
import type { ExtendedModel } from "@/data/types";

export default function MainCard({
	models,
	selected,
	setSelected,
}: {
	models: ExtendedModel[];
	selected: string[];
	setSelected: (ids: string[]) => void;
}) {
	return (
		<Card className="w-full max-w-4xl p-8">
			<CardContent>
				<h2 className="text-2xl font-bold mb-4 text-center">
					Compare Models
				</h2>
				<div className="flex justify-center mb-4">
					<ModelCombobox
						models={models}
						selected={selected}
						setSelected={setSelected}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
