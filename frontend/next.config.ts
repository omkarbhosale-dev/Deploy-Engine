import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    turbopack: {
      root: '../', // Point to the parent directory where the backend workspace sits
    },
};

export default nextConfig;
