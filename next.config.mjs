/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: "tsconfig.json",
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ["pages", "components", "lib", "utils", "hooks", "src"],
  },
  swcMinify: true,
  poweredByHeader: false,
};

export default nextConfig;
