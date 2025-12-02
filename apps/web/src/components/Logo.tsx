"use client";

import { type ReactNode, useMemo } from "react";
import Image, { type ImageProps } from "next/image";
import { useTheme } from "next-themes";
import { resolveLogo, type LogoVariant, type LogoTheme } from "@/lib/logos";

type LogoImageProps = Omit<ImageProps, "src" | "alt"> & {
	id: string;
	alt?: string;
	variant?: LogoVariant;
	forceTheme?: LogoTheme;
	fallback?: ReactNode;
	fallbackToColor?: boolean;
};

export function Logo({
	id,
	alt,
	variant = "auto",
	forceTheme,
	fallback = null,
	fallbackToColor = true,
	...imageProps
}: LogoImageProps) {
	const { resolvedTheme } = useTheme();

	const theme: LogoTheme =
		forceTheme ?? (resolvedTheme === "dark" ? "dark" : "light");

	const resolved = useMemo(
		() =>
			resolveLogo(id, {
				variant,
				theme,
				fallbackToColor,
			}),
		[id, variant, theme, fallbackToColor]
	);

	if (!resolved.src) return fallback;

	return (
		<Image alt={alt ?? resolved.label} src={resolved.src} {...imageProps} />
	);
}

export type { LogoVariant } from "@/lib/logos";
