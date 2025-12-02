import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import TokenCounter from "@/components/(tools)/TokenCounter";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = buildMetadata({
	title: "Token counter – estimate LLM token usage",
	description:
		"Estimate token usage for text across popular AI models using a tiktoken-compatible counter. Paste text, pick a model, and see approximate token counts before sending requests.",
	path: "/tools/tokenizer",
	keywords: [
		"token counter",
		"LLM tokens",
		"tiktoken",
		"AI model pricing",
		"prompt length",
		"AI Stats tools",
	],
});

export const dynamic = "force-dynamic";

const SkeletonLoader = () => (
	<div className="container mx-auto py-8 px-4">
		<div className="mb-8">
			<Skeleton className="h-8 w-48 mb-2" />
			<Skeleton className="h-4 w-full mb-4" />
			<Skeleton className="h-16 w-full" />
		</div>
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<Card className="shadow-sm">
				<CardHeader>
					<Skeleton className="h-6 w-32" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-80 w-full" />
				</CardContent>
			</Card>
			<Card className="shadow-sm">
				<CardHeader>
					<Skeleton className="h-6 w-32" />
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<Skeleton className="h-32 w-full rounded-xl" />
						<div>
							<Skeleton className="h-4 w-24 mb-3" />
							<Skeleton className="h-96 w-full rounded-lg" />
							<Skeleton className="h-4 w-48 mt-3" />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	</div>
);

export default function TokenCounterPage() {
	return (
		<Suspense fallback={<SkeletonLoader />}>
			<TokenCounter />
		</Suspense>
	);
}
