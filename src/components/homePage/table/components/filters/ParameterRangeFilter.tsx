import * as React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { DoubleSlider } from "@/components/ui/double-slider";

interface ParameterRangeFilterProps {
	parameterRange: [number, number];
	setParameterRange: (value: [number, number]) => void;
}

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 1000;

export function ParameterRangeFilter({
	parameterRange,
	setParameterRange,
}: ParameterRangeFilterProps) {
	const [open, setOpen] = React.useState(false);
	const isDefault =
		parameterRange[0] === DEFAULT_MIN && parameterRange[1] === DEFAULT_MAX;

	return (
		<div className="space-y-2">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						className="inline-flex px-4 gap-2"
					>
						<Filter className="h-4 w-4" />
						<span>Parameters (B)</span>
						{!isDefault && (
							<Badge variant="secondary">
								{`${parameterRange[0]}B - ${parameterRange[1]}B`}
							</Badge>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<div className="flex items-center justify-between">
						<div className="text-sm">{parameterRange[0]}</div>
						<div className="text-sm">{parameterRange[1]}</div>
					</div>
					<div className="space-y-4 py-2">
						<DoubleSlider
							value={parameterRange}
							onValueChange={setParameterRange as any}
							max={1000}
							step={1}
							minStepsBetweenThumbs={1}
							className="mt-2"
						/>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
