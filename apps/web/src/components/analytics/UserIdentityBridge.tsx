"use client";

import { useEffect, useRef } from "react";
import type { Session } from "@supabase/supabase-js";
import posthog from "posthog-js";
import { GA_MEASUREMENT_ID, POSTHOG_KEY } from "@/lib/analytics";
import { createClient } from "@/utils/supabase/client";

declare global {
	// gtag is injected by the GA4 script tag in layout.
	interface Window {
		gtag: (...args: unknown[]) => void;
	}
}

function applyGoogleAnalyticsUserId(userId: string | null) {
	if (typeof window === "undefined") return;
	if (typeof window.gtag !== "function") return;
	if (!GA_MEASUREMENT_ID) return;

	window.gtag("config", GA_MEASUREMENT_ID, { user_id: userId ?? null });
}

function applyPosthogIdentity(session: Session | null) {
	if (!POSTHOG_KEY) return;

	const userId = session?.user?.id ?? null;
	if (userId) {
		posthog.identify(userId, {
			email: session?.user?.email ?? undefined,
		});
	} else {
		posthog.reset();
	}
}

export function UserIdentityBridge({ enabled }: { enabled: boolean }) {
	const lastSeenUserId = useRef<string | null>(null);

	useEffect(() => {
		if (!enabled) return;

		const supabase = createClient();

		const syncIdentity = (session: Session | null) => {
			const userId = session?.user?.id ?? null;

			if (lastSeenUserId.current === userId) return;
			lastSeenUserId.current = userId;

			applyGoogleAnalyticsUserId(userId);
			applyPosthogIdentity(session);
		};

		supabase.auth.getSession().then(({ data }) => {
			syncIdentity(data.session);
		});

		const { data: authListener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				syncIdentity(session);
			}
		);

		return () => {
			authListener?.subscription.unsubscribe();
		};
	}, [enabled]);

	return null;
}
