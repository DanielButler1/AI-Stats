import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const modelsSearchParams = {
	q: parseAsString
		.withDefault("")
		.withOptions({
			shallow: false,
			clearOnDefault: true,
		}),
	year: parseAsInteger
		.withDefault(0)
		.withOptions({
			shallow: false,
			clearOnDefault: true,
		}),
};

export const loadModelsSearchParams = createLoader(modelsSearchParams);

export const qParser = modelsSearchParams.q;
export const yearParser = modelsSearchParams.year;
