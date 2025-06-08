import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io"], // ✅ Enables Sanity image loading
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Prevents ESLint warnings from failing Vercel builds
  },
};

export default nextConfig;
