import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { hostname: "cdn.dummyjson.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "cdn.abacus.ai" },
    ],
  },
};

export default nextConfig;
