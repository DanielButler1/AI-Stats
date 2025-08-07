import { Megaphone, Rocket, Archive, Ban } from "lucide-react";
import { ExtendedModel } from "@/data/types";

interface KeyDatesProps {
	announced?: string;
	released?: string;
	deprecated?: string;
	retired?: string;
	formatDate: (dateStr?: string) => string;
}

export default function KeyDates({
	announced,
	released,
	deprecated,
	retired,
	formatDate,
}: KeyDatesProps) {
	return (
		<div className="flex flex-col">
			<h2 className="text-xl font-semibold mb-4">Key Dates</h2>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 h-full">
				{/* Announced Card */}
				<div className="p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 border-b-blue-400 dark:border-b-blue-700 rounded-lg h-full">
					<span className="text-xl font-bold text-blue-800 dark:text-blue-300">
						{formatDate(announced)}
					</span>
					<span className="text-xs font-semibold flex items-center gap-1 mt-1 text-blue-800 dark:text-blue-300">
						<Megaphone size={14} className="mr-1" />
						Announcement
					</span>
				</div>
				{/* Released Card */}
				<div className="p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 border-b-green-400 dark:border-b-green-700 rounded-lg h-full">
					<span className="text-xl font-bold text-green-800 dark:text-green-300">
						{formatDate(released)}
					</span>
					<span className="text-xs font-semibold flex items-center gap-1 mt-1 text-green-800 dark:text-green-300">
						<Rocket size={14} className="mr-1" />
						Release
					</span>
				</div>
				{/* Deprecated Card */}
				<div className="p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 border-b-red-400 dark:border-b-red-700 rounded-lg h-full">
					<span className="text-xl font-bold text-red-800 dark:text-red-300">
						{formatDate(deprecated)}
					</span>
					<span className="text-xs font-semibold flex items-center gap-1 mt-1 text-red-800 dark:text-red-300">
						<Ban size={14} className="mr-1" />
						Deprecation
					</span>
				</div>
				{/* Retired Card */}
				<div className="p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 border-b-zinc-500 dark:border-b-zinc-600 rounded-lg h-full">
					<span className="text-xl font-bold text-zinc-800 dark:text-zinc-300">
						{formatDate(retired)}
					</span>
					<span className="text-xs font-semibold flex items-center gap-1 mt-1 text-zinc-800 dark:text-zinc-300">
						<Archive size={14} className="mr-1" />
						Retirement
					</span>
				</div>
			</div>
		</div>
	);
}
