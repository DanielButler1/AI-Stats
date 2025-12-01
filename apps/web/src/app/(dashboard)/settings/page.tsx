import { redirect } from "next/navigation";

export default function SettingsIndexPage() {
	// Redirect to credits by default
	redirect("/settings/credits");
}
