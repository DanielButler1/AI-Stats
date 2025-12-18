"use client";

import { useState, useMemo } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	ChevronLeft,
	ChevronRight,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
} from "lucide-react";

import { Logo } from "@/components/Logo";
import {
	ImageUp,
	ImageDown,
	Video,
	VideoOff,
	FileUp,
	FileDigit,
	ShieldCheck,
	ShieldAlert,
	AudioLines,
	AlignCenter,
	Globe,
	Wrench,
	Brain,
	Braces,
	Database,
	CheckCircle2,
	XCircle,
} from "lucide-react";

import Link from "next/link";

import { useQueryState } from "nuqs";
import { yearParser } from "@/app/(dashboard)/models/search-params";
// Icon and color mappings
const modalityIcons = {
	image: { input: ImageUp, output: ImageDown, color: "text-blue-600" },
	vision: { input: ImageUp, output: ImageDown, color: "text-blue-600" },
	video: { input: Video, output: VideoOff, color: "text-purple-600" },
	file: { input: FileUp, output: null, color: "text-green-600" },
	embeddings: { input: FileDigit, output: null, color: "text-orange-600" },
	moderations: { input: ShieldCheck, output: null, color: "text-red-600" },
	audio: {
		input: AudioLines,
		output: AudioLines,
		color: "text-pink-600",
	},
	speech: {
		input: AudioLines,
		output: AudioLines,
		color: "text-pink-600",
	},
	text: { input: AlignCenter, output: AlignCenter, color: "text-gray-600" },
	multimodal: { input: Globe, output: Globe, color: "text-indigo-600" },
	code: { input: Braces, output: Braces, color: "text-cyan-600" },
	function: { input: Wrench, output: Wrench, color: "text-yellow-600" },
};

const featureIcons = {
	tools: { icon: Wrench, color: "text-yellow-600" },
	reasoning: { icon: Brain, color: "text-indigo-600" },
	response_format: { icon: Braces, color: "text-cyan-600" },
	structured_outputs: { icon: Braces, color: "text-cyan-600" },
	caching: { icon: Database, color: "text-emerald-600" },
	web_search: { icon: Globe, color: "text-blue-500" },
	moderated: { icon: ShieldAlert, color: "text-red-500" },
};

const statusIcons = {
	active: { icon: CheckCircle2, color: "text-green-600" },
	inactive: { icon: XCircle, color: "text-red-600" },
};

// Types for the model data
export interface ModelData {
	id: string;
	model: string;
	modelId: string;
	organisationId?: string;
	provider: {
		name: string;
		id: string;
		inputPrice: number;
		outputPrice: number;
		features: string[];
	};
	endpoint: string;
	gatewayStatus: "active" | "inactive";
	inputModalities: string[]; // text, image, video, audio, file, embeddings
	outputModalities: string[]; // text, image, video, audio
	context: number; // context window in tokens
	maxOutput: number; // max output tokens
	quantization?: string; // quantization level
	tier?: string; // pricing tier
	added?: string; // date added
	retired?: string; // when this model is retired
}

// Props for the datatable component
interface MonitorDataTableProps {
	data: ModelData[];
	loading?: boolean;
	allTiersProp?: string[];
	allEndpointsProp?: string[];
	allModalitiesProp?: string[];
	allFeaturesProp?: string[];
	allStatusesProp?: string[];
}

