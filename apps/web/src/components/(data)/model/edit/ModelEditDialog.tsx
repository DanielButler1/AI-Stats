"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";

interface ModelEditDialogProps {
	modelId: string;
	tab?: string;
}

interface ModelData {
	model_id: string;
	name: string | null;
	status: string | null;
	release_date: string | null;
	announcement_date: string | null;
}

export default function ModelEditDialog({ modelId, tab }: ModelEditDialogProps) {
	const [open, setOpen] = useState(false);
	const [model, setModel] = useState<ModelData | null>(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const loadedRef = useRef(false);

	const fetchModel = useCallback(async () => {
		setLoading(true);
		const supabase = createClient();
		const { data, error } = await supabase
			.from("data_models")
			.select("model_id, name, status, release_date, announcement_date")
			.eq("model_id", modelId)
			.single();
		if (error) {
			// Handle error
		} else {
			setModel(data);
		}
		setLoading(false);
	}, [modelId]);

	useEffect(() => {
		if (open && !loadedRef.current) {
			loadedRef.current = true;
			// eslint-disable-next-line react-hooks/set-state-in-effect
			fetchModel();
		}
	}, [open, fetchModel]);

	const handleSave = async () => {
		if (!model) return;
		setSaving(true);
		const supabase = createClient();
		const { error } = await supabase
			.from("data_models")
			.update({
				name: model.name,
				status: model.status,
				release_date: model.release_date,
				announcement_date: model.announcement_date,
			})
			.eq("model_id", modelId);
		if (error) {
			// Handle error
		} else {
			setOpen(false);
		}
		setSaving(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<Pencil className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Model{tab ? ` - ${tab.charAt(0).toUpperCase() + tab.slice(1)}` : ""}</DialogTitle>
					<DialogDescription>
						Make changes to the model details here{tab ? ` for the ${tab} section.` : "."}
					</DialogDescription>
				</DialogHeader>
				{loading ? (
					<p>Loading...</p>
				) : model ? (
					<div className="space-y-4">
						<div>
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								value={model.name || ""}
								onChange={(e) =>
									setModel({ ...model, name: e.target.value })
								}
							/>
						</div>
						<div>
							<Label htmlFor="status">Status</Label>
							<Select
								value={model.status || ""}
								onValueChange={(value) =>
									setModel({ ...model, status: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Rumoured">
										Rumoured
									</SelectItem>
									<SelectItem value="Announced">
										Announced
									</SelectItem>
									<SelectItem value="Available">
										Available
									</SelectItem>
									<SelectItem value="Deprecated">
										Deprecated
									</SelectItem>
									<SelectItem value="Retired">
										Retired
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label htmlFor="release_date">Release Date</Label>
							<Input
								id="release_date"
								type="date"
								value={model.release_date || ""}
								onChange={(e) =>
									setModel({
										...model,
										release_date: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<Label htmlFor="announcement_date">
								Announcement Date
							</Label>
							<Input
								id="announcement_date"
								type="date"
								value={model.announcement_date || ""}
								onChange={(e) =>
									setModel({
										...model,
										announcement_date: e.target.value,
									})
								}
							/>
						</div>
						<div className="flex justify-end space-x-2">
							<Button
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button onClick={handleSave} disabled={saving}>
								{saving ? "Saving..." : "Save"}
							</Button>
						</div>
					</div>
				) : (
					<p>Error loading model.</p>
				)}
			</DialogContent>
		</Dialog>
	);
}
