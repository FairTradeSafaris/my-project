import dotenv from "dotenv";
dotenv.config();

import withPWA from "next-pwa";
import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

import withBundleAnalyzerInit from "@next/bundle-analyzer";

const withBundleAnalyzer = withBundleAnalyzerInit({
  enabled: false, // 🔕 Turned off
});

const baseConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true, // ✅ Enforce trailing slashes

  serverExternalPackages: ["@clerk/clerk-sdk-node"],

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("@clerk/clerk-sdk-node");
    }
    return config;
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

  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material/{{member}}",
    },
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
    lodash: {
      transform: "lodash/{{member}}",
    },
    "date-fns": {
      transform: "date-fns/{{member}}",
    },
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    reactRemoveProperties: true,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Redirect non-www to www
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "fairtradesafaris.com",
          },
        ],
        destination: "https://www.fairtradesafaris.com/:path*",
        permanent: true,
      },
      // ✅ Optional: Redirect non-trailing slash to trailing slash (safety net)
      {
        source: "/:path*",
        has: [
          {
            type: "header",
            key: "x-vercel-matched-path-no-trailing-slash",
          },
        ],
        destination: "/:path*/",
        permanent: true,
      },
    ];
  },
};

// Runtime caching config
const runtimeCaching = [
  {
    urlPattern: ({ request }: { request: Request }) =>
      request.mode === "navigate",
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
    urlPattern: ({ url, request }: { url: URL; request: Request }) =>
      url.origin === self.location.origin &&
      ["script", "style", "worker"].includes(request.destination),
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
    urlPattern: ({ url, request }: { url: URL; request: Request }) =>
      url.origin === self.location.origin && request.destination === "image",
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

// Export wrapped config
const finalConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
  fallbacks: {
    html: "/offline.html",
  },
})(baseConfig);

export default withBundleAnalyzer(finalConfig);
