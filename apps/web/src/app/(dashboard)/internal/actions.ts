"use server";

import { createAdminClient } from "@/utils/supabase/admin";

const TABLE = "system_settings";
const SIGNUPS_KEY = "signups_enabled";

type SignupsSettings = {
	enabled: boolean;
	lastUpdated: string;
	warning?: string;
};



type ActionResult = {
	ok: boolean;
	message?: string;
	enabled?: boolean;
	lastUpdated?: string;
};

const now = () => new Date().toISOString();

export async function fetchSignupsSettings(): Promise<SignupsSettings> {
	const supabase = createAdminClient();
	const { data, error } = await supabase
		.from(TABLE)
		.select("value, updated_at")
		.eq("key", SIGNUPS_KEY)
		.single();

	if (error && error.code !== "PGRST116" && error.code !== "PGRST205") {
		throw new Error("Failed to load signup settings");
	}

	return {
		enabled: data?.value ?? true,
		lastUpdated: data?.updated_at || now(),
		warning:
			error?.code === "PGRST205"
				? "Settings backend is not initialized (system_settings table missing). Using defaults."
				: undefined,
	};
}



export async function setSignupsEnabled(enabled: boolean): Promise<ActionResult> {
	const supabase = createAdminClient();
	const updatedAt = now();

	const { error } = await supabase
		.from(TABLE)
		.upsert(
			{
				key: SIGNUPS_KEY,
				value: enabled,
				updated_at: updatedAt,
				updated_by: "admin", // TODO: Get actual user ID
			},
			{ onConflict: "key" },
		);

	if (error) {
		return {
			ok: false,
			message:
				error.code === "PGRST205"
					? "Settings backend is not initialized (system_settings table missing)."
					: "Failed to update signup settings",
		};
	}

	return {
		ok: true,
		message: `User signups ${enabled ? "enabled" : "disabled"} successfully`,
		enabled,
		lastUpdated: updatedAt,
	};
}


