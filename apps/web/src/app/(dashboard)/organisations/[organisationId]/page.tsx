import OrganisationPageContent from "@/components/(data)/organisation/OrganisationOverview";
import { getOrganisationDataCached } from "@/lib/fetchers/organisations/getOrganisation";
import Image from "next/image";
import OrganisationDetailShell from "@/components/(data)/organisation/OrganisationDetailShell";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { withUTM } from "@/lib/utm";

async function fetchOrganisation(organisationId: string) {
	try {
		return await getOrganisationDataCached(organisationId, 12);
	} catch (error) {
		console.warn("[seo] failed to load organisation metadata", {
			organisationId,
			error,
		});
		return null;
	}
}

export async function generateMetadata(props: {
	params: Promise<{ organisationId: string }>;
}): Promise<Metadata> {
	const { organisationId } = await props.params;
	const organisation = await fetchOrganisation(organisationId);
	const path = `/organisations/${organisationId}`;
	const imagePath = `/og/organisations/${organisationId}`;

	// Fallback SEO if the organisation can't be loaded
	if (!organisation) {
		return buildMetadata({
			title: "AI Organisation Overview",
			description:
				"Discover AI organisations, their latest models, and gateway availability inside the AI Stats directory.",
			path,
			keywords: [
				"AI organisation",
				"AI provider",
				"AI models",
				"AI Stats",
			],
			imagePath,
		});
	}

	const launchedModels = organisation.recent_models?.length ?? 0;

	const description = [
		`${organisation.name} on AI Stats - organisation overview, AI models, and gateway coverage.`,
		organisation.description?.slice(0, 180) ?? undefined,
		launchedModels
			? `Explore ${launchedModels} recent models, gateway availability, and pricing coverage.`
			: undefined,
	]
		.filter(Boolean)
		.join(" ");

	const keywords = [
		organisation.name,
		`${organisation.name} AI`,
		`${organisation.name} AI organisation`,
		"AI organisation",
		"AI models",
		"AI gateway",
		"AI Stats",
	];

	return buildMetadata({
		title: `${organisation.name} - AI Organisation, Models & Gateway Coverage`,
		description,
		path,
		keywords,
		imagePath,
	});
}

export default async function Page({
	params,
}: {
	params: Promise<{ organisationId: string }>;
}) {
	const { organisationId } = await params;

	const organisation = await getOrganisationDataCached(organisationId, 12);

	if (!organisation) {
		return (
			<main className="flex min-h-screen flex-col">
				<div className="container mx-auto px-4 py-8">
					<div className="rounded-lg border border-dashed p-6 md:p-8 text-center bg-muted/30">
						<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
							<span className="text-xl">🏢</span>
						</div>
						<p className="text-base font-medium">
							Organisation not found
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							We&apos;re continuously adding new organisations.
							Got one to suggest?
						</p>
						<div className="mt-3">
							<a
								href={withUTM(
									"https://github.com/AI-Stats/AI-Stats/issues/new",
									{
										campaign: "organisation-suggestion",
										content:
											"organisation-detail-empty-state",
									}
								)}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
							>
								Suggest a Model
								<Image
									src="/social/github_light.svg"
									alt="GitHub Logo"
									width={16}
									height={16}
									className="inline dark:hidden"
								/>
								<Image
									src="/social/github_dark.svg"
									alt="GitHub Logo"
									width={16}
									height={16}
									className="hidden dark:inline"
								/>
							</a>
						</div>
					</div>
				</div>
			</main>
		);
	}

	// console.log("Latest Models:", organisation.recent_models);

	return (
		<OrganisationDetailShell organisationId={organisationId}>
			<OrganisationPageContent organisation={organisation} />
		</OrganisationDetailShell>
	);
}
