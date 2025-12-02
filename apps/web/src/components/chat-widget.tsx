"use client";

import { useEffect } from "react";
import HEYO from "@heyo.so/js";
import { createClient } from "@/utils/supabase/client";

export const ChatWidget = () => {
	useEffect(() => {
		HEYO.init({
			projectId: "6908915f84cd79bf86f34a16",
			hidden: true,
		});

		// Identify user if logged in
		const identifyUser = async () => {
			const supabase = createClient();
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (session?.user) {
				const user = session.user;
				HEYO.identify({
					userId: user.id,
					email: user.email || undefined,
					name: user.user_metadata?.full_name || undefined,
				});
			}
		};

		identifyUser();
	}, []);

	return null;
};
