import {
	Announcement,
	AnnouncementTag,
	AnnouncementTitle,
} from "@/components/ui/announcement";
import Header from "@/components/header";
import DatabaseStats from "@/components/landingPage/DatabaseStatistics";
import ModelUpdates from "@/components/landingPage/ModelUpdates";
import PartnerLogos from "@/components/landingPage/PartnerLogos/PartnerLogos";
import { fetchAggregateData } from "@/lib/fetchData";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Pill, ThemedGitHubIcon, LiveDot } from "@/components/landingPage/Pill";

export default async function Page() {
	const aggregateData = await fetchAggregateData();

	// console.log("Aggregate Data:", aggregateData);

	return (
		<>
			<Header />
			<div className="container space-y-8 mx-auto mt-12 text-center mb-12 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col space-y-4">
					<div>
						<Link href="models/gpt-5-2025-08-07">
							<Announcement>
								<AnnouncementTag>Latest Update</AnnouncementTag>
								<AnnouncementTitle>
									GPT-5 Is Here!
								</AnnouncementTitle>
								<ArrowUpRight
									className="shrink-0 text-muted-foreground"
									size={16}
								/>
							</Announcement>
						</Link>
					</div>

					<div>
						<h1 className="text-4xl md:text-5xl font-semibold mb-2 text-gray-900 dark:text-gray-100 drop-shadow-xs animate-fade-in">
							The Most Comprehensive AI Model Database
						</h1>
					</div>

					{/* Pills row */}
					<div className="flex justify-center gap-3 flex-wrap">
						<Pill
							href="https://github.com/DanielButler1/AI-Stats"
							label="Fully Open Source"
							icon={<ThemedGitHubIcon />}
							target="_blank"
							rel="noopener noreferrer"
							ariaLabel="Open GitHub repository"
						/>
						<Pill
							href="models/updates"
							label="Instant Updates"
							icon={<LiveDot className="mr-1" />}
							rightIcon={null}
							ariaLabel="Dataset updates as soon as available"
						/>
						<Pill
							href="https://discord.gg/zDw73wamdX"
							label="Join our Discord"
							icon={
								<Image
									src="/social/discord.svg"
									alt="Discord"
									width={16}
									height={16}
									className="w-4 h-4"
								/>
							}
							target="_blank"
							rel="noopener noreferrer"
							ariaLabel="Join our Discord"
						/>
					</div>
				</div>

				<DatabaseStats data={aggregateData} />
				<div className="space-y-8">
					<ModelUpdates models={aggregateData} />
					<PartnerLogos />
				</div>
			</div>
		</>
	);
}
