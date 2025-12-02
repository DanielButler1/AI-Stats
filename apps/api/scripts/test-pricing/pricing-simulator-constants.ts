import type { CLIOptions } from "./pricing-simulator-types";

export const DEFAULT_OPTIONS: CLIOptions = {
    limit: 5,
    runs: 1,
    randomize: false,
    plan: "all",
    min: 10000,
    max: 10000000,
    seed: Date.now(),
    verbose: false,
    includeInactive: true,
    debug: false,
};

export const ANSI = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    green: "\x1b[32m",
    red: "\x1b[31m",
};

export const DIFF_TOLERANCE = 1e-6;