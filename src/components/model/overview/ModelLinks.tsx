import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExtendedModel } from "@/data/types";
// Add Lucide icons
import { BookText, Gamepad2 } from "lucide-react";

interface ModelLinksProps {
	model: ExtendedModel;
}

const LINK_FIELDS = [
	{ key: "api_reference_link", label: "API Reference" },
	{ key: "playground_link", label: "Playground" },
	{ key: "paper_link", label: "Paper" },
	{ key: "announcement_link", label: "Announcement" },
	{ key: "repository_link", label: "Repository" },
	{ key: "weights_link", label: "Weights" },
];

function getIconForLink(
	link: { key: string; url?: string },
	model: ExtendedModel
) {
	// Paper: /social/arxiv.svg
	if (link.key === "paper_link") {
		return (
			<img
				src="/social/arxiv.svg"
				alt="arXiv"
				width={16}
				height={16}
				className="w-4 h-4 mr-2 rounded"
				style={{ display: "inline-block" }}
			/>
		);
	}
	// Announcement: /providers/{providerid}.svg
	if (link.key === "announcement_link") {
		const providerId = model.provider.provider_id;
		if (providerId) {
			return (
				<img
					src={`/providers/${providerId}.svg`}
					alt="Provider"
					width={16}
					height={16}
					className="w-4 h-4 mr-2 rounded"
					style={{ display: "inline-block" }}
				/>
			);
		}
	}
	// Weights: /social/hugging_face.svg
	if (link.key === "weights_link") {
		return (
			<img
				src="/social/hugging_face.svg"
				alt="Hugging Face"
				width={16}
				height={16}
				className="w-4 h-4 mr-2 rounded"
				style={{ display: "inline-block" }}
			/>
		);
	}
	// Repository: /social/github_light.svg (light) or /social/github_dark.svg (dark)
	if (link.key === "repository_link") {
		return (
			<>
				<img
					src="/social/github_light.svg"
					alt="GitHub"
					width={16}
					height={16}
					className="w-4 h-4 mr-2 rounded block dark:hidden"
				/>
				<img
					src="/social/github_dark.svg"
					alt="GitHub"
					width={16}
					height={16}
					className="w-4 h-4 mr-2 rounded hidden dark:block"
				/>
			</>
		);
	}
	// API Reference & Playground: use Lucide icons instead of favicon
	if (link.key === "api_reference_link") {
		return <BookText className="w-4 h-4 mr-2" aria-label="API Reference" />;
	}
	if (link.key === "playground_link") {
		return <Gamepad2 className="w-4 h-4 mr-2" aria-label="Playground" />;
	}
	return null;
}

export default function ModelLinks({ model }: ModelLinksProps) {
	const links = LINK_FIELDS.map(({ key, label }) => ({
		key,
		label,
		url: model[key as keyof ExtendedModel] as string | undefined,
	})).filter((link) => link.url && link.url.trim() !== "");

	if (links.length === 0) {
		return <p className="text-muted-foreground">No links available.</p>;
	}
	return (
		<div className="grid grid-cols-2 gap-2 mt-2 md:flex md:flex-wrap">
			{links.map((link) => (
				<Link
					key={link.key}
					href={link.url ?? ""}
					target="_blank"
					rel="noopener noreferrer"
					passHref
				>
					<Button
						variant="outline"
						className="flex items-center gap-2 px-4 py-1 rounded-full w-full"
					>
						{getIconForLink(link, model)}
						{link.label}
					</Button>
				</Link>
			))}
		</div>
	);
}
