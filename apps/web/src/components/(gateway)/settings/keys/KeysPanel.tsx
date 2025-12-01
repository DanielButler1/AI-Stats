"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import UsageItem from "./UsageItem";
import EditKeyItem from "./EditKeyItem";
import DeleteKeyItem from "./DeleteKeyItem";
import KeyLimitsItem from "./KeyLimitsItem";

export default function KeysPanel({ teamsWithKeys }: any) {
	// Ensure teams that have keys are shown first, preserving original relative order.
	const sortedTeams = useMemo(() => {
		if (!Array.isArray(teamsWithKeys)) return teamsWithKeys;
		// stable partition: keep relative order within groups
		const withKeys: any[] = [];
		const withoutKeys: any[] = [];
		for (const t of teamsWithKeys) {
			if (t && Array.isArray(t.keys) && t.keys.length > 0)
				withKeys.push(t);
			else withoutKeys.push(t);
		}
		return [...withKeys, ...withoutKeys];
	}, [teamsWithKeys]);

	if (!sortedTeams || sortedTeams.length === 0) {
		return (
			<div className="mt-6 text-sm text-muted-foreground">
				No teams or keys to manage.
			</div>
		);
	}

	return (
		<div className="mt-6 space-y-6">
			{sortedTeams.map((team: any) => (
				<div key={team.id ?? "personal"}>
					<div className="font-medium mb-2">{team.name}</div>
					{!team.keys || team.keys.length === 0 ? (
						<div className="text-sm text-muted-foreground">
							No keys for this team.
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{team.keys.map((k: any) => (
								<div
									key={k.id}
									className="relative p-4 border rounded-md bg-white dark:bg-zinc-950"
								>
									<div className="flex items-center">
										<div className="flex items-center flex-1">
											{/* status dot is now small and inline with title */}
											<div>
												<div className="mb-2 font-medium flex items-center gap-2">
													<span>{k.name}</span>

													{/* status dot: green for active, yellow for paused, fallback to gray (Unknown) */}
													<Tooltip delayDuration={0}>
														<TooltipTrigger asChild>
															<span className="relative flex size-2">
																<span
																	className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
																		k.status ===
																		"active"
																			? "bg-emerald-400"
																			: k.status ===
																			  "paused"
																			? "bg-amber-400"
																			: "bg-zinc-400"
																	} opacity-75`}
																></span>
																<span
																	className={`relative inline-flex size-2 rounded-full ${
																		k.status ===
																		"active"
																			? "bg-emerald-500"
																			: k.status ===
																			  "paused"
																			? "bg-amber-500"
																			: "bg-zinc-500"
																	}`}
																></span>
															</span>
														</TooltipTrigger>
														<TooltipContent>
															{k.status ===
															"active"
																? "Active"
																: k.status ===
																  "paused"
																? "Paused"
																: "Unknown"}
														</TooltipContent>
													</Tooltip>
												</div>

												<div className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
													{k.prefix}
												</div>
											</div>
										</div>
										<div className="ml-2">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														aria-label="Actions"
													>
														<MoreVertical />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													side="bottom"
													align="end"
												>
													<UsageItem k={k} />
													<EditKeyItem k={k} />
													<KeyLimitsItem k={k} />
													<DeleteKeyItem k={k} />
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			))}
		</div>
	);
}
