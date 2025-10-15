"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	Rocket,
	PlugZap,
	Palette,
	GaugeCircle,
	Database,
	GitBranch,
	Newspaper,
	LayoutGrid,
	ArrowRight,
	CheckCircle2,
	ExternalLink,
	CalendarDays,
	Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const fadeUp = {
	hidden: { opacity: 0, y: 12 },
	show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Feature = ({
	icon: Icon,
	title,
	blurb,
}: {
	icon: any;
	title: string;
	blurb: string;
}) => (
	<motion.div variants={fadeUp}>
		<Card className="group relative overflow-hidden border-muted-foreground/10 bg-gradient-to-b from-background to-muted/40 shadow-sm transition hover:shadow-md h-full flex flex-col">
			<CardHeader className="space-y-3">
				<div className="flex items-center gap-3">
					<div className="rounded-2xl border bg-background p-2">
						<Icon className="h-5 w-5" aria-hidden />
					</div>
					<CardTitle className="text-lg font-semibold">
						{title}
					</CardTitle>
				</div>
				<p className="text-sm text-muted-foreground leading-relaxed">
					{blurb}
				</p>
			</CardHeader>
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-primary/5 to-transparent" />
		</Card>
	</motion.div>
);

export default function ComingSoonClient() {
	return (
		<main className="relative min-h-[calc(100dvh-4rem)] w-full pb-20">
			{/* Backdrop */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(60%_60%_at_50%_0%,hsl(var(--primary)/0.2),transparent_60%)]" />
			</div>

			{/* Hero */}
			<section className="container mx-auto px-4 pt-16 sm:pt-20">
				<motion.div
					initial="hidden"
					animate="show"
					variants={{
						show: { transition: { staggerChildren: 0.08 } },
					}}
					className="mx-auto max-w-3xl text-center"
				>
					<motion.h1
						variants={fadeUp}
						className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
					>
						A smarter, faster{" "}
						<span className="text-primary">AI Stats</span> is nearly
						here
					</motion.h1>

					<motion.div
						variants={fadeUp}
						className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground space-y-3"
					>
						<p>
							We’re rolling out a refreshed design, a more
							powerful <strong>Updates</strong> experience and the
							<strong> AI Stats Gateway</strong>. The site has
							been optimised for speed and clarity to give you
							more data, better organisation, and a calmer reading
							experience.
						</p>
						<p className="text-sm text-muted-foreground">
							We’re also massively expanding our database - nearly
							3x more models so you’ll see a much broader set of
							providers and benchmarks.
						</p>
					</motion.div>

					<motion.div
						variants={fadeUp}
						className="mt-6 flex flex-wrap items-center justify-center gap-3"
					>
						<Button
							disabled
							size="lg"
							className="opacity-60 cursor-not-allowed"
						>
							View Roadmap
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</motion.div>

					<motion.div
						variants={fadeUp}
						className="mt-6 text-xs text-muted-foreground"
					>
						<CalendarDays className="mr-1 inline h-3 w-3" /> Phased
						rollout over the next week.
					</motion.div>
				</motion.div>
			</section>

			{/* Highlights */}
			<section className="container mx-auto px-4 py-10 sm:py-14">
				<motion.div
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, margin: "-80px" }}
					variants={{
						show: { transition: { staggerChildren: 0.06 } },
					}}
					className="grid gap-4 md:grid-cols-3 items-stretch"
				>
					<div className="flex h-full">
						<Feature
							icon={PlugZap}
							title="AI Stats Gateway"
							blurb="One simple, reliable API that routes to the best available provider. Normalised responses, transparent metadata, and developer-friendly docs."
						/>
					</div>
					<div className="flex h-full">
						<Feature
							icon={Newspaper}
							title="Upgraded Updates"
							blurb="A re-thought Updates section with richer sources, smarter grouping, clearer timelines, and faster browsing so you never miss a release."
						/>
					</div>
					<div className="flex h-full">
						<Feature
							icon={Database}
							title="Database expansion"
							blurb="Massively expanded model coverage - nearly 3x more models, broader provider and benchmark coverage."
						/>
					</div>
				</motion.div>
			</section>

			{/* Deep dive */}
			<section className="container mx-auto px-4">
				<Card className="border-muted-foreground/10 bg-background/60">
					<CardHeader>
						<div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
							<div>
								<CardTitle className="text-xl">
									What’s in the update?
								</CardTitle>
								<p className="mt-1 text-sm text-muted-foreground">
									These improvements aim to make AI Stats a
									calmer, more powerful place to learn about
									AI models and providers.
								</p>
							</div>
							<div className="flex gap-2">
								<Badge variant="secondary" className="gap-1">
									<Sparkles className="h-3 w-3" /> Quality of
									life
								</Badge>
								<Badge variant="outline" className="gap-1">
									<GitBranch className="h-3 w-3" /> Iterative
									rollout
								</Badge>
							</div>
						</div>
					</CardHeader>
					<CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{[
							{
								icon: PlugZap,
								text: "Gateway API: normalised endpoints, usage metadata, and clear pricing calculators.",
							},
							{
								icon: GaugeCircle,
								text: "Performance and SEO tuning for faster loads and snappier navigation.",
							},
							{
								icon: LayoutGrid,
								text: "Cleaner information architecture - models, providers, benchmarks and pricing laid out more logically.",
							},
							{
								icon: Database,
								text: "More data: expanded model coverage (nearly 3x the current models), benchmark results, and pricing breakdowns.",
							},
							{
								icon: Newspaper,
								text: "Updates: richer feeds, deduped sources, clearer chronology, and topic grouping.",
							},
							{
								icon: Palette,
								text: "Minor design refresh: refined spacing, typography, and contrast across pages.",
							},
						].map((item, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 8 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: i * 0.04 }}
								className="flex items-start gap-3 rounded-2xl border bg-muted/30 p-4"
							>
								<div className="mt-0.5 rounded-xl border bg-background p-1.5">
									<item.icon
										className="h-4 w-4"
										aria-hidden
									/>
								</div>
								<p className="text-sm text-muted-foreground">
									{item.text}
								</p>
							</motion.div>
						))}
					</CardContent>
				</Card>
			</section>

			{/* Timeline */}
			<section className="container mx-auto px-4 py-10 sm:py-14">
				<div className="mx-auto max-w-3xl">
					<h2 className="text-center text-xl font-semibold">
						Rollout plan
					</h2>
					<p className="mt-2 text-center text-sm text-muted-foreground">
						We’ll ship in slices so you get value sooner. Expect
						fixes and polish along the way.
					</p>
					<div className="mt-6 space-y-4">
						{[
							{
								title: "Updated Updates",
								desc: "Initial release of the Updates improvements and refreshed feed UX.",
							},
							{
								title: "Data expansion",
								desc: "More models, benchmarks, pricing details, and provider comparisons.",
							},
							{
								title: "Gateway public beta",
								desc: "Open API with docs, example apps, and transparent pricing.",
							},
						].map((step, i) => (
							<div key={i} className="flex items-start gap-3">
								<div className="mt-1 rounded-full border bg-background p-1.5">
									<CheckCircle2
										className="h-4 w-4"
										aria-hidden
									/>
								</div>
								<div>
									<div className="font-medium">
										{step.title}
									</div>
									<div className="text-sm text-muted-foreground">
										{step.desc}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="container mx-auto px-4">
				<Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background">
					<CardContent className="grid gap-6 p-6 sm:grid-cols-3 sm:items-center">
						<div className="sm:col-span-2">
							<h3 className="text-lg font-semibold">
								Want updates the moment they land?
							</h3>
							<p className="mt-1 text-sm text-muted-foreground">
								Follow the roadmap or star the repo to get
								updates. We’ll keep you in the loop as we ship.
							</p>
							<Separator className="my-4" />
							<div className="flex flex-wrap gap-3">
								<Button
									disabled
									className="opacity-60 cursor-not-allowed"
								>
									Roadmap
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
								<Button asChild variant="ghost">
									<Link
										href="https://github.com/DanielButler1/AI-Stats"
										target="_blank"
										rel="noreferrer"
									>
										GitHub{" "}
										<ExternalLink className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</div>
						</div>
						<div className="rounded-2xl border bg-background p-4">
							<div className="text-sm text-muted-foreground">
								Heads‑up
							</div>
							<ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground/90">
								<li>No breaking URL changes are planned.</li>
								<li>
									API keys and docs will be published with the
									Gateway beta.
								</li>
								<li>
									We’ll keep accessibility and performance top
									of mind.
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</section>
		</main>
	);
}
