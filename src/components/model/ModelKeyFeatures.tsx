import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Globe, Brain, Wrench } from "lucide-react";

interface ModelKeyFeaturesProps {
	model: any;
}

export default function ModelKeyFeatures({ model }: ModelKeyFeaturesProps) {
	const features = [
		{
			key: "web_access",
			title: "Web Access",
			icon: Globe,
			description: "Real-time access to current web information",
			value: model?.web_access,
		},
		{
			key: "multimodal",
			title: "Multimodal",
			icon: ImageIcon,
			description:
				"Ability to process multiple data types (text, images, etc.)",
			value: model?.multimodal,
		},
		{
			key: "reasoning_model",
			title: "Reasoning",
			icon: Brain,
			description:
				"Advanced logical and deductive reasoning capabilities",
			value:
				typeof model?.reasoning === "boolean" ? model.reasoning : null,
		},
		{
			key: "fine_tunable",
			title: "Fine-Tunable",
			icon: Wrench,
			description: "Can be customized for specific use cases",
			value:
				typeof model?.fine_tunable === "boolean"
					? model.fine_tunable
					: null,
		},
	];

	const getBadge = (value: boolean | null) => {
		if (value === true)
			return (
				<Badge
					className="bg-green-100 text-green-800 border border-green-200 transition-colors duration-200 hover:bg-green-200 hover:text-green-900 hover:border-green-300 hover:shadow-sm dark:bg-green-900 dark:text-green-200 dark:border-green-800 dark:hover:bg-green-800 dark:hover:text-green-100 dark:hover:border-green-700"
					variant="default"
				>
					Yes
				</Badge>
			);
		if (value === false)
			return (
				<Badge
					className="bg-red-100 text-red-700 border border-red-200 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 hover:shadow-sm dark:bg-red-900 dark:text-red-200 dark:border-red-800 dark:hover:bg-red-800 dark:hover:text-red-100 dark:hover:border-red-700"
					variant="destructive"
				>
					No
				</Badge>
			);
		return (
			<Badge
				className="bg-zinc-100 text-zinc-600 border border-zinc-200 transition-colors duration-200 hover:bg-zinc-200 hover:text-zinc-800 hover:border-zinc-300 hover:shadow-sm dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 dark:hover:border-zinc-600"
				variant="secondary"
			>
				Unknown
			</Badge>
		);
	};

	const getIconBg = (value: boolean | null) => {
		if (value === true) return "bg-green-100 text-green-700";
		if (value === false) return "bg-red-100 text-red-700";
		return "bg-zinc-100 text-zinc-500";
	};

	return (
		<Card className="mb-8 shadow-lg">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">
					Key Features
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
					{features.map((feature) => (
						<Card
							key={feature.key}
							className="flex flex-col items-center text-center gap-2 p-3 rounded-lg shadow-lg"
						>
							<div
								className={`flex items-center justify-center rounded-full h-10 w-10 mb-1 text-lg transition-colors ${getIconBg(
									feature.value
								)}`}
							>
								<feature.icon
									className="h-6 w-6"
									aria-hidden="true"
								/>
							</div>
							<div className="flex items-center gap-2">
								<span className="font-semibold text-base">
									{feature.title}
								</span>
								{getBadge(feature.value)}
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								{feature.description}
							</p>
						</Card>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
