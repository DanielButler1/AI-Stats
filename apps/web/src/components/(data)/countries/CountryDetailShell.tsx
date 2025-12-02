import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CountryTabs from "@/components/(data)/countries/CountryTabs";
import { CountrySummary } from "@/lib/fetchers/countries/getCountrySummaries";

interface CountryDetailShellProps {
	country?: CountrySummary;
	iso: string;
	children: ReactNode;
}

export default function CountryDetailShell({
	country,
	iso,
	children,
}: CountryDetailShellProps) {
	const countryName = country?.countryName ?? "Unknown country";
	const isoLabel = country?.iso ?? iso.toUpperCase();
	const flagIso = isoLabel.toLowerCase();
	const hasFlag = flagIso.length === 2;

	return (
		<main className="flex min-h-screen flex-col">
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="flex items-center gap-4">
						<div className="flex h-12 aspect-4/3 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:h-24">
							{hasFlag ? (
								<Image
									src={`/flags/${flagIso}.svg`}
									alt={`${isoLabel} flag`}
									width={64}
									height={48}
									className="h-full w-full object-cover"
								/>
							) : (
								<span className="text-base font-semibold uppercase tracking-[0.35em]">
									{isoLabel}
								</span>
							)}
						</div>
						<div className="space-y-1">
							<h1 className="text-3xl font-semibold leading-tight text-zinc-950 dark:text-zinc-50 md:text-4xl">
								{countryName}
							</h1>
						</div>
					</div>

					{country ? (
						<div className="flex flex-wrap gap-3 text-sm">
							<span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-3 py-1.5 font-semibold text-muted-foreground shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
								{country.totalOrganisations} organisations
							</span>
							<span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-3 py-1.5 font-semibold text-muted-foreground shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
								{country.totalModels} models
							</span>
							<span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-3 py-1.5 font-semibold text-muted-foreground shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
								Latest: {country.latestModel?.name ?? "Pending"}
							</span>
						</div>
					) : (
						<div className="rounded-xl border border-dashed border-zinc-300 bg-white px-3 py-2 text-sm text-muted-foreground dark:border-zinc-700 dark:bg-zinc-900">
							We don&apos;t have data for this country yet.
						</div>
					)}
				</div>

				<div className="mt-6">
					<CountryTabs iso={isoLabel} />
				</div>

				<div className="mt-6">{children}</div>
			</div>
		</main>
	);
}
