"use client";

import Image from "next/image";
import {
	Marquee,
	MarqueeContent,
	MarqueeFade,
	MarqueeItem,
} from "@/components/ui/marquee";
import { useTheme } from "next-themes";

type PartnerLogosClientProps = {
	providerLogos: string[];
};

export default function PartnerLogosClient({
	providerLogos,
}: PartnerLogosClientProps) {
	const { resolvedTheme } = useTheme();
	const filteredLogos = providerLogos.filter((logoPath) => {
		if (resolvedTheme === "dark") {
			return !logoPath.includes("_light");
		} else {
			return !logoPath.includes("_dark");
		}
	});

	return (
		<section className="text-left">
			{/* Content */}
			<div className="relative">
				<div className="rounded border py-2 px-1">
					<Marquee>
						<MarqueeFade side="left" />
						<MarqueeFade side="right" />
						<MarqueeContent pauseOnHover={false} speed={20}>
							{filteredLogos.map((logoPath) => (
								<MarqueeItem
									key={logoPath}
									className="flex items-center justify-center px-3 py-1"
								>
									<Image
										src={logoPath}
										alt={`${logoPath} logo`}
										width={36}
										height={36}
										className="opacity-80 transition-all duration-200 ease-out hover:opacity-100"
									/>
								</MarqueeItem>
							))}
						</MarqueeContent>
					</Marquee>
				</div>
			</div>
		</section>
	);
}
