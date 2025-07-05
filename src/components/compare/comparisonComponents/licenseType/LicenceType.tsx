import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Lock, Unlock, Scale } from "lucide-react";
import type { ExtendedModel } from "@/data/types";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface LicenseTypeProps {
	selectedModels: ExtendedModel[];
}

function getLicenseDescriptionCard(models: ExtendedModel[]) {
	if (models.length < 2) return null;
	const [first, second] = models;
	const firstLicense = first.license?.toLowerCase() ?? "unknown";
	const secondLicense = second.license?.toLowerCase() ?? "unknown";

	// Check if all models have proprietary licenses
	const allProprietary = models.every(
		(model) => model.license?.toLowerCase() === "proprietary"
	);

	return (
		<Card className="mb-4 bg-muted/60 border-none shadow-none">
			<Card className="flex items-center gap-2 p-4 border-none mt-2">
				<span className="relative flex h-4 w-4 items-center justify-center mr-4 shrink-0">
					<span className="absolute h-6 w-6 rounded-full bg-pink-400/30" />
					<Scale className="relative h-full w-full text-pink-500" />
				</span>
				<div className="text-sm">
					{allProprietary ? (
						<>
							<span className="block font-medium">
								All models are licensed under proprietary
								licenses.
							</span>
							<span className="block text-xs text-muted-foreground mt-1">
								All models have usage restrictions defined by
								their respective organizations.
							</span>
						</>
					) : (
						<>
							<span className="block font-medium">
								<Link
									href={`/models/${encodeURIComponent(
										first.id
									)}`}
									className="group"
								>
									<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full font-semibold">
										{first.name}
									</span>
								</Link>{" "}
								is licensed under{" "}
								{firstLicense === "proprietary"
									? "a proprietary license"
									: first.license ?? "unknown"}
								, while{" "}
								<Link
									href={`/models/${encodeURIComponent(
										second.id
									)}`}
									className="group"
								>
									<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full font-semibold">
										{second.name}
									</span>
								</Link>{" "}
								uses{" "}
								{secondLicense === "proprietary"
									? "a proprietary license"
									: second.license ?? "unknown"}
								.
							</span>{" "}
							<span className="block text-xs text-muted-foreground mt-1">
								License differences may affect how you can use
								these models in commercial or open-source
								projects.
							</span>
						</>
					)}
				</div>
			</Card>
		</Card>
	);
}

function getLicenseIcon(license: string | null) {
	const isProprietary = license?.toLowerCase() === "proprietary";
	return (
		<span
			className={`rounded-md p-1 flex items-center justify-center ${
				isProprietary ? "bg-zinc-300" : "bg-green-100"
			}`}
		>
			{isProprietary ? (
				<Lock
					className="h-4 w-4 text-zinc-500"
					aria-label="Proprietary"
				/>
			) : (
				<Unlock
					className="h-4 w-4 text-green-600"
					aria-label="Open License"
				/>
			)}
		</span>
	);
}

export default function LicenseType({ selectedModels }: LicenseTypeProps) {
	if (!selectedModels || selectedModels.length === 0) return null;
	return (
		<Card className="mb-6 bg-white dark:bg-zinc-950 rounded-lg shadow relative">
			<CardHeader className="flex flex-col items-start justify-between border-b border-b-zinc-200">
				<CardTitle>License Type</CardTitle>
				<CardDescription>
					Model usage and distribution terms
				</CardDescription>
			</CardHeader>
			<CardContent className="p-6">
				{getLicenseDescriptionCard(selectedModels)}
				<div className="flex flex-col md:flex-row gap-6 mt-2 w-full">
					{selectedModels.map((model) => (
						<Card
							key={model.id}
							className="flex flex-col items-start p-6 border-none shadow-lg flex-1 min-w-0 mb-2 md:mb-0"
						>
							<div className="flex items-center mb-2">
								{getLicenseIcon(model.license)}
								<span className="font-semibold ml-2 text-base">
									<Link
										href={`/models/${encodeURIComponent(
											model.id
										)}`}
										className="group"
									>
										<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
											{model.name}
										</span>
									</Link>
								</span>
							</div>
							<span className="text-sm text-muted-foreground ">
								{model.license ?? "unknown"}
							</span>
						</Card>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
