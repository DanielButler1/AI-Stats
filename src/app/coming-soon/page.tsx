import type { Metadata } from "next";
import ComingSoonClient from "@/components/ComingSoonClient";
import Header from "@/components/header";

export const metadata: Metadata = {
	title: "Coming Soon · AI Stats",
	description:
		"A big update is on the way: a smarter Updates section, a cleaner design, the new AI Stats Gateway, and a faster, more organised site for AI knowledge.",
	openGraph: {
		title: "AI Stats — Coming Soon",
		description:
			"A big update is on the way: a smarter Updates section, a cleaner design, the new AI Stats Gateway, and a faster, more organised site for AI knowledge.",
		type: "website",
	},
};

export default function Page() {
	// Pure server component that renders the client UI.
	return (
		<>
			<Header />
			<ComingSoonClient />
		</>
	);
}
