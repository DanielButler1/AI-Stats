import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Provider } from "@/data/types";
import { Button } from "@/components/ui/button";

export default function ProviderCard({ provider }: { provider: Provider }) {
	return (
		<Card
			style={{ borderColor: provider.colour || undefined }}
			className={cn(
				"h-full flex flex-col shadow-lg relative dark:shadow-zinc-900/25 dark:bg-zinc-950 transition-transform transform hover:scale-105 duration-200 ease-in-out",
				provider.colour && "border-2"
			)}
		>
			<CardContent className="flex flex-row items-center gap-3 pt-6">
				<Link
					href={`providers/${provider.provider_id}`}
					className="group"
				>
					<div className="w-10 h-10 relative flex items-center justify-center rounded-full border bg-white">
						<div className="w-7 h-7 relative">
							<Image
								src={`/providers/${provider.provider_id}.svg`}
								alt={provider.name}
								className="group-hover:opacity-80 transition object-contain"
								fill
							/>
						</div>
					</div>
				</Link>
				<div className="flex flex-col min-w-0 flex-1">
					<Link
						href={`providers/${provider.provider_id}`}
						className="font-semibold truncate text-lg leading-tight"
					>
						<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
							{provider.name}
						</span>
					</Link>
					{provider.country_code && (
						<span className="mt-1 text-xs text-muted-foreground truncate flex items-center gap-1">
							<Image
								src={`/flags/${provider.country_code.toLowerCase()}.svg`}
								alt={provider.country_code}
								width={20}
								height={14}
								className="inline-block rounded-sm border"
							/>
						</span>
					)}
				</div>
				<div className="ml-auto flex items-center gap-1">
					<Button
						asChild
						size="icon"
						variant="ghost"
						tabIndex={-1}
						className="group"
						style={
							{
								"--provider-color":
									provider.colour ?? "inherit",
							} as React.CSSProperties
						}
					>
						<Link
							href={`providers/${provider.provider_id}`}
							aria-label={`Go to ${provider.name} details`}
							tabIndex={-1}
						>
							<ArrowRight className="w-5 h-5 transition-colors group-hover:text-(--provider-color)" />
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
