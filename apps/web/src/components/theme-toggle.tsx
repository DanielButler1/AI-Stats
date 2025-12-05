"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	return (
		<Button
			type="button"
			variant="outline"
			size="icon"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="
				h-9 w-9 rounded-full
				flex items-center justify-center
				text-primary
				border border-border
				bg-transparent dark:bg-transparent
				shadow-none
				transition-colors
				hover:bg-zinc-100 dark:hover:bg-zinc-900
				focus:outline-hidden focus:ring-2 focus:ring-primary
			"
		>
			<Sun
				className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				aria-hidden="true"
			/>
			<Moon
				className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				aria-hidden="true"
			/>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
