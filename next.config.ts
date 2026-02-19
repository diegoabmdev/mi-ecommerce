import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ["cdn.dummyjson.com"],
  },
};

export default nextConfig;
