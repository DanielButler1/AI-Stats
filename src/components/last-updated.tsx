"use client";

import React, { useState, useEffect } from "react";
import { formatRelativeToNow } from "@/lib/utils";

interface LastUpdatedProps {
	deployTime: string;
}

export default function LastUpdated({ deployTime }: LastUpdatedProps) {
	// Calculate initial value immediately to avoid flash of empty content
	const initialValue = deployTime
		? formatRelativeToNow(new Date(deployTime))
		: "";
	const [lastUpdated, setLastUpdated] = useState<string>(initialValue);
	useEffect(() => {
		// Define the update function inside useEffect to avoid dependency issues
		function updateLastUpdated() {
			if (!deployTime) {
				setLastUpdated("");
				return;
			}

			setLastUpdated(formatRelativeToNow(new Date(deployTime)));
		}

		// Update every minute to keep the relative time fresh
		const interval = setInterval(updateLastUpdated, 60000);

		// Return cleanup function
		return () => clearInterval(interval);
	}, [deployTime]);

	if (!deployTime) {
		return null;
	}

	return <span className="mt-1">Last updated: {lastUpdated}</span>;
}
