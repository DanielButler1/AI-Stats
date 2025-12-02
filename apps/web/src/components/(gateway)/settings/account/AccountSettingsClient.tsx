"use client";

import * as React from "react";
import { toast } from "sonner";
import {
	updateAccount,
	deleteAccount,
} from "@/app/(dashboard)/settings/account/actions";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldAlert, Trash2, User } from "lucide-react";

export type UserPayload = {
	id: string;
	displayName?: string | null;
	email?: string | null;
	defaultTeamId?: string | null;
	obfuscateInfo: boolean;
	createdAt: string;
};

type TeamOption = { id: string; name: string };

type Props = {
	user: UserPayload;
	teams: TeamOption[];
};

const schema = z.object({
	display_name: z
		.string()
		.trim()
		.max(60, "Display name must be 60 characters or fewer.")
		.optional()
		.nullable(),
	default_team_id: z
		.string()
		.trim()
		.min(1, "Team ID cannot be empty.")
		.optional()
		.nullable(),
	obfuscate_info: z.boolean(),
});

export default function AccountSettingsClient({ user, teams }: Props) {
	const [displayName, setDisplayName] = React.useState<string | null>(
		user.displayName ?? null
	);

	// Force a default team: if the user has no default and teams exist,
	// select the first team automatically. If there are no teams, we'll
	// display a disabled 'Personal' input (defaultTeamId remains null).
	const initialDefaultTeam =
		user.defaultTeamId ?? (teams && teams.length > 0 ? teams[0].id : null);
	const [defaultTeamId, setDefaultTeamId] = React.useState<string | null>(
		initialDefaultTeam
	);
	const [obfuscateInfo, setObfuscateInfo] = React.useState<boolean>(
		!!user.obfuscateInfo
	);

	const [saving, setSaving] = React.useState(false);
	const [deleting, setDeleting] = React.useState(false);

	const initial = React.useMemo(
		() => ({
			display_name: user.displayName ?? null,
			default_team_id: user.defaultTeamId ?? null,
			obfuscate_info: !!user.obfuscateInfo,
		}),
		[user]
	);

	const current = {
		display_name: displayName,
		default_team_id: defaultTeamId,
		obfuscate_info: obfuscateInfo,
	};
	const hasChanges = JSON.stringify(initial) !== JSON.stringify(current);

	async function handleSave(e?: React.FormEvent) {
		e?.preventDefault();
		const parsed = schema.safeParse(current);
		if (!parsed.success) {
			const msg =
				parsed.error.errors[0]?.message ?? "Please check your inputs.";
			toast.error(msg);
			return;
		}

		setSaving(true);
		try {
			await toast.promise(updateAccount(parsed.data), {
				loading: "Saving your settings…",
				success: "Saved ✅",
				error: (err: any) => err?.message || "Could not save settings",
			});
		} catch (e) {
			void e;
		} finally {
			setSaving(false);
		}
	}

	async function handleDeleteAccount() {
		setDeleting(true);
		try {
			await toast.promise(deleteAccount(), {
				loading: "Deleting your account…",
				success: "Account deleted. Goodbye 👋",
				error: (err: any) => err?.message || "Could not delete account",
			});
			// Redirect
			window.location.href = "/";
		} catch (e) {
			void e;
		} finally {
			setDeleting(false);
		}
	}

	return (
		<div className="space-y-8">
			{/* Account Card */}
			<Card className="border">
				<CardHeader className="flex flex-row items-start justify-between gap-4">
					<div>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							Account
						</CardTitle>
						<CardDescription>
							Edit the basics of your profile.
						</CardDescription>
					</div>
					{hasChanges ? (
						<Badge variant="secondary">Unsaved changes</Badge>
					) : (
						<Badge variant="outline">Up to date</Badge>
					)}
				</CardHeader>

				<Separator />

				<form onSubmit={handleSave}>
					<CardContent className="pt-6 grid gap-6 max-w-2xl">
						{/* Display Name */}
						<div className="grid gap-2">
							<Label htmlFor="displayName">Display name</Label>
							<Input
								id="displayName"
								value={displayName ?? ""}
								maxLength={60}
								placeholder="e.g. Daniel"
								onChange={(e) =>
									setDisplayName(
										e.target.value ? e.target.value : null
									)
								}
							/>
							<p className="text-xs text-muted-foreground">
								This is how your name appears to other people.
							</p>
						</div>

						{/* Email (read-only, nice to show) */}
						{user.email ? (
							<div className="grid gap-2">
								<Label>Email</Label>
								<Input value={user.email} readOnly />
								<p className="text-xs text-muted-foreground">
									Contact support to change your sign-in
									email.
								</p>
							</div>
						) : null}

						{/* Default Team */}
						<div className="grid gap-2">
							<Label htmlFor="defaultTeam">Default team</Label>

							{teams && teams.length > 0 ? (
								<Select
									value={defaultTeamId ?? ""}
									onValueChange={(v) =>
										setDefaultTeamId(v || null)
									}
								>
									<SelectTrigger
										id="defaultTeam"
										className="w-full"
									>
										<SelectValue placeholder="Select default team" />
									</SelectTrigger>
									<SelectContent>
										{teams.map((t) => (
											<SelectItem key={t.id} value={t.id}>
												{t.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : (
								// No teams: show a disabled, non-interactive "Personal" input
								<Input
									id="defaultTeam"
									value={"Personal"}
									readOnly
									disabled
								/>
							)}

							<p className="text-xs text-muted-foreground">
								Set the project that is shown by default.
							</p>
						</div>

						{/*
						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="space-y-1">
								<Label>Obfuscate info</Label>
								<p className="text-sm text-muted-foreground">
									Hide sensitive information across the UI
									(IDs, tokens, etc.) - this will apply until
									the setting is turned off.
								</p>
							</div>
							<Switch
								checked={obfuscateInfo}
								onCheckedChange={setObfuscateInfo}
								aria-label="Toggle obfuscation"
							/>
						</div>
						*/}
					</CardContent>

					<CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-xs text-muted-foreground">
							Member since{" "}
							{new Date(user.createdAt).toLocaleDateString()}
						</p>

						<div className="flex items-center gap-2 sm:justify-end">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									// Reset to initial
									setDisplayName(initial.display_name);
									setDefaultTeamId(initialDefaultTeam);
									setObfuscateInfo(initial.obfuscate_info);
								}}
								disabled={!hasChanges || saving}
							>
								Reset
							</Button>
							<Button
								type="submit"
								disabled={!hasChanges || saving}
							>
								{saving ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving…
									</>
								) : (
									"Save changes"
								)}
							</Button>
						</div>
					</CardFooter>
				</form>
			</Card>

			{/* Danger Zone */}
			<Card className="border border-destructive/30">
				<CardHeader className="flex flex-row items-start justify-between gap-4">
					<div>
						<CardTitle className="flex items-center gap-2 text-destructive">
							<ShieldAlert className="h-5 w-5" />
							Danger zone
						</CardTitle>
						<CardDescription>
							Deleting your account permanently removes all your
							data. This cannot be undone.
						</CardDescription>
					</div>
				</CardHeader>

				<Separator />

				<CardContent className="pt-6 grid sm:grid-cols-[1fr_auto] gap-3 items-center">
					<div className="flex gap-2 justify-end">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="destructive">
									<Trash2 className="mr-2 h-4 w-4" />
									Delete account
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Delete account?
									</AlertDialogTitle>
									<AlertDialogDescription>
										This will permanently remove your
										account and all associated data. You
										will lose all remaining credits, and
										every team you own will be deleted. Type{" "}
										<span className="font-semibold">
											DELETE
										</span>{" "}
										to confirm.
									</AlertDialogDescription>
								</AlertDialogHeader>

								<ConfirmDelete
									onConfirm={handleDeleteAccount}
									deleting={deleting}
								/>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

/** Small inline confirmation block to guard destructive action */
function ConfirmDelete({
	onConfirm,
	deleting,
}: {
	onConfirm: () => void;
	deleting: boolean;
}) {
	const [text, setText] = React.useState("");
	const ok = text.trim().toUpperCase() === "DELETE";
	return (
		<div className="grid gap-3">
			<div className="grid gap-2">
				<Label htmlFor="confirmDelete">Confirmation</Label>
				<Input
					id="confirmDelete"
					placeholder='Type "DELETE" to confirm'
					value={text}
					onChange={(e) => setText(e.target.value)}
					autoFocus
				/>
			</div>
			<AlertDialogFooter>
				<div className="flex w-full items-center justify-end gap-2">
					<AlertDialogCancel className="w-auto" disabled={deleting}>
						Cancel
					</AlertDialogCancel>

					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={!ok || deleting}
					>
						{deleting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Deleting…
							</>
						) : (
							"Yes, delete my account"
						)}
					</Button>

					{/* keep the AlertDialogAction present if needed by some implementations, hidden by default */}
					<AlertDialogAction className="hidden" />
				</div>
			</AlertDialogFooter>
		</div>
	);
}
