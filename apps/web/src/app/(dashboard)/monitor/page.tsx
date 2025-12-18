import fs from "fs";
import path from "path";
import {
	MonitorTimeline,
	type ChangeHistory,
} from "@/components/monitor/MonitorTimeline";

export const cacheLife = "hours";

const getMonitorHistory = async (): Promise<ChangeHistory[]> => {
	const filePath = path.join(
		process.cwd(),
		"public",
		"data",
		"monitor-history.json"
	);

	try {
		const json = await fs.promises.readFile(filePath, "utf8");
		return JSON.parse(json) as ChangeHistory[];
	} catch (_) {
		return [];
	}
};

const filterHistory = (
	data: ChangeHistory[],
	type: "all" | "model" | "endpoint",
	entity: string
) => {
	return data.filter((change) => {
		if (type === "model" && change.endpoint) return false;
		if (type === "endpoint" && !change.endpoint) return false;
		if (entity !== "all" && change.model !== entity) return false;
		return true;
	});
};

type MonitorPageProps = {
	searchParams?: {
		type?: string;
		entity?: string;
	};
};

export default async function MonitorPage({ searchParams }: MonitorPageProps) {
	const params = await searchParams;
	const typeParam = params?.type;
	const entityParam = params?.entity;

	const changeType: "all" | "model" | "endpoint" =
		typeParam === "model" || typeParam === "endpoint" ? typeParam : "all";
	const entityFilter = entityParam ?? "all";

	const allData = await getMonitorHistory();
	const filteredData = filterHistory(allData, changeType, entityFilter);

	const entities = Array.from(new Set(allData.map((c) => c.model))).sort();

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="font-bold text-xl">Change History</h1>
				</div>
			</div>

			<MonitorTimeline data={filteredData} />
		</div>
	);
}
