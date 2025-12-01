const FLAG_PLACEHOLDER = "🏳️";

export function flagEmojiFromIso(iso: string) {
	if (!iso || iso.length !== 2) return FLAG_PLACEHOLDER;
	const codePoints = iso
		.toUpperCase()
		.split("")
		.map((char) => 127397 + char.charCodeAt(0));
	return String.fromCodePoint(...codePoints);
}

export function formatCountryDate(value: string | null | undefined) {
	if (!value) return "Unknown";
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return "Unknown";
	return parsed.toLocaleString("en-US", {
		month: "short",
		year: "numeric",
	});
}
