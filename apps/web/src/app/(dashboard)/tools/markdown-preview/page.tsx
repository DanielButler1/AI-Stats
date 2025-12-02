import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import MarkdownPreviewer from "@/components/(tools)/MarkdownPreviewer";

export const metadata: Metadata = buildMetadata({
	title: "Markdown Previewer - Live Preview For Prompts & Docs",
	description:
		"Write and preview Markdown in real time. Perfect for crafting prompts, system messages, and documentation for AI workflows.",
	path: "/tools/markdown-preview",
	keywords: [
		"Markdown preview",
		"Markdown editor",
		"prompt formatting",
		"system prompts",
		"AI documentation",
		"AI Stats tools",
	],
});

export default function MarkdownPreviewPage() {
	return <MarkdownPreviewer />;
}
