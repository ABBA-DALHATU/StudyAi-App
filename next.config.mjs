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
  // Force transpilation without type checking
  transpilePackages: ["*"],
  experimental: {
    // Skip all typechecking
    skipTypechecking: true,
    // Skip middleware typechecking
    skipMiddlewareUrlNormalize: true,
    // Skip trailing slash redirects
    skipTrailingSlashRedirect: true,
  },
};

export default nextConfig;
