import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const HelpSection: React.FC = () => (
	<section className="rounded-3xl border border-zinc-200/70 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/80">
		<h2 className="text-2xl font-semibold">Need help exporting?</h2>
		<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
			We're preparing step-by-step guides for each platform. Join our
			Discord to get early access and share feedback.
		</p>
		<div className="mt-4 flex flex-wrap gap-3">
			<Link
				href="https://discord.gg/zDw73wamdX"
				target="_blank"
				rel="noopener noreferrer"
			>
				<Button variant="outline" className="gap-2">
					<Sparkles className="h-4 w-4" />
					Join the community
				</Button>
			</Link>
			<Link href="mailto:team@ai-stats.com">
				<Button variant="ghost" className="gap-2">
					<ArrowUpRight className="h-4 w-4" />
					Request a platform
				</Button>
			</Link>
		</div>
	</section>
);
