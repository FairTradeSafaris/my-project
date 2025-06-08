/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io"], // ✅ Sanity image support
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Allow builds despite ESLint warnings
  },
};

module.exports = nextConfig;
