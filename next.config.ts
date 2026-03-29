import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  // Disable source maps in dev to reduce memory
  productionBrowserSourceMaps: false,
  experimental: {
    // Limit webpack workers
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
