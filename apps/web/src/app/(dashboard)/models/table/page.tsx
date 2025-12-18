import { Suspense } from "react";
import ModelsTableHeader from "@/components/(data)/models/Models/ModelsTableHeader";
import { MonitorTableClient } from "@/components/monitor/MonitorTableClient";
import { getMonitorModels } from "@/lib/fetchers/models/getMonitorModels";

export const metadata = {
	title: "Models table view",
};

export default async function ModelsTablePage() {
	const { models: modelData, allTiers } = await getMonitorModels();

	// Compute lists for filters (endpoints, modalities, features, statuses)
	const endpointsSet = new Set<string>();
	const modalitiesSet = new Set<string>();
	const featuresSet = new Set<string>();
	const statusesSet = new Set<string>();

	for (const m of modelData) {
		if (m.endpoint) endpointsSet.add(m.endpoint);
		(m.inputModalities || []).forEach((mod) => modalitiesSet.add(mod));
		(m.outputModalities || []).forEach((mod) => modalitiesSet.add(mod));
		(m.provider?.features || []).forEach((f) => featuresSet.add(f));
		if (m.gatewayStatus) statusesSet.add(m.gatewayStatus);
	}

	const allEndpoints = Array.from(endpointsSet).sort();
	const allModalities = Array.from(modalitiesSet).sort();
	const allFeatures = Array.from(featuresSet).sort();
	const allStatuses = Array.from(statusesSet).sort();

	return (
		<div className="mx-8 py-8">
			<div className="mb-8">
				<ModelsTableHeader
					allEndpoints={allEndpoints}
					allModalities={allModalities}
					allFeatures={allFeatures}
					allTiers={allTiers}
					allStatuses={allStatuses}
				/>
			</div>

			<Suspense
				fallback={
					<div className="flex items-center justify-center py-8">
						Loading table...
					</div>
				}
			>
				<MonitorTableClient
					initialModelData={modelData}
					allTiers={allTiers}
					allEndpoints={allEndpoints}
					allModalities={allModalities}
					allFeatures={allFeatures}
					allStatuses={allStatuses}
				/>
			</Suspense>
		</div>
	);
}
