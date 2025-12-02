export type GatewayTier = {
	key: string;
	name: string;
	threshold: number;
	feePct: number;
	description: string;
};

export const GATEWAY_TIERS: readonly GatewayTier[] = [
	{
		key: "starter",
		name: "Starter",
		threshold: 0,
		feePct: 10.0,
		description: "Default tier for new teams getting started.",
	},
	{
		key: "builder",
		name: "Builder",
		threshold: 100,
		feePct: 9.75,
		description: "For casual builders unlocking their first discount.",
	},
	{
		key: "growth",
		name: "Growth",
		threshold: 1_000,
		feePct: 9.5,
		description: "Growing projects with steady gateway usage.",
	},
	{
		key: "scale",
		name: "Scale",
		threshold: 10_000,
		feePct: 9.0,
		description: "Scaling teams consolidating model workloads.",
	},
	{
		key: "enterprise",
		name: "Enterprise",
		threshold: 100_000,
		feePct: 8.5,
		description: "Enterprise deployments with significant volume.",
	},
	{
		key: "partner",
		name: "Partner",
		threshold: 1_000_000,
		feePct: 8.0,
		description: "Strategic partners with dedicated support needs.",
	},
	{
		key: "enterprise_plus",
		name: "Enterprise+",
		threshold: 10_000_000,
		feePct: 7.5,
		description: "Ultra-scale usage with bespoke commercial terms.",
	},
] as const;

// ✅ Add this missing type
export type ComputeArgs = {
	lastMonth: number;              // previous month total (currency units)
	mtd: number;                    // month-to-date total (currency units)
	tiers?: readonly GatewayTier[]; // optional override
};

export type TierComputation = {
	currentIndex: number;
	current: GatewayTier;
	next: GatewayTier | null;
	topTier: boolean;
	remainingToNext: number;  // based on MTD
	savingVsBase: number;
	projectedSavings: number;
	nextDiscountDelta: number;
	projectedIndex: number;
	projected: GatewayTier;
};

export function computeTierInfo({
	lastMonth,
	mtd,
	tiers = GATEWAY_TIERS,
}: ComputeArgs): TierComputation {
	const tierCount = tiers.length;
	if (tierCount === 0) throw new Error("No tiers configured");

	// Current tier is based on lastMonth only
	let currentIndex = 0;
	for (let i = 0; i < tierCount; i++) {
		if (lastMonth >= tiers[i].threshold) currentIndex = i;
	}
	const current = tiers[currentIndex];
	const topTier = currentIndex === tierCount - 1;
	const next = topTier ? null : tiers[currentIndex + 1];

	// Projected tier is based on MTD (what next month will be)
	let projectedIndex = 0;
	for (let i = 0; i < tierCount; i++) {
		if (mtd >= tiers[i].threshold) projectedIndex = i;
	}
	const projected = tiers[projectedIndex];

	// Savings
	const baseFee = tiers[0].feePct;
	const savingVsBase = Math.max(0, baseFee - current.feePct);
	const projectedSavings = savingVsBase > 0 ? Math.max(0, (mtd * savingVsBase) / 100) : 0;
	const nextDiscountDelta = !topTier && next ? Math.max(0, current.feePct - next.feePct) : 0;

	// Progress toward next (MTD within the current step)
	let remainingToNext = 0;
	if (!topTier && next) {
		remainingToNext = Math.max(next.threshold - mtd, 0);
	}

	return {
		currentIndex,
		current,
		next,
		topTier,
		remainingToNext,
		savingVsBase,
		projectedSavings,
		nextDiscountDelta,
		projectedIndex,
		projected,
	};
}
