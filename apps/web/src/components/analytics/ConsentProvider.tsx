"use client";

import {
	ConsentManagerDialog,
	ConsentManagerProvider,
	CookieBanner,
} from "@c15t/nextjs";
import { useConsentManager } from "@c15t/nextjs/client";
import { ReactNode, useMemo } from "react";
import { GA_MEASUREMENT_ID, POSTHOG_KEY } from "@/lib/analytics";
import { ConsentAwareAnalytics } from "./ConsentAwareAnalytics";
import { UserIdentityBridge } from "./UserIdentityBridge";

function AnalyticsConsentGate({ children }: { children: ReactNode }) {
	const { has } = useConsentManager();
	const analyticsAllowed = has("measurement");

	return (
		<>
			<ConsentAwareAnalytics
				analyticsAllowed={analyticsAllowed}
				hasGAId={Boolean(GA_MEASUREMENT_ID)}
				hasPosthogKey={Boolean(POSTHOG_KEY)}
			/>
			<UserIdentityBridge enabled={analyticsAllowed} />
			{children}
		</>
	);
}

export function ConsentProvider({ children }: { children: ReactNode }) {
	return (
		<ConsentManagerProvider
			options={{
				mode: "offline",
				consentCategories: ["necessary", "measurement", "marketing"],
				legalLinks: {
					privacyPolicy: {
						href: "/privacy-policy",
						label: "Privacy Policy",
					},
					termsOfService: {
						href: "/terms-of-service",
						label: "Terms of Service",
					},
				},
			}}
		>
			<CookieBanner
				noStyle
				theme={{
					// Root container: fixed bottom-right
					"banner.root":
						"fixed bottom-4 right-4 z-50 w-full max-w-md pointer-events-auto",

					// Card
					"banner.card":
						"rounded-xl border bg-background text-foreground shadow-lg p-4 flex flex-col gap-3",

					// Header
					"banner.header.root": "space-y-1",
					"banner.header.title": "text-sm font-semibold",
					"banner.header.description":
						"text-xs text-muted-foreground leading-relaxed",

					// Footer container
					"banner.footer": "mt-3 flex items-center w-full",

					// Buttons
					"banner.footer.reject-button":
						"mr-2 inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground",

					"banner.footer.accept-button":
						"inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90",

					"banner.footer.customize-button":
						"ml-auto inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				}}
			/>

			<ConsentManagerDialog />
			<AnalyticsConsentGate>{children}</AnalyticsConsentGate>
		</ConsentManagerProvider>
	);
}
