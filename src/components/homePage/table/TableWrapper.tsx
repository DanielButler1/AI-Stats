import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModelTable } from "./ModelTable";
import type { ExtendedModel } from "@/data/types";

interface TableWrapperProps {
	models: ExtendedModel[];
}

export default function TableWrapper({ models }: TableWrapperProps) {
	return (
		<Card className="shadow-lg">
			<CardHeader>
				<CardTitle className="text-2xl">
					All Model Information ({models.length} models)
				</CardTitle>
			</CardHeader>
			<CardContent>
				<TooltipProvider>
					<ModelTable models={models} />
				</TooltipProvider>
			</CardContent>
		</Card>
	);
}
