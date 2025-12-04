import * as React from "react";
import { type ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	AlertCircle,
	CheckCircle2,
	Loader2,
	Sparkles,
	UploadCloud,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import type { ProviderConfig, ProviderState } from "./types";

interface UploadCardProps {
	config: ProviderConfig;
	state: ProviderState;
	onFileSelected: (file: File | undefined) => void;
}

export default function UploadCard({
	config,
	state,
	onFileSelected,
}: UploadCardProps) {
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		onFileSelected(file);
		event.target.value = "";
	};

	const statusContent = (() => {
		switch (state.status) {
			case "processing":
				return (
					<div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
						<Loader2 className="h-4 w-4 animate-spin" />
						Processing your archive...
					</div>
				);
			case "ready":
				return (
					<div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-300">
						<CheckCircle2 className="h-4 w-4" />
						Ready
					</div>
				);
			case "error":
				return (
					<div className="flex items-center gap-2 text-sm text-rose-500">
						<AlertCircle className="h-4 w-4" />
						{state.error ?? "Something went wrong"}
					</div>
				);
			default:
				return (
					<div className="text-sm text-zinc-500 dark:text-zinc-300">
						Drop or click to upload (.json, .csv, .txt, .zip)
					</div>
				);
		}
	})();

	return (
		<label className="group relative h-full cursor-pointer">
			<input
				type="file"
				accept=".json,.csv,.txt,.zip"
				className="sr-only"
				onChange={handleChange}
			/>

			<div
				className={cn(
					"relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-950/90",
					state.status === "processing" &&
						"border-emerald-200/80 shadow-lg shadow-emerald-500/20 dark:border-emerald-500/40",
					state.status === "error" &&
						"border-rose-300 shadow-lg shadow-rose-500/20 dark:border-rose-600"
				)}
			>
				<div
					className={cn(
						"pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100",
						"bg-gradient-to-br",
						config.accent
					)}
					aria-hidden="true"
				/>

				<div className="relative z-10 space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="rounded-full bg-white/80 p-2 shadow dark:bg-zinc-900/80">
								{config.logo ? (
									<Logo
										id={config.logo
											.replace("/logos/", "")
											.replace(".svg", "")}
										alt={config.name}
										width={28}
										height={28}
									/>
								) : (
									<Sparkles className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
								)}
							</div>
							<div>
								<h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
									{config.name}
								</h3>
								<p className="text-xs text-zinc-500 dark:text-zinc-400">
									{config.description}
								</p>
							</div>
						</div>
						<UploadCloud className="h-5 w-5 text-zinc-400 transition group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300" />
					</div>

					<div>{statusContent}</div>
				</div>

				{state.file ? (
					<div className="relative z-10 mt-6 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
						<span className="truncate">{state.file.name}</span>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="h-7 px-2 text-xs"
							onClick={(event) => {
								event.preventDefault();
								onFileSelected(undefined);
							}}
						>
							Clear
						</Button>
					</div>
				) : null}
			</div>
		</label>
	);
}
