/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // This allows server components to use dynamic features like cookies and headers
    serverActions: true,
  },
};

export default nextConfig;
