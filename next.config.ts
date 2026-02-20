import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ["cdn.dummyjson.com", "images.unsplash.com", "cdn.abacus.ai"],
  },
};

export default nextConfig;
