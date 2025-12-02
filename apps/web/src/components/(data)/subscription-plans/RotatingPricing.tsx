"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SubscriptionPlanDetails } from "@/lib/fetchers/subscription-plans/getSubscriptionPlan";

interface RotatingPricingProps {
	prices?: {
		price: number;
		currency: string;
		frequency: string;
	}[];
}

export default function RotatingPricing({ prices }: RotatingPricingProps) {
	console.log("RotatingPricing prices:", prices);

	if (!prices || prices.length === 0) {
		return null;
	}

	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		console.log("useEffect running, prices.length:", prices.length);
		if (prices.length > 1) {
			console.log("Setting interval for rotation");
			const interval = setInterval(() => {
				setCurrentIndex((prev) => {
					const next = (prev + 1) % prices.length;
					console.log("Rotating to index:", next);
					return next;
				});
			}, 5000); // Rotate every 5 seconds

			return () => {
				console.log("Clearing interval");
				clearInterval(interval);
			};
		} else {
			console.log("Not rotating, only one price");
		}
	}, [prices.length]);

	const currentPrice = prices[currentIndex];
	console.log("Current price index:", currentIndex, "price:", currentPrice);

	const formatPrice = (
		price: number,
		currency: string,
		frequency: string
	) => {
		const formatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		});

		const period =
			frequency === "monthly"
				? "/mo"
				: frequency === "yearly"
				? "/yr"
				: frequency === "daily"
				? "/day"
				: "";

		return `${formatter.format(price)}${period}`;
	};

	return (
		<div className="text-2xl font-bold text-primary">
			<AnimatePresence mode="wait">
				<motion.div
					key={currentIndex}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.3 }}
				>
					{formatPrice(
						currentPrice.price,
						currentPrice.currency,
						currentPrice.frequency
					)}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
