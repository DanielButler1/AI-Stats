import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";

interface UnavailableProps {
	modelId: string;
}

export default function Unavailable({ modelId }: UnavailableProps) {
	const friendlyModelId = safeDecodeURIComponent(modelId);

	return (
		<Card className="border-dashed border-primary/40">
			<CardHeader>
				<CardTitle>Gateway availability</CardTitle>
				<CardDescription>
					This model does not yet have an active provider in the
					gateway.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<Alert>
					<AlertTriangle className="h-4 w-4" />
					<AlertTitle>Currently unavailable</AlertTitle>
					<AlertDescription>
						We&apos;re working on onboarding providers for{" "}
						<code>{friendlyModelId || modelId}</code>. Check back soon or request
						access below.
					</AlertDescription>
				</Alert>
				<Link
					href="/contact"
					className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
				>
					Request provider support
					<ArrowRight className="h-4 w-4" />
				</Link>
			</CardContent>
		</Card>
	);
}
