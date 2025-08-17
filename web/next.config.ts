import dotenv from "dotenv";
dotenv.config();

import withPWA from "next-pwa";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ] as RemotePattern[],
  },

  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
};

// 🔧 Add Cache-Control headers for homepage
const headers = async () => [
  {
    source: "/",
    headers: [
      {
        key: "Cache-Control",
        value: "public, s-maxage=600, stale-while-revalidate=59",
      },
    ],
  },
];

// ⚙️ Runtime caching rules for PWA
const runtimeCaching = [
  {
    urlPattern: (ctx: unknown) => {
      const request = (ctx as { request: Request }).request;
      return request.mode === "navigate";
    },
    handler: "NetworkFirst",
    options: {
      cacheName: "html-pages",
      networkTimeoutSeconds: 3,
      expiration: {
        maxEntries: 80,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      },
      matchOptions: { ignoreVary: true },
    },
  },
  {
    urlPattern: (ctx: unknown) => {
      const { url, request } = ctx as { url: URL; request: Request };
      return (
        url.origin === self.location.origin &&
        ["script", "style", "worker"].includes(request.destination)
      );
    },
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-assets",
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      },
    },
  },
  {
    urlPattern: (ctx: unknown) => {
      const { url, request } = ctx as { url: URL; request: Request };
      return (
        url.origin === self.location.origin && request.destination === "image"
      );
    },
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "images",
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      },
    },
  },
];

// 🔌 Wrap withPWA
const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
  fallbacks: {
    html: "/offline.html",
  },
});

// 🧩 Merge and export
const finalConfig = {
  ...withPWAConfig(baseConfig),
  headers,
};

export default finalConfig;
