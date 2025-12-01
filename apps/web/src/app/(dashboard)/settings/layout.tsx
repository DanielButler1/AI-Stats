import SettingsSidebar from "@/components/(gateway)/settings/Sidebar";

export const metadata = {
	title: "Settings",
};

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-white dark:bg-zinc-950">
			<div className="container mx-auto flex flex-col gap-6 px-4 py-8 md:flex-row">
				<SettingsSidebar />
				<main className="flex-1 w-full p-6">{children}</main>
			</div>
		</div>
	);
}
