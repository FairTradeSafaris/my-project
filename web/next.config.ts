import dotenv from "dotenv";
dotenv.config();

import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ] satisfies import("next/dist/shared/lib/image-config").RemotePattern[],
  },

  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
};

const runtimeCaching = [
  // 1) HTML navigations: keep last-browsed pages available offline
  {
    urlPattern: (ctx: { request: Request }) => ctx.request.mode === "navigate",
    handler: "NetworkFirst",
    options: {
      cacheName: "html-pages",
      networkTimeoutSeconds: 3, // use cache if network is slow/offline
      expiration: {
        maxEntries: 80,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      },
      // only cache same-origin HTML
      matchOptions: { ignoreVary: true },
    },
  },

  // 2) Same-origin static assets (JS/CSS): fast updates when online, cached when offline
  {
    urlPattern: (ctx: { url: URL; request: Request }) =>
      ctx.url.origin === self.location.origin &&
      (ctx.request.destination === "script" ||
        ctx.request.destination === "style" ||
        ctx.request.destination === "worker"),

    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-assets",
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },

  // 3) Same-origin images: keep recent images available offline
  {
    urlPattern: (ctx: { url: URL; request: Request }) =>
      ctx.url.origin === self.location.origin &&
      ctx.request.destination === "image",
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

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
  fallbacks: {
    html: "/offline.html", // used if no cached page exists yet
  },
})(nextConfig);
