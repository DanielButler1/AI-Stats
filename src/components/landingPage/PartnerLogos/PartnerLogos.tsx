import path from "path";
import fs from "fs";
import PartnerLogosClient from "./PartnerLogosClient";

// Add custom logo paths here
const customProviderLogos: string[] = [
	"/social/arxiv.svg",
	"/social/hugging_face.svg",
];

function getProviderLogos(): string[] {
	// __dirname is not available in Next.js, so use process.cwd()
	const providersDir = path.join(process.cwd(), "public", "providers");
	let files: string[] = [];
	try {
		files = fs
			.readdirSync(providersDir)
			.filter((file) => file.endsWith(".svg"))
			.map((file) => `/providers/${file}`);
	} catch (e) {
		// fallback to empty
		files = [];
	}
	return [...files, ...customProviderLogos];
}

export default function PartnerLogos() {
	const providerLogos = getProviderLogos();
	return <PartnerLogosClient providerLogos={providerLogos} />;
}
