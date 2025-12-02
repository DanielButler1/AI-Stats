import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const monorepoRoot = path.join(__dirname, "..", "..");

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_DEPLOY_TIME:
      process.env.NEXT_PUBLIC_DEPLOY_TIME ?? new Date().toISOString(),
  },
  eslint: {
    // Lint runs in CI; skip during production build to avoid build-time patch issues
    ignoreDuringBuilds: true,
  },
  // typedRoutes: true,
  experimental: {
    ppr: 'incremental',
  },
  outputFileTracingRoot: monorepoRoot,

  // Make Turbopack root the SAME directory
  turbopack: {
    root: monorepoRoot,
  },
  // 	browserDebugInfoInTerminal: true,

  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   }
  // }
};

export default nextConfig;
