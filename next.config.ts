import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore Next.js warns to use this for network testing
  allowedDevOrigins: ['10.31.248.177'],
};

export default nextConfig;
