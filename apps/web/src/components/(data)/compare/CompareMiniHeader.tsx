"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ModelCombobox from "./ModelCombobox";
import type { ExtendedModel } from "@/data/types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import Link from "next/link";

interface CompareMiniHeaderProps {
	models: ExtendedModel[];
}

const decodeModelIdFromUrl = (value: string): string => {
	const trimmed = value?.trim();
	if (!trimmed) return "";
	if (trimmed.includes("/")) return trimmed;
	if (!trimmed.includes("_")) return trimmed;
	const [organisationId, ...rest] = trimmed.split("_");
	if (!organisationId || rest.length === 0) return trimmed;
	return `${organisationId}/${rest.join("_")}`;
};

const encodeModelIdForUrl = (value: string): string => {
	if (!value) return "";
	const [organisationId, ...rest] = value.split("/");
	if (!organisationId || rest.length === 0) return value;
	return `${organisationId}_${rest.join("/")}`;
};

export default function CompareMiniHeader({ models }: CompareMiniHeaderProps) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const selected = searchParams
		.getAll("models")
		.map((value) => decodeModelIdFromUrl(value))
		.filter(Boolean);

	const setSelected = (ids: string[]) => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("models");
		ids.forEach((id) => params.append("models", encodeModelIdForUrl(id)));
		router.replace(`?${params.toString()}`);
	};

	const selectedModels = models.filter((m) => selected.includes(m.id));

	return (
		<div className="border-b bg-background/10 backdrop-blur-md top-0 z-40">
			<div className="container mx-auto py-4 px-4">
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<div className="flex flex-wrap gap-2 items-center">
						{selectedModels.map((model) => (
							<Badge
								key={model.id}
								variant="outline"
								className="flex items-center gap-1 pl-1 pr-2 py-1 rounded-full border bg-background"
							>
								<Link
									href={`/organisations/${model.provider.provider_id}`}
									className="flex items-center"
								>
									<Logo
										id={model.provider.provider_id}
										alt={model.provider.name}
										width={20}
										height={20}
										className="h-5 w-5 flex-shrink-0 mr-1 border bg-white rounded-full object-contain"
									/>
								</Link>
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
