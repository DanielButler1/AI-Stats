import Link from "next/link";
import {
	Book,
	Play,
	FileText,
	Megaphone,
	Github,
	Download,
	ExternalLink,
	Pencil,
	DollarSign,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardTitle } from "../ui/card";

const linkIcons = {
	pricing_link: DollarSign,
	api_reference_link: Book,
	playground_link: Play,
	paper_link: FileText,
	announcement_link: Megaphone,
	repository_link: Github,
	weights_link: Download,
	contribute_link: Pencil,
};

interface ModelQuickLinksProps {
	model: any;
}

export default function ModelQuickLinks({ model }: ModelQuickLinksProps) {
	const links = [
		...(Array.isArray(model.prices) && model.prices.length > 0
			? [
					{
						key: "pricing_link",
						label: "Pricing",
						url: `/prices/models/${model.id}`,
						internal: true,
					},
			  ]
			: []),
		{
			key: "api_reference_link",
			label: "API Reference",
			url: model.api_reference_link,
		},
		{
			key: "playground_link",
			label: "Playground",
			url: model.playground_link,
		},
		{
			key: "paper_link",
			label: "Paper",
			url: model.paper_link,
		},
		{
			key: "announcement_link",
			label: "Announcement",
			url: model.announcement_link,
		},
		{
			key: "weights_link",
			label: "Weights",
			url: model.weights_link,
		},
		{
			key: "repository_link",
			label: "Repository",
			url: model.repository_link,
		},
		{
			key: "contribute_link",
			label: "Suggest Edits",
			url: model.provider?.provider_id && model.id
				? `https://github.com/DanielButler1/AI-Stats/blob/main/src/data/models/${model.provider.provider_id}/${model.id}/model.json`
				: null,
		},
	].filter((link) => !!link.url); // ✅ only keep links with valid URLs

	return (
		<Card className="w-full bg-white dark:bg-zinc-950 rounded-lg shadow-lg p-6 mb-4">
			<CardTitle className="text-2xl font-bold mb-2">Quick Links</CardTitle>
			<ScrollArea className="w-full overflow-x-auto" type="auto">
				<div className="flex gap-3 flex-nowrap pb-2">
					{links.map((link) => {
						const Icon =
							linkIcons[link.key as keyof typeof linkIcons] || ExternalLink;
						const isInternal = link.internal === true;

						const commonClasses =
							"inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-200 min-w-max";

						if (isInternal) {
							return (
								<Link
									key={link.key}
									href={link.url}
									aria-label={link.label}
									className={commonClasses}
								>
									<Icon className="w-5 h-5" />
									<span className="text-sm font-medium">{link.label}</span>
								</Link>
							);
						}

						return (
							<a
								key={link.key}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={link.label}
								className={commonClasses}
							>
								<Icon className="w-5 h-5" />
								<span className="text-sm font-medium">{link.label}</span>
							</a>
						);
					})}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</Card>
	);
}
