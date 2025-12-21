import posthog from "posthog-js";
import { POSTHOG_API_HOST, POSTHOG_KEY } from "@/lib/analytics";

if (typeof window !== "undefined" && POSTHOG_KEY) {
	posthog.init(POSTHOG_KEY, {
		api_host: POSTHOG_API_HOST,
		defaults: "2025-05-24",
		autocapture: true,
		capture_pageview: true,
		debug: process.env.NODE_ENV === "development",
	});
}