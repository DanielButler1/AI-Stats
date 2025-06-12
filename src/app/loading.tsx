export default function Loading() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<div className="flex flex-col items-center">
				<span className="sr-only">Loading...</span>
				<div className="relative w-16 h-16 mb-4">
					<div className="absolute inset-0 rounded-full border-4 border-dashed border-muted-foreground/20 border-t-transparent animate-spin" />
					<div className="absolute inset-2 flex items-center justify-center bg-background rounded-full shadow-inner">
						<svg
							className="w-6 h-6 text-muted-foreground/60 animate-pulse"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M13 16h-1v-4h-1m1-4h.01"
							/>
						</svg>
					</div>
				</div>
				<p className="mt-2 text-lg font-medium text-foreground/80 text-center">
					Loading...
					<br />
				</p>
			</div>
		</div>
	);
}
