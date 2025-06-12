"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ModelCombobox from "./ModelCombobox";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { ExtendedModel } from "@/data/types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CompareMiniHeaderProps {
	models: ExtendedModel[];
}

export default function CompareMiniHeader({ models }: CompareMiniHeaderProps) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const selected = searchParams.getAll("models");

	const setSelected = (ids: string[]) => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("models");
		ids.forEach((id) => params.append("models", id));
		router.replace(`?${params.toString()}`);
	};

	const selectedModels = models.filter((m) => selected.includes(m.id));

	return (
		<div className="border-b bg-background/10 backdrop-blur-md sticky top-0 z-40">
			<div className="container mx-auto py-4 px-4">
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<div className="flex flex-wrap gap-2 items-center">
						{selectedModels.map((model) => (
							<Badge
								key={model.id}
								variant="outline"
								className="flex items-center gap-1 pl-1 pr-2 py-1 rounded-full border bg-background"
							>
								<Avatar className="h-5 w-5 flex-shrink-0 mr-1 border bg-white">
									<AvatarImage
										src={`/providers/${model.provider.provider_id}.svg`}
										alt={model.provider.name}
										className="object-contain"
									/>
								</Avatar>
								<span className="truncate text-sm font-normal">
									{model.name}
								</span>
								<Button
									size="icon"
									variant="ghost"
									className="h-5 w-5 p-0 ml-1 flex-shrink-0 hover:bg-muted rounded-full"
									onClick={() =>
										setSelected(
											selected.filter(
												(id) => id !== model.id
											)
										)
									}
								>
									<X className="h-3 w-3" />
								</Button>
							</Badge>
						))}
					</div>
					<div className="w-full md:w-64 flex-shrink-0 flex justify-end">
						<ModelCombobox
							models={models}
							selected={selected}
							setSelected={setSelected}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
