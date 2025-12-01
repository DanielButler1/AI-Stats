import Link from "next/link";

export default function LegalLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-background">
			<header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center">
						<Link
							href="/"
							className="flex items-center text-xl font-semibold tracking-tight text-foreground hover:text-foreground/80 transition-colors"
						>
							AI Stats
						</Link>
					</div>
				</div>
			</header>
			{children}
		</div>
	);
}
