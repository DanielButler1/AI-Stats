"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import {
	GA_MEASUREMENT_ID,
	POSTHOG_API_HOST,
	POSTHOG_KEY,
	POSTHOG_UI_HOST,
} from "@/lib/analytics";

declare global {
	interface Window {
		dataLayer: unknown[];
		gtag: (...args: unknown[]) => void;
	}
}

function loadGA() {
	if (!GA_MEASUREMENT_ID) return;
	if (typeof window === "undefined") return;
	if (typeof window.gtag === "function") return; // already loaded

	// Inject GA4 script lazily.
	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
	document.head.appendChild(script);

	window.dataLayer = window.dataLayer || [];
	function gtag(...args: unknown[]) {
		window.dataLayer?.push(args);
	}
	window.gtag = gtag;
	window.gtag("js", new Date());
	window.gtag("config", GA_MEASUREMENT_ID, {
		anonymize_ip: true,
		send_page_view: true,
	});
}

function updateGAConsent(allowed: boolean) {
	if (typeof window === "undefined") return;
	if (typeof window.gtag !== "function") return;

	window.gtag("consent", "update", {
		analytics_storage: allowed ? "granted" : "denied",
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied",
	});
}

function ensurePosthogInitialised() {
	if (!POSTHOG_KEY) return false;
	if (posthog.__loaded) return true;

	posthog.init(POSTHOG_KEY, {
		api_host: POSTHOG_API_HOST,
		ui_host: POSTHOG_UI_HOST,
		cookieless_mode: "on_reject",
		autocapture: false,
		capture_pageview: false,
		persistence: "localStorage",
		// Keep default opt-out until we explicitly opt-in via consent.
		opt_out_capturing_by_default: true,
		debug: process.env.NODE_ENV === "development",
	});

	return true;
}

export function ConsentAwareAnalytics({
	analyticsAllowed,
	hasGAId,
	hasPosthogKey,
}: {
	analyticsAllowed: boolean;
	hasGAId: boolean;
	hasPosthogKey: boolean;
}) {
	const gaLoadedRef = useRef(false);
	const posthogInitialisedRef = useRef(false);

	useEffect(() => {
		if (
			analyticsAllowed &&
			hasPosthogKey &&
			!posthogInitialisedRef.current
		) {
			posthogInitialisedRef.current = ensurePosthogInitialised();
		}

		if (posthogInitialisedRef.current) {
			if (analyticsAllowed) {
				posthog.opt_in_capturing();
			} else {
				posthog.opt_out_capturing();
			}
		}
	}, [analyticsAllowed, hasPosthogKey]);

	useEffect(() => {
		if (analyticsAllowed && hasGAId && !gaLoadedRef.current) {
			loadGA();
			gaLoadedRef.current = true;
		}

		// Even if the script is already loaded, push consent updates.
		if (gaLoadedRef.current) {
			updateGAConsent(analyticsAllowed);
		}
	}, [analyticsAllowed, hasGAId]);

	return null;
}
