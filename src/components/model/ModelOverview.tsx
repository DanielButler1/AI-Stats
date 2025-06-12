import Link from "next/link";
import { Card, CardTitle } from "../ui/card";

interface ModelOverviewProps {
	id: string;
	description: string | null;
}

export default function ModelOverview({ id, description }: ModelOverviewProps) {
	return (
		<Card className="w-full bg-white dark:bg-zinc-950 rounded-lg shadow-lg p-6 mb-4">
			<CardTitle className="text-2xl font-bold mb-2">Overview</CardTitle>
			{description ? (
				<p className="text-lg text-muted-foreground">{description}</p>
			) : (
				<p className="italic text-muted-foreground">
					No description provided. Want to help? Contribute on GitHub
					or{" "}
					<Link
						href={process.env.WEBSITE_URL + "/contribute/" + id}
						className="text-blue-500"
					>
						click here
					</Link>
					!
				</p>
			)}
		</Card>
	);
}
