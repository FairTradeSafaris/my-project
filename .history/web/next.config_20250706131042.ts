import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**", // allows all image paths from Sanity
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Still good for Vercel builds
  },
};

export default nextConfig;
