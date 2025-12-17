import { Suspense } from "react";
import { InternalClient } from "./InternalClient";

export default function InternalPage() {
	return (
		<div className="container mx-auto py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Internal Admin</h1>
				<p className="text-muted-foreground mt-2">
					Administrative controls and system management
				</p>
			</div>

			<Suspense
				fallback={
					<div className="flex items-center justify-center py-8">
						Loading...
					</div>
				}
			>
				<InternalClient />
			</Suspense>
		</div>
	);
}
