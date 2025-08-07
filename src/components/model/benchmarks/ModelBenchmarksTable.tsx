import React, { useState } from "react";
import { ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

export function ModelBenchmarksTable({
	grouped,
}: {
	grouped: Record<string, any[]>;
}) {
	const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
	return (
		<div className="overflow-x-auto mb-12">
			<table className="min-w-full text-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
				<thead className="bg-zinc-100 dark:bg-zinc-800">
					<tr>
						<th className="px-4 py-2 text-left">Benchmark</th>
						<th className="px-4 py-2 text-left">Category</th>
						<th className="px-4 py-2 text-left">Top Score</th>
						<th className="px-4 py-2 text-left">Info</th>
						<th className="px-4 py-2 text-center">Self Reported</th>
						<th className="px-4 py-2 text-left">Source</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(grouped)
						.sort(([a], [b]) => a.localeCompare(b))
						.map(([name, arr]) => {
							const sortedArr = [...arr].sort(
								(a, b) => (b.score ?? 0) - (a.score ?? 0)
							);
							const top = sortedArr[0];
							const max = top.benchmark?.max_score;
							const anySelfReported = sortedArr.some(
								(x) => x.benchmark?.self_reported
							);
							const hasMultiple = sortedArr.length > 1;
							const isOpen = openRows[name] || false;
							return (
								<React.Fragment key={name}>
									<tr
										className={
											"border-t border-zinc-200 dark:border-zinc-800 " +
											(hasMultiple && isOpen
												? "rounded-t-xl"
												: "rounded-xl")
										}
									>
										<td className="px-4 py-2 font-semibold">
											{hasMultiple && (
												<button
													type="button"
													className="mr-2 text-indigo-600 hover:underline focus:outline-hidden inline-flex items-center align-middle"
													style={{
														verticalAlign: "middle",
													}}
													onClick={() =>
														setOpenRows((prev) => ({
															...prev,
															[name]: !isOpen,
														}))
													}
													aria-label={
														isOpen
															? "Hide all scores"
															: "Show all scores"
													}
												>
													<span className="flex items-center align-middle">
														{isOpen ? (
															<ChevronDown className="w-4 h-4 align-middle" />
														) : (
															<ChevronRight className="w-4 h-4 align-middle" />
														)}
													</span>
												</button>
											)}
											<Link
												href={`/benchmarks/${top.benchmark_id}`}
											>
												<span className="truncate font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
													{name}
												</span>
											</Link>
										</td>
										<td className="px-4 py-2 text-left">
											{top.benchmark?.category || "-"}
										</td>
										<td className="px-4 py-2 font-mono">
											{max
												? `${
														top.score != null
															? top.score.toFixed(
																	2
															  )
															: "-"
												  }/${max}`
												: top.score != null
												? top.score.toFixed(2)
												: "-"}
										</td>
										<td className="px-4 py-2 text-xs text-zinc-500">
											{top.other_info || "-"}
										</td>
										<td className="px-4 py-2 text-center">
											<span
												className={
													anySelfReported
														? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded text-xs font-semibold"
														: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs font-semibold"
												}
											>
												{anySelfReported ? "Yes" : "No"}
											</span>
										</td>
										<td className="px-4 py-2 text-left">
											{top.source_link ? (
												<a
													href={top.source_link}
													target="_blank"
													rel="noopener noreferrer"
													className="text-indigo-600 hover:underline inline-flex items-center group"
												>
													Source
													<ExternalLink className="ml-1 h-3 w-3 text-indigo-500 opacity-0 group-hover:opacity-100 group-hover:text-indigo-700 transition-all" />
												</a>
											) : (
												"-"
											)}
										</td>
									</tr>

									{hasMultiple &&
										isOpen &&
										sortedArr.slice(1).map((item, idx) => (
											<tr
												key={idx}
												className={
													"bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 " +
													(idx ===
													sortedArr.length - 2
														? "rounded-b-xl"
														: "")
												}
											>
												<td
													className="px-4 py-2 pl-8 font-mono text-xs"
													colSpan={2}
												></td>
												<td className="px-4 py-2 font-mono text-xs">
													{item.benchmark?.max_score
														? `${
																item.score !=
																null
																	? item.score.toFixed(
																			2
																	  )
																	: "-"
														  }/${
																item.benchmark
																	.max_score
														  }`
														: item.score != null
														? item.score.toFixed(2)
														: "-"}
												</td>
												<td className="px-4 py-2 text-xs text-zinc-500">
													{item.other_info || "-"}
												</td>
												<td className="px-4 py-2 text-center">
													<span
														className={
															item.benchmark
																?.self_reported
																? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded text-xs font-semibold"
																: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs font-semibold"
														}
														title={
															item.benchmark
																?.self_reported
																? "Self-reported (may be less reliable)"
																: "Not self-reported (more reliable)"
														}
													>
														{item.benchmark
															?.self_reported
															? "Yes"
															: "No"}
													</span>
												</td>
												<td className="px-4 py-2">
													{item.source_link ? (
														<a
															href={
																item.source_link
															}
															target="_blank"
															rel="noopener noreferrer"
															className="text-indigo-600 hover:underline inline-flex items-center group"
														>
															Source
															<ExternalLink className="ml-1 h-3 w-3 text-indigo-500 opacity-0 group-hover:opacity-100 group-hover:text-indigo-700 transition-all" />
														</a>
													) : (
														"-"
													)}
												</td>
											</tr>
										))}
								</React.Fragment>
							);
						})}
				</tbody>
			</table>
		</div>
	);
}
