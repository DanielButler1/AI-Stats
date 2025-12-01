"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
	customerId: string;
	returnUrl?: string;
	className?: string;
	label?: string;
};

export function StripePortalButton({
	customerId,
	returnUrl,
	className,
	label = "Open Stripe Customer Portal",
}: Props) {
	const [loading, setLoading] = useState(false);

	return (
		<Button
			type="button"
			disabled={loading}
			className={cn("gap-2", className)}
			onClick={async () => {
				if (!customerId) return;
				setLoading(true);
				try {
					const resp = await fetch("/api/stripe/billing-portal", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							customerId,
							returnUrl: returnUrl ?? window.location.href,
						}),
					});
					const data = await resp.json();
					if (data?.url) {
						window.location.href = data.url;
					}
				} catch (err) {
					console.error("Failed to open billing portal", err);
				} finally {
					setLoading(false);
				}
			}}
		>
			{loading ? "Opening portal…" : label}
		</Button>
	);
}
