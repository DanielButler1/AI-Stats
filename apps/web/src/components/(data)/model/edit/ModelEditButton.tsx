import { createClient } from "@/utils/supabase/server";
import ModelEditDialog from "./ModelEditDialog";

interface ModelEditButtonProps {
	modelId: string;
	tab?: string;
}

export default async function ModelEditButton({
	modelId,
	tab,
}: ModelEditButtonProps) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	let isAdmin = false;
	if (user) {
		const { data } = await supabase
			.from("users")
			.select("role")
			.eq("user_id", user.id)
			.single();
		isAdmin = data?.role === "admin";
	}

	if (!isAdmin) {
		return null;
	}

	return <ModelEditDialog modelId={modelId} tab={tab} />;
}
