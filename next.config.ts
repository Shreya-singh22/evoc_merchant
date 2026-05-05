import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/evoc_merchant",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
