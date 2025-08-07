/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXT_PUBLIC_DEPLOY_TIME:
			process.env.NEXT_PUBLIC_DEPLOY_TIME ?? new Date().toISOString(),
	},
	async rewrites() {
		return [
			{
				source: "/ingest/static/:path*",
				destination: "https://eu-assets.i.posthog.com/static/:path*",
			},
			{
				source: "/ingest/:path*",
				destination: "https://eu.i.posthog.com/:path*",
			},
			{
				source: "/ingest/flags",
				destination: "https://eu.i.posthog.com/flags",
			},
		];
	},
	skipTrailingSlashRedirect: true,
};

export default nextConfig;
