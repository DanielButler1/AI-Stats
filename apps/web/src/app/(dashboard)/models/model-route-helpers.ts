export type ModelRouteParams = {
	organisationId: string;
	modelId: string;
};

export function getModelIdFromParams(params: ModelRouteParams): string {
	return `${params.organisationId}/${params.modelId}`;
}
