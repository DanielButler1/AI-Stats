import type { Metadata } from "next";
import Link from "next/link";

import CountryDetailShell from "@/components/(data)/countries/CountryDetailShell";
import CountryOrganisationCard from "@/components/(data)/countries/CountryOrganisationCard";
import { ModelCard } from "@/components/(data)/models/Models/ModelCard";
import { formatCountryDate } from "@/components/(data)/countries/utils";
import {
	buildCountryModelEvents,
	getCountrySummaryByIso,
	getUniqueCountryModels,
	normaliseIso,
} from "@/lib/fetchers/countries/getCountrySummary";
import { buildMetadata } from "@/lib/seo";

async function loadCountry(isoInput: string) {
	const iso = normaliseIso(isoInput);
	return getCountrySummaryByIso(iso);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ iso: string }>;
}): Promise<Metadata> {
	const { iso: isoParamRaw } = await params;
	const isoParam = normaliseIso(isoParamRaw);
	const country = await loadCountry(isoParam);
	const path = `/countries/${isoParam.toLowerCase()}`;

	if (!country) {
		return buildMetadata({
			title: `${isoParam || "Unknown"} - AI Country View`,
			description:
				"This experimental view does not yet have detailed data for this country. We are continuously adding more locations to AI Stats.",
			path,
			keywords: [
				"AI Stats",
				"countries",
				"AI country view",
				"AI organisations",
			],
		});
	}

	const countryName = country.countryName;

	return buildMetadata({
		title: `${countryName} - AI Organisations & Models`,
		description: `Explore AI organisations and models tracked in ${countryName} on AI Stats. See which providers and model families originate from this country and how its AI ecosystem is evolving.`,
		path,
		keywords: [
			"AI Stats",
			"countries",
			countryName,
			`AI in ${countryName}`,
			"AI organisations",
			"AI models",
		],
	});
}

export default async function CountryDetailPage({
	params,
}: {
	params: Promise<{ iso: string }>;
}) {
	const { iso: isoParamRaw } = await params;
	const iso = normaliseIso(isoParamRaw);
	const country = await loadCountry(iso);

	if (!country) {
		return (
			<CountryDetailShell iso={iso} country={undefined}>
				<div className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 p-6 text-sm text-muted-foreground dark:border-zinc-700 dark:bg-zinc-900/70">
					We do not yet have organisations or models mapped to this
					country. Check back soon as we expand coverage.
				</div>
			</CountryDetailShell>
		);
	}

	const organisationEntries = country.organisations;
	const models = getUniqueCountryModels(country);
	const modelsToShow = models.slice(0, 9);
	const latestModel = country.latestModel;

	return (
		<CountryDetailShell iso={iso} country={country}>
			<div className="space-y-10">
				<div className="grid gap-4 md:grid-cols-3">
					<div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80">
						<p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
							Active organisations
						</p>
						<p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
							{country.totalOrganisations}
						</p>
						<p className="text-sm text-muted-foreground">
							HQs or primary offices confirmed for this country.
						</p>
					</div>
					<div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80">
						<p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
							Models tracked
						</p>
						<p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
							{country.totalModels}
						</p>
						<p className="text-sm text-muted-foreground">
							Unique model entries mapped to local organisations.
						</p>
					</div>
					<div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm backdrop-blur dark:border-primary/40 dark:bg-primary/10">
						<p className="text-[11px] uppercase tracking-[0.35em] text-primary">
							Latest model
						</p>
						{latestModel ? (
							<div className="mt-2 space-y-1">
								<Link
									href={`/models/${latestModel.model_id}`}
									className="text-lg font-semibold leading-tight text-primary hover:underline"
								>
									{latestModel.name}
								</Link>
								<p className="text-sm text-primary/80">
									{latestModel.organisation_name ??
										"Unknown organisation"}
								</p>
								<p className="text-[11px] uppercase tracking-[0.32em] text-primary/70">
									{formatCountryDate(
										latestModel.primary_date
									)}
								</p>
							</div>
						) : (
							<p className="mt-2 text-sm text-primary/80">
								No latest model tracked yet.
							</p>
						)}
					</div>
				</div>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
						Latest releases from {country.countryName}
					</h2>
					{modelsToShow.length ? (
						<div className="space-y-4">
							{Array.from(
								modelsToShow.reduce((map, model) => {
									const label = formatCountryDate(
										model.primary_date
									);
									if (!map.has(label)) map.set(label, []);
									map.get(label)!.push(model);
									return map;
								}, new Map<string, typeof modelsToShow>())
							).map(([label, groupedModels]) => (
								<div key={label} className="space-y-2">
									<h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
										{label}
									</h3>
									<div className="grid gap-4 md:grid-cols-3">
										{groupedModels.map((model) => (
											<ModelCard
												key={model.model_id}
												model={model}
											/>
										))}
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-sm text-muted-foreground">
							No models have been mapped to {country.countryName}{" "}
							yet.
						</p>
					)}
				</section>

				<section className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
							Organisations From {country.countryName}
						</h2>
					</div>
					{organisationEntries.length ? (
						<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
							{organisationEntries.map((organisation) => (
								<CountryOrganisationCard
									key={organisation.organisation_id}
									organisation={organisation}
								/>
							))}
						</div>
					) : (
						<p className="text-sm text-muted-foreground">
							No organisations have been mapped to{" "}
							{country.countryName} yet.
						</p>
					)}
				</section>
			</div>
		</CountryDetailShell>
	);
}
