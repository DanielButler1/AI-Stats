import UpdateCard from "@/components/updates/UpdateCard";
import { Card, CardContent } from "@/components/ui/card";
import { UPDATE_ENTRY_META } from "@/lib/content/updates";
import getRecentModelUpdates from "@/lib/fetchers/updates/getModelUpdates";
import {
	modelEventsToCardModels,
	type UpdateCardModel,
} from "@/lib/updates/cardModels";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { getLatestUpdateCards } from "@/lib/fetchers/updates/getLatestUpdates";
import { getYouTubeUpdatesCached } from "@/lib/fetchers/updates/getYouTubeUpdates";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
	title: "AI Updates – Latest AI Model, Web & YouTube Changes",
	description:
		"Stay up to date with the latest in AI. See new model launches, deprecations, research drops, data hubs, and YouTube explainers aggregated by AI Stats from across the ecosystem.",
	path: "/updates",
	keywords: [
		"AI updates",
		"AI news",
		"new AI models",
		"AI changelog",
		"model launches",
		"AI research updates",
		"YouTube AI releases",
		"AI Stats",
	],
});

type UpdateFeedCategory = "overview" | "models" | "web" | "youtube";

type CategoryDescriptor = {
	label: string;
	description: string;
	icon: LucideIcon;
};

const CATEGORY_META: Record<UpdateFeedCategory, CategoryDescriptor> = {
	overview: {
		label: "Overview",
		description:
			"Roll-up of every watcher and feed. Start here for a panoramic view across the AI Stats ecosystem.",
		icon: Sparkles,
	},
	models: {
		label: "Model updates",
		description:
			"Launches, deprecations, eval highlights, and lifecycle changes spotted by the model watcher.",
		icon: UPDATE_ENTRY_META.models.icon,
	},
	web: {
		label: "Web updates",
		description:
			"New destinations, research drops, and data hubs surfaced by the web watcher.",
		icon: UPDATE_ENTRY_META.web.icon,
	},
	youtube: {
		label: "YouTube updates",
		description:
			"Livestreams, explainers, and release breakdowns from our video channels.",
		icon: UPDATE_ENTRY_META.youtube.icon,
	},
};

const CATEGORY_ORDER: UpdateFeedCategory[] = ["models", "web", "youtube"];

const CATEGORY_LIMIT: Record<UpdateFeedCategory, number> = {
	overview: 6,
	models: 6,
	web: 6,
	youtube: 6,
};

type CategorySectionProps = {
	category: UpdateFeedCategory;
	cards: UpdateCardModel[];
};

function CategorySection({ category, cards }: CategorySectionProps) {
	const meta = CATEGORY_META[category];
	const hasEntries = cards.length > 0;
	return (
		<section className="space-y-4">
			<div className="space-y-1">
				<div className="flex items-center gap-2">
					<meta.icon className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
					<h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
						{meta.label}
					</h2>
				</div>
				<p className="max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
					{meta.description}
				</p>
			</div>

			{hasEntries ? (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					{cards.map((card) => (
						<UpdateCard
							key={`${category}-${card.id}`}
							id={card.id}
							badges={card.badges}
							title={card.title}
							subtitle={card.subtitle ?? undefined}
							link={card.link}
							dateIso={card.dateIso}
							relative={card.relative}
							accentClass={card.accentClass}
						/>
					))}
				</div>
			) : (
				<Card className="border-dashed">
					<CardContent className="py-10 text-sm text-zinc-600 dark:text-zinc-400">
						No {meta.label.toLowerCase()} available yet.
					</CardContent>
				</Card>
			)}
		</section>
	);
}

export default async function Page() {
	// Fetch watcher-specific cards and model events in parallel.
	// Use `getLatestUpdateCards` to populate the overview section and
	// fallback model cards if the model-events-based cards are empty.
	// const [overviewCards, allCards, modelEvents] = await Promise.all([
	const [allCards, modelEvents, youtubeCardsFromFeed] = await Promise.all([
		getLatestUpdateCards(
			Math.max(
				CATEGORY_LIMIT.web,
				CATEGORY_LIMIT.youtube
				// CATEGORY_LIMIT.overview
			)
		),
		getRecentModelUpdates({ limit: CATEGORY_LIMIT.models }),
		getYouTubeUpdatesCached(Math.max(CATEGORY_LIMIT.youtube, 1)),
	]);

	const modelCardsFromEvents = modelEventsToCardModels(modelEvents);

	// Ensure the fetched UpdateCardProps arrays conform to UpdateCardModel shape
	const normalizeCards = (cards: any[] | undefined) =>
		(cards ?? []).map((c, i) => ({
			id: c.id ?? `card-${i}`,
			badges: c.badges ?? [],
			title: c.title ?? "",
			subtitle: c.subtitle ?? c.source ?? null,
			description: c.description ?? null,
			link: c.link ?? { href: "#" },
			dateIso: c.dateIso ?? c.created_at ?? null,
			relative: c.relative ?? (c.dateIso ? String(c.dateIso) : ""),
			accentClass: c.accentClass ?? null,
			category: (c as any).category ?? undefined,
		})) as UpdateCardModel[];

	// const normalizedOverview = normalizeCards(overviewCards as any[]);
	const normalizedAll = normalizeCards(allCards as any[]);

	const webCards = normalizedAll.filter((c) =>
		(c.badges ?? []).some((b) =>
			String(b.label).toLowerCase().includes("web")
		)
	);

	const youtubeCards = normalizeCards(youtubeCardsFromFeed).slice(
		0,
		CATEGORY_LIMIT.youtube
	);

	// const modelCardsFallback = normalizedOverview
	// 	.filter(
	// 		(card) =>
	// 			(card as any).category === "models" ||
	// 			(card.badges ?? []).some(
	// 				(badge) =>
	// 					badge.label &&
	// 					String(badge.label).toLowerCase().includes("model")
	// 			)
	// 	)
	// 	.slice(0, CATEGORY_LIMIT.models);

	const modelCards = modelCardsFromEvents;

	const overviewCards = [...modelCards, ...webCards, ...youtubeCards]
		.sort(
			(a, b) =>
				new Date(b.dateIso || 0).getTime() -
				new Date(a.dateIso || 0).getTime()
		)
		.slice(0, CATEGORY_LIMIT.overview);

	const sections: Record<UpdateFeedCategory, UpdateCardModel[]> = {
		overview: overviewCards,
		models: modelCards,
		web: webCards,
		youtube: youtubeCards,
	};

	return (
		<div className="space-y-4">
			{CATEGORY_ORDER.map((category) => (
				<CategorySection
					key={category}
					category={category}
					cards={sections[category]}
				/>
			))}
		</div>
	);
}
