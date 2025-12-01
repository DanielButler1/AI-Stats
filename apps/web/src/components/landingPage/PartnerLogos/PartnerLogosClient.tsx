"use client";

import {
	Marquee,
	MarqueeContent,
	MarqueeFade,
	MarqueeItem,
} from "@/components/ui/marquee";
import { Logo } from "@/components/Logo";

type PartnerLogosClientProps = {
	logos: string[];
};

export default function PartnerLogosClient({ logos }: PartnerLogosClientProps) {
	return (
		<section className="text-left">
			<div className="relative">
				<div className="rounded border border-dashed py-2 px-1">
					<Marquee>
						<MarqueeFade side="left" />
						<MarqueeFade side="right" />
						<MarqueeContent pauseOnHover={false} speed={18}>
							{logos.map((logoId) => (
								<MarqueeItem
									key={logoId}
									className="flex items-center justify-center px-3 py-1"
								>
									<Logo
										id={logoId}
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
