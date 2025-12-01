import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
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
    // Allow Turbopack to resolve packages from the monorepo root during CI builds.
  },
  turbopack: {
    root: path.join(process.cwd(), "..", ".."),
  },
  // 	browserDebugInfoInTerminal: true,

  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   }
  // }
};

export default nextConfig;