export function MonitorDataTable({
	data,
	loading = false,
	allTiersProp,
	allEndpointsProp,
	allModalitiesProp,
	allFeaturesProp,
	allStatusesProp,
}: MonitorDataTableProps) {
	// URL state for search and filters
	const [searchQuery, setSearchQuery] = useQueryState("search", {
		defaultValue: "",
		parse: (value) => value || "",
		serialize: (value) => value,
	});

	// Year filter (from header)
	const [yearSelected, setYearSelected] = useQueryState("year", yearParser);

	const [selectedInputModalities, setSelectedInputModalities] = useQueryState(
		"inputModalities",
		{
			defaultValue: [],
			parse: (value) => (value ? value.split(",") : []),
			serialize: (value) => value.join(","),
		}
	);

	const [selectedOutputModalities, setSelectedOutputModalities] =
		useQueryState("outputModalities", {
			defaultValue: [],
			parse: (value) => (value ? value.split(",") : []),
			serialize: (value) => value.join(","),
		});

	const [selectedFeatures, setSelectedFeatures] = useQueryState("features", {
		defaultValue: [],
		parse: (value) => (value ? value.split(",") : []),
		serialize: (value) => value.join(","),
	});

	const [selectedEndpoints, setSelectedEndpoints] = useQueryState(
		"endpoints",
		{
			defaultValue: [],
			parse: (value) => (value ? value.split(",") : []),
			serialize: (value) => value.join(","),
		}
	);

	const [selectedStatuses, setSelectedStatuses] = useQueryState("statuses", {
		defaultValue: [],
		parse: (value) => (value ? value.split(",") : []),
		serialize: (value) => value.join(","),
	});

	const [selectedTiers, setSelectedTiers] = useQueryState("tiers", {
		defaultValue: ["standard"], // default to standard
		parse: (value) => (value ? value.split(",") : ["standard"]),
		serialize: (value) => value.join(","),
	});

	// Local state for sort (not in URL since it's less important)
	const [sortField, setSortField] = useState<string | null>("added");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

	// Get unique values for filters (prefer props passed from server if available)
	const allModalities =
		allModalitiesProp ??
		useMemo(() => {
			const modalities = new Set<string>();
			data.forEach((item) => {
				item.inputModalities.forEach((mod) => modalities.add(mod));
				item.outputModalities.forEach((mod) => modalities.add(mod));
			});
			return Array.from(modalities).sort();
		}, [data]);

	const allFeatures =
		allFeaturesProp ??
		useMemo(() => {
			const features = new Set<string>();
			data.forEach((item) => {
				item.provider.features.forEach((feat) => features.add(feat));
			});
			return Array.from(features).sort();
		}, [data]);

	const allEndpoints =
		allEndpointsProp ??
		useMemo(() => {
			const endpoints = new Set<string>();
			data.forEach((item) => endpoints.add(item.endpoint));
			return Array.from(endpoints).sort();
		}, [data]);

	const allStatuses =
		allStatusesProp ??
		useMemo(() => {
			const statuses = new Set<string>();
			data.forEach((item) => statuses.add(item.gatewayStatus));
			return Array.from(statuses).sort();
		}, [data]);

	const computedAllTiers = useMemo(() => {
		const tiers = new Set<string>();
		data.forEach((item) => {
			if (item.tier) tiers.add(item.tier);
		});
		return Array.from(tiers).sort();
	}, [data]);

	const allTiers = allTiersProp || computedAllTiers;

	const handleSort = (field: string) => {
		if (sortField === field) {
			if (sortDirection === "desc") {
				setSortDirection("asc");
			} else {
				setSortField(null);
			}
		} else {
			setSortField(field);
			setSortDirection("desc");
		}
	};

	const handleResetSort = () => {
		setSortField("added");
		setSortDirection("desc");
	};

	const getSortIcon = (field: string) => {
		if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
		return sortDirection === "asc" ? (
			<ArrowUp className="h-4 w-4" />
		) : (
			<ArrowDown className="h-4 w-4" />
		);
	};

	// Apply filters and sorting
	const processedData = useMemo(() => {
		const filtered = data.filter((item) => {
			// Search filter
			if (searchQuery) {
				const searchLower = searchQuery.toLowerCase();
				const matchesSearch = Object.values(item).some((value) => {
					if (Array.isArray(value)) {
						return value.some((v) =>
							String(v).toLowerCase().includes(searchLower)
						);
					}
					if (typeof value === "object" && value !== null) {
						// Handle nested provider object
						return Object.values(value).some((nestedValue) => {
							if (Array.isArray(nestedValue)) {
								return nestedValue.some((v) =>
									String(v)
										.toLowerCase()
										.includes(searchLower)
								);
							}
							return String(nestedValue)
								.toLowerCase()
								.includes(searchLower);
						});
					}
					return String(value).toLowerCase().includes(searchLower);
				});
				if (!matchesSearch) return false;
			}

			// Year filter (filter by model.added year)
			if (yearSelected && yearSelected > 0) {
				const itemYear = item.added
					? new Date(item.added).getFullYear()
					: null;
				if (itemYear !== yearSelected) return false;
			}

			// Input Modalities filter
			if (selectedInputModalities.length > 0) {
				const hasAllInputModalities = selectedInputModalities.every(
					(mod) => item.inputModalities.includes(mod)
				);
				if (!hasAllInputModalities) return false;
			}

			// Output Modalities filter
			if (selectedOutputModalities.length > 0) {
				const hasAllOutputModalities = selectedOutputModalities.every(
					(mod) => item.outputModalities.includes(mod)
				);
				if (!hasAllOutputModalities) return false;
			}

			// Endpoint filter
			if (selectedEndpoints.length > 0) {
				if (!selectedEndpoints.includes(item.endpoint)) return false;
			}

			// Status filter
			if (selectedStatuses.length > 0) {
				if (!selectedStatuses.includes(item.gatewayStatus))
					return false;
			}

			// Tier filter
			if (selectedTiers.length > 0) {
				if (!item.tier || !selectedTiers.includes(item.tier))
					return false;
			}

			return true;
		});

		// Apply sorting
		if (sortField) {
			filtered.sort((a, b) => {
				let aValue: any;
				let bValue: any;

				// Handle date sorting (models without dates go to bottom)
				if (sortField === "added" || sortField === "retired") {
					const field = sortField as "added" | "retired";
					const aHasDate = !!a[field];
					const bHasDate = !!b[field];

					if (aHasDate && bHasDate) {
						// Both have dates, compare them
						const aValue = new Date(a[field]!).getTime();
						const bValue = new Date(b[field]!).getTime();
						return sortDirection === "asc"
							? aValue - bValue
							: bValue - aValue;
					} else if (aHasDate && !bHasDate) {
						// a has date, b doesn't - a comes first
						return -1;
					} else if (!aHasDate && bHasDate) {
						// a doesn't have date, b does - b comes first
						return 1;
					} else {
						// Neither has date - equal
						return 0;
					}
				} else {
					// Set values for other fields
					switch (sortField) {
						case "model":
							aValue = a.model;
							bValue = b.model;
							break;
						case "provider":
							aValue = a.provider.name;
							bValue = b.provider.name;
							break;
						case "endpoint":
							aValue = a.endpoint;
							bValue = b.endpoint;
							break;
						case "inputPrice":
							aValue = a.provider.inputPrice;
							bValue = b.provider.inputPrice;
							break;
						case "outputPrice":
							aValue = a.provider.outputPrice;
							bValue = b.provider.outputPrice;
							break;
						case "status":
							aValue = a.gatewayStatus;
							bValue = b.gatewayStatus;
							break;
						case "tier":
							aValue = a.tier || "";
							bValue = b.tier || "";
							break;
						case "context":
							aValue = a.context;
							bValue = b.context;
							break;
						case "maxOutput":
							aValue = a.maxOutput;
							bValue = b.maxOutput;
							break;
						default:
							aValue = "";
							bValue = "";
					}

					// Handle array sorting by joining
					if (Array.isArray(aValue)) aValue = aValue.join(",");
					if (Array.isArray(bValue)) bValue = bValue.join(",");

					// Handle numeric sorting
					if (
						typeof aValue === "number" &&
						typeof bValue === "number"
					) {
						return sortDirection === "asc"
							? aValue - bValue
							: bValue - aValue;
					}

					// Handle string sorting
					const aStr = String(aValue).toLowerCase();
					const bStr = String(bValue).toLowerCase();
					if (sortDirection === "asc") {
						return aStr.localeCompare(bStr);
					} else {
						return bStr.localeCompare(aStr);
					}
				}
			});
		}

		return filtered;
	}, [
		data,
		searchQuery,
		sortField,
		sortDirection,
		selectedInputModalities,
		selectedOutputModalities,
		selectedEndpoints,
		selectedStatuses,
	]);

	// Render model cell with links for org and model
	const renderModel = (
		model: string,
		organisationId?: string,
		modelId?: string
	) => {
		return (
			<div className="flex items-center gap-2">
				{organisationId ? (
					<Link href={`/organisations/${organisationId}`}>
						<div className="w-8 h-8 relative flex items-center justify-center rounded-lg border cursor-pointer">
							<div className="w-6 h-6 relative">
								<Logo
									id={organisationId}
									alt="Organisation logo"
									className="object-contain"
									fill
								/>
							</div>
						</div>
					</Link>
				) : null}
				{modelId ? (
					<Link href={`/models/${modelId}`}>
						<span className="text-sm font-medium cursor-pointer">
							{model}
						</span>
					</Link>
				) : (
					<span className="text-sm font-medium">{model}</span>
				)}
			</div>
		);
	};
	const renderProvider = (provider: {
		name: string;
		id: string;
		inputPrice: number;
		outputPrice: number;
		features: string[];
	}) => {
		const isLinked = provider.id && provider.id !== "unlinked";

		const logo = (
			<div className="w-8 h-8 relative flex items-center justify-center rounded-lg border">
				<div className="w-6 h-6 relative">
					{isLinked ? (
						<Logo
							id={provider.id}
							alt={provider.name}
							className="object-contain"
							fill
						/>
					) : (
						<span className="text-xs text-muted-foreground">-</span>
					)}
				</div>
			</div>
		);

		const name = (
			<span className="text-sm">
				{provider.name && provider.name.toLowerCase() !== "unlinked"
					? provider.name
					: "-"}
			</span>
		);

		if (!isLinked) {
			return <span className="text-sm">-</span>;
		}

		return (
			<div className="flex items-center gap-2">
				<Link href={`/api-providers/${provider.id}`}>{logo}</Link>
				<Link href={`/api-providers/${provider.id}`}>{name}</Link>
			</div>
		);
	};

	const renderPrice = (price: number) => {
		return price > 0 ? `$${price.toFixed(2)}` : "-";
	};

	const renderModalities = (
		modalities: string[],
		type: "input" | "output"
	) => {
		return (
			<div className="flex flex-wrap gap-1 justify-center">
				{modalities.map((modality) => {
					const iconConfig =
						modalityIcons[modality as keyof typeof modalityIcons];
					if (!iconConfig) return null;

					const IconComponent =
						type === "input" ? iconConfig.input : iconConfig.output;
					if (!IconComponent) return null;

					// Convert text color to border/background color
					const colorMap: Record<string, string> = {
						"text-blue-600": "border-blue-600 bg-blue-50",
						"text-purple-600": "border-purple-600 bg-purple-50",
						"text-green-600": "border-green-600 bg-green-50",
						"text-orange-600": "border-orange-600 bg-orange-50",
						"text-red-600": "border-red-600 bg-red-50",
						"text-pink-600": "border-pink-600 bg-pink-50",
						"text-gray-600": "border-gray-600 bg-gray-50",
						"text-indigo-600": "border-indigo-600 bg-indigo-50",
						"text-cyan-600": "border-cyan-600 bg-cyan-50",
						"text-yellow-600": "border-yellow-600 bg-yellow-50",
					};

					const borderClass =
						colorMap[iconConfig.color] ||
						"border-gray-600 bg-gray-50";

					return (
						<Tooltip key={modality}>
							<TooltipTrigger asChild>
								<div
									className={`inline-flex items-center justify-center w-6 h-6 rounded border ${borderClass}`}
								>
									<IconComponent
										className={`h-4 w-4 ${iconConfig.color}`}
									/>
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p className="capitalize">{modality}</p>
							</TooltipContent>
						</Tooltip>
					);
				})}
			</div>
		);
	};

	const renderFeatures = (features: string[]) => {
		return (
			<div className="flex flex-wrap gap-1">
				{features.map((feature) => {
					const iconConfig =
						featureIcons[feature as keyof typeof featureIcons];
					if (!iconConfig) return null;

					const IconComponent = iconConfig.icon;
					if (!IconComponent) return null;

					return (
						<div
							key={feature}
							className="flex items-center gap-1"
							title={feature}
						>
							<IconComponent
								className={`h-4 w-4 ${iconConfig.color}`}
							/>
						</div>
					);
				})}
			</div>
		);
	};

	const renderStatus = (status: string) => {
		const iconConfig = statusIcons[status as keyof typeof statusIcons];
		if (!iconConfig)
			return <span className="text-muted-foreground">{status}</span>;

		const IconComponent = iconConfig.icon;

		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="inline-flex items-center justify-center w-6 h-6">
						{IconComponent && (
							<IconComponent
								className={`h-4 w-4 ${iconConfig.color}`}
							/>
						)}
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p className="capitalize">{status}</p>
				</TooltipContent>
			</Tooltip>
		);
	};

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString();
	};
	return (
		<TooltipProvider>
			<div className="space-y-4">
				{/* Table */}
				<div className="border rounded-lg relative overflow-x-auto">
					<Table className="min-w-full w-max">
						<TableHeader>
							<TableRow className="bg-background">
								<TableHead className="bg-background min-w-48 border border-gray-200 shadow-sm">
									<Button
										variant="ghost"
										onClick={() => handleSort("model")}
										className="h-auto p-0 font-semibold"
									>
										Model {getSortIcon("model")}
									</Button>
								</TableHead>
								<TableHead className="bg-background min-w-32 border border-gray-200 shadow-sm">
									<Button
										variant="ghost"
										onClick={() => handleSort("provider")}
										className="h-auto p-0 font-semibold"
									>
										Provider {getSortIcon("provider")}
									</Button>
								</TableHead>
								<TableHead className="bg-background min-w-40 border border-gray-200 shadow-sm">
									<Button
										variant="ghost"
										onClick={() => handleSort("endpoint")}
										className="h-auto p-0 font-semibold"
									>
										Endpoint {getSortIcon("endpoint")}
									</Button>
								</TableHead>
								<TableHead className="bg-background min-w-16 border border-gray-200 shadow-sm">
									<Button
										variant="ghost"
										onClick={() => handleSort("status")}
										className="h-auto p-0 font-semibold"
									>
										Gateway Status {getSortIcon("status")}
									</Button>
								</TableHead>
								<TableHead className="bg-background min-w-20 text-center border border-gray-200 shadow-sm">
									<Button
										variant="ghost"
										onClick={() => handleSort("inputPrice")}
										className="h-auto p-0 font-semibold"
									>
										Input $ {getSortIcon("inputPrice")}
									</Button>
								</TableHead>
								<TableHead className="bg-background min-w-20 text-center border border-gray-200 shadow-sm">
									<Button
										variant="ghost"
										onClick={() =>
											handleSort("outputPrice")
										}
										className="h-auto p-0 font-semibold"
									>
										Output $ {getSortIcon("outputPrice")}
									</Button>
								</TableHead>
								<TableHead className="bg-background min-w-16 text-center border border-gray-200 shadow-sm">
									<Button
										variant="ghost"
										onClick={() => handleSort("tier")}
										className="h-auto p-0 font-semibold"
									>
										Tier {getSortIcon("tier")}
									</Button>
								</TableHead>
								<TableHead className="bg-background min-w-32 text-center border border-gray-200 shadow-sm">
									<div className="font-semibold">
										Input Modalities
									</div>
								</TableHead>
								<TableHead className="bg-background min-w-32 text-center border border-gray-200 shadow-sm">
									<div className="font-semibold">
										Output Modalities
									</div>
								</TableHead>
								<TableHead className="bg-background min-w-24 text-center border border-gray-200 shadow-sm">
									<div className="font-semibold">
										Features
									</div>
								</TableHead>
								<TableHead className="bg-background min-w-20 text-center border border-gray-200 shadow-sm">
									<Button
										variant="ghost"
										onClick={() => handleSort("context")}
										className="h-auto p-0 font-semibold"
									>
										Context {getSortIcon("context")}
									</Button>
								</TableHead>
								<TableHead className="bg-background min-w-20 text-center border border-gray-200 shadow-sm">
									<Button
										variant="ghost"
										onClick={() => handleSort("maxOutput")}
										className="h-auto p-0 font-semibold"
									>
										Max Output {getSortIcon("maxOutput")}
									</Button>
								</TableHead>
								<TableHead className="bg-background min-w-20 text-center border border-gray-200 shadow-sm">
									<Button
										variant="ghost"
										onClick={() => handleSort("added")}
										className="h-auto p-0 font-semibold"
									>
										Added {getSortIcon("added")}
									</Button>
								</TableHead>
								<TableHead className="bg-background min-w-20 text-center border border-gray-200 shadow-sm">
									<Button
										variant="ghost"
										onClick={() => handleSort("retired")}
										className="h-auto p-0 font-semibold"
									>
										Retired {getSortIcon("retired")}
									</Button>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell
										colSpan={14}
										className="text-center py-8 border border-gray-200"
									>
										Loading...
									</TableCell>
								</TableRow>
							) : processedData.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={14}
										className="text-center py-8 border border-gray-200"
									>
										No models match the current filters
									</TableCell>
								</TableRow>
							) : (
								processedData.map((item) => (
									<TableRow key={item.id}>
										<TableCell className="font-medium border border-gray-200">
											{renderModel(
												item.model,
												item.organisationId,
												item.modelId
											)}
										</TableCell>
										<TableCell className="border border-gray-200">
											{renderProvider(item.provider)}
										</TableCell>
										<TableCell className="font-mono text-sm border border-gray-200">
											{item.endpoint || "-"}
										</TableCell>
										<TableCell className="text-center border border-gray-200">
											{renderStatus(item.gatewayStatus)}
										</TableCell>
										<TableCell className="font-mono text-center border border-gray-200">
											{renderPrice(
												item.provider.inputPrice
											)}
										</TableCell>
										<TableCell className="font-mono text-center border border-gray-200">
											{renderPrice(
												item.provider.outputPrice
											)}
										</TableCell>
										<TableCell className="text-center border border-gray-200 capitalize">
											{item.tier || "standard"}
										</TableCell>
										<TableCell className="text-center border border-gray-200">
											{renderModalities(
												item.inputModalities,
												"input"
											)}
										</TableCell>
										<TableCell className="text-center border border-gray-200">
											{renderModalities(
												item.outputModalities,
												"output"
											)}
										</TableCell>
										<TableCell className="text-center border border-gray-200">
											{renderFeatures(
												item.provider.features
											)}
										</TableCell>
										<TableCell className="font-mono text-center border border-gray-200">
											{item.context > 0
												? item.context.toLocaleString()
												: "-"}
										</TableCell>
										<TableCell className="font-mono text-center border border-gray-200">
											{item.maxOutput > 0
												? item.maxOutput.toLocaleString()
												: "-"}
										</TableCell>
										<TableCell className="text-sm text-center border border-gray-200">
											{item.added
												? formatDate(item.added)
												: "-"}
										</TableCell>
										<TableCell className="text-sm text-center border border-gray-200">
											{item.retired
												? formatDate(item.retired)
												: "-"}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</TooltipProvider>
	);
}
