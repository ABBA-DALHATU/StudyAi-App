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
    // Add support for more memory during compilation
    memoryBasedWorkersCount: true,
  },
  async headers() {
    return [
      {
        source: "/auth/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/auth/callback",
        headers: [
          {
            key: "x-middleware-cache",
            value: "no-cache",
          },
        ],
      },
    ];
  },
  // Set the output to a standalone server (better for deployments)
  output: "standalone",
};

export default nextConfig;
