import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function CheckItem({ children }: { children: React.ReactNode }) {
	return (
		<li className="flex items-start gap-3 text-sm text-slate-700">
			<CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-indigo-600" />
			<span>{children}</span>
		</li>
	);
}
