"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import {
	createByokKeyAction,
	updateByokKeyAction,
} from "@/app/(dashboard)/settings/byok/actions";

type Props = {
	providerId?: string; // optional when editing existing key
	triggerLabel?: string;
	trigger?: React.ReactNode;
	initial?: {
		id: string;
		providerId: string;
		name?: string;
		value?: string;
		prefix?: string;
		suffix?: string;
		enabled?: boolean;
		always_use?: boolean;
	} | null;
};

export default function BYOKInputDialog({
	providerId,
	triggerLabel = "Add key",
	trigger,
	initial = null,
}: Props) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(initial?.name ?? "");
	const [value, setValue] = useState(initial?.value ?? "");
	const [enabled, setEnabled] = useState<boolean>(initial?.enabled ?? true);
	const [alwaysUse, setAlwaysUse] = useState<boolean>(
		initial?.always_use ?? false
	);
	const [loading, setLoading] = useState(false);

	function maskFromValue(v: string) {
		const start = 6;
		const end = 4;
		if (!v) return "(value not available)";
		if (v.length <= start + end) return "•".repeat(Math.max(6, v.length));
		return `${v.slice(0, start)}${"•".repeat(
			Math.max(6, v.length - start - end)
		)}${v.slice(-end)}`;
	}

	async function onSave(e?: React.FormEvent) {
		e?.preventDefault();
		if (!name || (!value && !initial)) {
			toast.error("Please provide a name and key value");
			return;
		}
		try {
			setLoading(true);
			if (initial && initial.id) {
				// update existing (do not send value)
				await updateByokKeyAction(initial.id, {
					name,
					enabled,
					always_use: alwaysUse,
				});
				toast.success("Key updated");
			} else {
				// create new
				await createByokKeyAction(
					name,
					providerId as string,
					value,
					enabled,
					alwaysUse
				);
				toast.success("Key saved");
			}
			setOpen(false);
			setName("");
			setValue("");
			setEnabled(true);
			setAlwaysUse(false);
		} catch (err: any) {
			console.error(err);
			toast.error(err?.message || "Failed to save key");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={(v: boolean) => setOpen(v)}>
			<DialogTrigger asChild>
				{trigger ? (
					React.cloneElement(trigger as any, {
						onClick: () => setOpen(true),
					})
				) : (
					<Button
						variant="ghost"
						className="rounded-full px-3 py-1.5"
						onClick={() => setOpen(true)}
					>
						{triggerLabel}
					</Button>
				)}
			</DialogTrigger>

			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{initial ? "Edit key" : "Add key"}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={onSave} className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="value">Key value</Label>
						{initial ? (
							<div className="rounded-md border bg-muted/5 p-2 font-mono text-sm">
								{initial.prefix || initial.suffix
									? `${initial.prefix ?? ""}${"•".repeat(6)}${
											initial.suffix ?? ""
									  }`
									: initial.value
									? maskFromValue(initial.value)
									: "(value not available)"}
							</div>
						) : (
							<Textarea
								id="value"
								rows={4}
								value={value}
								onChange={(e) => setValue(e.target.value)}
								placeholder="Paste your API key or secret…"
							/>
						)}
					</div>

					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<Switch
								checked={enabled}
								onCheckedChange={(v: any) =>
									setEnabled(Boolean(v))
								}
							/>
							<div className="text-sm">Enabled</div>
						</div>
						<div className="flex items-center gap-3">
							<Switch
								checked={alwaysUse}
								onCheckedChange={(v: any) =>
									setAlwaysUse(Boolean(v))
								}
							/>
							<div className="text-sm">Always use this key</div>
						</div>
					</div>

					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? "Saving..." : "Save"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
