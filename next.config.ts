import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  publicRuntimeConfig: {
    API_URL: process.env.API_URL,
  },
};

export default nextConfig;
