// app/(dashboard)/layout.tsx
import Header from "@/components/header/header";
import Footer from "@/components/footer";

export default function SiteTemplate({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		// Fill the column from RootLayout and distribute space: header | main (fills) | footer
		<div className="flex min-h-dvh flex-col">
			<Header />
			<main className="flex-1 flex flex-col">{children}</main>
			<Footer />
		</div>
	);
}
