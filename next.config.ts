import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  allowedDevOrigins: [
    "https://siwakasen.mole-mintaka.ts.net",
    "https://vulpies.tail66dfd8.ts.net",
    "localhost:3001",
    "localhost:3002",
    "localhost:3003",
    "localhost:3004",
    "localhost:3005",
    "localhost:3006",
  ],
  experimental: {
    useCache: true,
    serverActions: {
      bodySizeLimit: "200mb",
    },
  },
};

export default nextConfig;
