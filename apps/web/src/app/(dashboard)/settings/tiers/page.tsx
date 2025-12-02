import TieringProgress from "@/components/(gateway)/credits/TieringProgress";
import { getTeamIdFromCookie } from "@/utils/teamCookie";

export default async function Page() {
	const teamId = await getTeamIdFromCookie();
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Tiers & Discounts</h1>
			<TieringProgress teamId={teamId} />
		</div>
	);
}
