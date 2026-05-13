import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  basePath: isProd ? "/evoc_merchant" : "",
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  devIndicators: false,
};

export default nextConfig;
