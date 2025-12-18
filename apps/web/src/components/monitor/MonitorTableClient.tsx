"use client";

import {
	MonitorDataTable,
	type ModelData,
} from "@/components/monitor/MonitorDataTable";
import { type MonitorModelData } from "@/lib/fetchers/models/getMonitorModels";

interface MonitorTableClientProps {
	initialModelData: MonitorModelData[];
	allTiers: string[];
	allEndpoints?: string[];
	allModalities?: string[];
	allFeatures?: string[];
	allStatuses?: string[];
}

export function MonitorTableClient({
	initialModelData,
	allTiers,
	allEndpoints,
	allModalities,
	allFeatures,
	allStatuses,
}: MonitorTableClientProps) {
	// Convert MonitorModelData to ModelData format for the table
	const modelData: ModelData[] = initialModelData.map((item) => ({
		id: item.id,
		model: item.model,
		modelId: item.modelId,
		organisationId: item.organisationId,
		provider: item.provider,
		endpoint: item.endpoint,
		gatewayStatus: item.gatewayStatus,
		inputModalities: item.inputModalities,
		outputModalities: item.outputModalities,
		context: item.context,
		maxOutput: item.maxOutput,
		quantization: item.quantization,
		tier: item.tier,
		added: item.added,
		retired: item.retired,
	}));

	return (
		<MonitorDataTable
			data={modelData}
			loading={false}
			allTiersProp={allTiers}
			allEndpointsProp={allEndpoints}
			allModalitiesProp={allModalities}
			allFeaturesProp={allFeatures}
			allStatusesProp={allStatuses}
		/>
	);
}
