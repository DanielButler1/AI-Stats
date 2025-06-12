import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: { default: "AI Stats", template: "%s | AI Stats" },
	description:
		"Browse and compare state-of-the-art AI models, benchmarks, features, and pricing.",
	authors: [{ name: "Daniel Butler" }],
	openGraph: {
		type: "website",
		locale: "en_GB",
		siteName: "AI Stats",
		url: "https://ai-stats.phaseo.app",
		title: "AI Stats",
		description:
			"Browse and compare state-of-the-art AI models, benchmarks, features, and pricing.",
		images: [
			{
				url: "https://ai-stats.phaseo.app/og.png",
				width: 1200,
				height: 630,
				alt: "AI Stats - Browse and compare AI models",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@phaseoapp",
		creator: "@DanielButler001",
		title: "AI Stats",
		description:
			"Browse and compare state-of-the-art AI models, benchmarks, features, and pricing.",
		images: ["https://ai-stats.phaseo.app/og.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					`${montserrat.className}`,
					"bg-background antialiased min-h-screen flex flex-col"
					// "[background-size:8px_8px] sm:[background-size:12px_12px] md:[background-size:20px_20px]",
					// "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
					// "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
				)}
			>
				<GoogleAnalytics gaId="G-BG2L1NPYGL" />
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem={false}
					disableTransitionOnChange
				>
					<div className="flex flex-col min-h-screen">
						<main className="flex-1 flex flex-col">
							{children}
							<Analytics />
						</main>
						<Footer />
					</div>
					<TailwindIndicator />
				</ThemeProvider>
				<Toaster richColors />
			</body>
		</html>
	);
}
