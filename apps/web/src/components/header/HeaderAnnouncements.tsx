import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function HeaderAnnouncements({
	message,
	href,
	label = "New Release",
	secondaryLabel,
	secondaryHref,
}: {
	message: string;
	href?: string;
	label?: string;
	secondaryLabel?: string;
	secondaryHref?: string;
}) {
	if (!message) return null;

	return (
		<div className="border-t border-zinc-200/60 bg-white/80 dark:border-zinc-800/60 dark:bg-zinc-950/80 backdrop-blur">
			<div className="container mx-auto px-4">
				<div className="flex flex-wrap items-center justify-center gap-3 py-2 text-sm">
					<span className="text-sm font-semibold text-foreground">
						{label}
					</span>
					<span className="text-xs text-foreground/50">|</span>
					{href ? (
						<Link
							href={href}
							className="flex items-center gap-2 font-medium text-foreground/80 hover:underline underline-offset-4"
						>
							<span>{message}</span>
							<ArrowUpRight className="h-4 w-4" />
						</Link>
					) : (
						<span className="flex items-center gap-2 font-medium text-foreground/80">
							{message}
							<ArrowUpRight className="h-4 w-4" />
						</span>
					)}
					{secondaryLabel && secondaryHref ? (
						<>
							<span className="text-xs text-foreground/50">|</span>
							<Link
								href={secondaryHref}
								className="flex items-center gap-2 font-medium text-foreground/80 hover:underline underline-offset-4"
							>
								<span>{secondaryLabel}</span>
								<ArrowUpRight className="h-4 w-4" />
							</Link>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
}
