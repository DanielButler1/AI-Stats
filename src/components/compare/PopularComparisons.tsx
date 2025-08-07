import { Construction } from "lucide-react";
import React from "react";

export default function PopularComparisons() {
	// Temporary UI for "Quick Comparisons coming soon"
	return (
		<div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[300px]">
			<h3 className="text-2xl font-bold mb-4 text-center tracking-tight">
				Quick Comparisons
			</h3>
			<div className="flex flex-col items-center justify-center bg-muted/50 rounded-xl p-8 border shadow-md">
				<span className="text-4xl mb-2">
					<Construction />
				</span>
				<p className="text-lg font-medium text-center mb-1">
					Coming soon!
				</p>
				<p className="text-sm text-muted-foreground text-center max-w-md">
					We&apos;re working on a new feature to help you instantly
					compare the most popular models. Stay tuned!
				</p>
			</div>
		</div>
	);
}
