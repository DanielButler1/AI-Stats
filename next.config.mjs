/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	env: {
		NEXT_PUBLIC_DEPLOY_TIME:
			process.env.NEXT_PUBLIC_DEPLOY_TIME ?? new Date().toISOString(),
	},
};

export default nextConfig;
