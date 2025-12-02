import React from "react";
import { createClient } from "@/utils/supabase/server";
import CreateKeyDialog from "@/components/(gateway)/settings/keys/CreateKeyDialog";
import KeysPanel from "@/components/(gateway)/settings/keys/KeysPanel";
import { getTeamIdFromCookie } from "@/utils/teamCookie";

export const metadata = {
	title: "API Keys - Settings",
};

export default async function KeysPage() {
	const supabase = await createClient();

	// get current user
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// fetch API keys and team memberships for current user
	const { data: apiKeys } = await supabase.from("keys").select("*");

	// fetch teams the user belongs to (assumes a `team_users` join table)
	const { data: teamUsers } = await supabase
		.from("team_members")
		.select("team_id, teams(id, name)")
		.eq("user_id", user?.id);

	const initialTeamId = await getTeamIdFromCookie();

	// build a teams list including a personal/personal-like fallback
	const teams: any[] = [];

	if (teamUsers) {
		for (const tu of teamUsers) {
			if (tu?.teams) {
				const team = Array.isArray(tu.teams) ? tu.teams[0] : tu.teams;
				if (team?.id && team?.name) {
					teams.push({ id: team.id, name: team.name });
				}
			}
		}
	}

	const keysArray = (apiKeys ?? []).map((k: any) => ({ ...k }));

	// group keys by team id
	const teamsWithKeys = teams.map((t) => ({
		...t,
		keys: keysArray.filter(
			(k: any) => (k.team_id ?? null) === (t.id ?? null)
		),
	}));

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">API Keys</h1>
				<div className="flex items-center gap-2">
					<CreateKeyDialog
						currentUserId={user?.id}
						currentTeamId={initialTeamId}
						teams={teams}
					/>
				</div>
			</div>

			{/* Keys panel - client component for managing/per-key actions */}
			<KeysPanel
				teamsWithKeys={teamsWithKeys}
				initialTeamId={initialTeamId}
				currentUserId={user?.id}
			/>
		</div>
	);
}
