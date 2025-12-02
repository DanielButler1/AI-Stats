import type { Metadata } from "next";
import { SdkCard } from "@/components/(gateway)/settings/sdk/SdkCard";

type Sdk = {
	name: string;
	packageName: string;
	installCommand: string;
	logoId: string;
	managerLink: string;
	supported: boolean;
};

const SDKS: Sdk[] = [
	{
		name: "TypeScript SDK",
		packageName: "@ai-stats/ts-sdk",
		installCommand: "npm install @ai-stats/ts-sdk",
		logoId: "typescript",
		managerLink: "https://www.npmjs.com/package/@ai-stats/ts-sdk",
		supported: true,
	},
	{
		name: "Python SDK",
		packageName: "ai-stats-py-sdk",
		installCommand: "pip install ai-stats-py-sdk",
		logoId: "python",
		managerLink: "https://pypi.org/project/ai-stats-py-sdk/",
		supported: true,
	},
	{
		name: "C++ SDK",
		packageName: "@ai-stats/cpp-sdk",
		installCommand: "Coming soon",
		logoId: "cpp",
		managerLink: "https://conan.io/",
		supported: false,
	},
	{
		name: "C# SDK",
		packageName: "@ai-stats/csharp-sdk",
		installCommand: "Coming soon",
		logoId: "csharp",
		managerLink: "https://www.nuget.org/",
		supported: false,
	},
	{
		name: "Go SDK",
		packageName: "@ai-stats/go-sdk",
		installCommand: "Coming soon",
		logoId: "go",
		managerLink: "https://pkg.go.dev/",
		supported: false,
	},
	{
		name: "Java SDK",
		packageName: "@ai-stats/java-sdk",
		installCommand: "Coming soon",
		logoId: "java",
		managerLink: "https://search.maven.org/",
		supported: false,
	},
	{
		name: "PHP SDK",
		packageName: "@ai-stats/php-sdk",
		installCommand: "Coming soon",
		logoId: "php",
		managerLink: "https://packagist.org/",
		supported: false,
	},
	{
		name: "Ruby SDK",
		packageName: "@ai-stats/ruby-sdk",
		installCommand: "Coming soon",
		logoId: "ruby",
		managerLink: "https://rubygems.org/",
		supported: false,
	},
	{
		name: "Rust SDK",
		packageName: "@ai-stats/rust-sdk",
		installCommand: "Coming soon",
		logoId: "rust",
		managerLink: "https://crates.io/",
		supported: false,
	},
];

export const metadata: Metadata = {
	title: "SDKs - Settings",
	description:
		"TypeScript and Python SDKs for the AI Stats gateway plus the next languages we plan to support.",
};

export default function SettingsSdkPage() {
	return (
		<main className="space-y-10">
			<section className="space-y-3">
				<div className="text-xs font-semibold uppercase tracking-[0.3rem] text-zinc-500">
					SDKs
				</div>
				<div className="space-y-2">
					<h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
						SDKs for the AI Stats gateway
					</h1>
					<p className="text-base text-zinc-600 dark:text-zinc-300">
						TypeScript and Python SDKs are ready to install today.
						We&apos;re also planning for C++, C#, Go, Java, PHP,
						Ruby, and Rust so every team can build with their
						preferred language.
					</p>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
					Supported SDKs
				</h2>
				<div className="space-y-4">
					{SDKS.filter((sdk) => sdk.supported).map((sdk) => (
						<SdkCard key={sdk.packageName} sdk={sdk} />
					))}
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
					Coming Soon
				</h2>
				<div className="space-y-4">
					{SDKS.filter((sdk) => !sdk.supported).map((sdk) => (
						<div key={sdk.packageName} className="opacity-60">
							<SdkCard sdk={sdk} />
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
