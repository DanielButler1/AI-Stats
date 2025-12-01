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
  },
  // 	browserDebugInfoInTerminal: true,

  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   }
  // }
};

export default nextConfig;
