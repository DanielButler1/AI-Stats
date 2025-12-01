"use client";

import HEYO from "@heyo.so/js";

const openChat = () => {
	HEYO.show({ force: true });
	HEYO.open({ force: true });
};

export function openHeyo() {
	if (typeof window === "undefined") return;
	if (HEYO.ready) {
		openChat();
		return;
	}

	HEYO.onReady(openChat);
	// In case HEYO is still initializing and onReady fires before this code runs,
	// make sure we still queue the show/open calls.
	openChat();
}
