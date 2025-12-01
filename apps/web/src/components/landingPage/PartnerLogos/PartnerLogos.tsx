import PartnerLogosClient from "./PartnerLogosClient";
import { listKnownLogos } from "@/lib/logos";

const customProviderLogos: string[] = ["/social/hugging_face.svg"];

export const excludedProviderLogos: string[] = [
	"scira",
	"t3",
	"/logos/arxiv.svg",
	"grok",
];

function normaliseDescriptor(value: string): string {
	if (value.startsWith("/")) return value;
	return value.toLowerCase();
}

function getProviderLogos(): string[] {
	const exclusionSet = new Set(
		excludedProviderLogos.map(normaliseDescriptor)
	);

	const knownLogos = listKnownLogos()
		.filter(({ id, assets }) => {
			// Exclude logos with assets in /languages/
			const hasLanguageAsset = Object.values(assets).some(asset => asset?.startsWith("/languages/"));
			if (hasLanguageAsset) return false;

			const normalisedId = normaliseDescriptor(id);
			if (exclusionSet.has(normalisedId)) return false;
			const pathCandidate = normaliseDescriptor(`/logos/${id}.svg`);
			return !exclusionSet.has(pathCandidate);
		})
		.map(({ id }) => id);

	const customLogos = customProviderLogos.filter(
		(src) => !exclusionSet.has(normaliseDescriptor(src))
	);

	return [...knownLogos, ...customLogos];
}

export default function PartnerLogos() {
	const providerLogos = getProviderLogos();
	return <PartnerLogosClient logos={providerLogos} />;
}
