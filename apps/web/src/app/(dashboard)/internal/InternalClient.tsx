"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	fetchSignupsSettings,
	setSignupsEnabled,
} from "./actions";
import {
	Shield,
	Users,
	Database,
	Settings,
	AlertTriangle,
	CheckCircle,
	Loader2,
} from "lucide-react";

interface SystemSettings {
	signupsEnabled: boolean;
	lastUpdated: string;
}

export function InternalClient() {
	const [settings, setSettings] = useState<SystemSettings>({
		signupsEnabled: true,
		lastUpdated: new Date().toISOString(),
	});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

		// Load current settings
		useEffect(() => {
			const loadSettings = async () => {
				try {
					const signupData = await fetchSignupsSettings();

					setSettings({
						signupsEnabled: signupData.enabled,
						lastUpdated: signupData.lastUpdated,
					});

					if (signupData.warning) {
						setMessage({
							type: "error",
							text: signupData.warning,
						});
					}
				} catch (error) {
					console.error("Failed to load settings:", error);
					setMessage({
						type: "error",
						text: "Failed to load current settings",
					});
				} finally {
					setLoading(false);
				}
			};

			loadSettings();
		}, []);

	const updateSetting = async (
		key: keyof SystemSettings,
		value: boolean | string
	) => {
		setSaving(true);
		setMessage(null);

		try {
			if (key === "signupsEnabled") {
				const result = await setSignupsEnabled(value as boolean);

				if (!result.ok) {
					throw new Error(
						result.message || "Failed to update signups"
					);
				}

				setSettings((prev) => ({
					...prev,
					signupsEnabled: result.enabled ?? (value as boolean),
					lastUpdated: result.lastUpdated || new Date().toISOString(),
				}));

				setMessage({
					type: "success",
					text: result.message || `User signups ${value ? "enabled" : "disabled"} successfully`,
				});
			}
		} catch (error) {
			console.error(`Failed to update ${key}:`, error);
			setMessage({
				type: "error",
				text:
					error instanceof Error
						? error.message
						: "Failed to update user signups",
			});
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin" />
				<span className="ml-2">Loading admin settings...</span>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Status Alert */}
			{message && (
				<Alert
					className={
						message.type === "error"
							? "border-red-200 bg-red-50"
							: "border-green-200 bg-green-50"
					}
				>
					<AlertDescription
						className={
							message.type === "error"
								? "text-red-800"
								: "text-green-800"
						}
					>
						{message.text}
					</AlertDescription>
				</Alert>
			)}

			{/* System Status */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5" />
						System Status
					</CardTitle>
					<CardDescription>
						Current system configuration and health status
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Users className="h-4 w-4" />
							<span>User Signups</span>
						</div>
						<Badge
							variant={
								settings.signupsEnabled
									? "default"
									: "destructive"
							}
						>
							{settings.signupsEnabled ? "Enabled" : "Disabled"}
						</Badge>
					</div>



					<Separator />

					<div className="text-sm text-muted-foreground">
						Last updated:{" "}
						{new Date(settings.lastUpdated).toLocaleString()}
					</div>
				</CardContent>
			</Card>

			{/* User Management */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						User Management
					</CardTitle>
					<CardDescription>
						Control user registration and access
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label
								htmlFor="signups-toggle"
								className="text-base"
							>
								Allow New User Signups
							</Label>
							<p className="text-sm text-muted-foreground">
								When disabled, new users cannot create accounts.
								Existing users can still log in.
							</p>
						</div>
						<Switch
							id="signups-toggle"
							checked={settings.signupsEnabled}
							onCheckedChange={(checked) =>
								updateSetting("signupsEnabled", checked)
							}
							disabled={saving}
						/>
					</div>

					{settings.signupsEnabled && (
						<Alert>
							<CheckCircle className="h-4 w-4" />
							<AlertDescription>
								New user registration is currently enabled.
								Users can create accounts through the normal
								signup flow.
							</AlertDescription>
						</Alert>
					)}

					{!settings.signupsEnabled && (
						<Alert className="border-orange-200 bg-orange-50">
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription className="text-orange-800">
								New user registration is currently disabled.
								Only existing users can access the system.
							</AlertDescription>
						</Alert>
					)}
				</CardContent>
			</Card>



			{/* Save Status */}
			{saving && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Loader2 className="h-4 w-4 animate-spin" />
					Saving changes...
				</div>
			)}
		</div>
	);
}
