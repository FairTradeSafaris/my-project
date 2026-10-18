import withPWA from "next-pwa";
import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";
import redirectsData from "./public/redirects.json" with { type: "json" };

import withBundleAnalyzerInit from "@next/bundle-analyzer";
type RedirectItem = {
  source: string;
  destination: string;
  permanent?: boolean;
};
const withBundleAnalyzer = withBundleAnalyzerInit({
  enabled: false,
});

// Batch 13: one version id per build/deploy, used in service-worker cache
// names so old cached pages are dropped after each deploy.
const SW_VERSION = (
  process.env.VERCEL_GIT_COMMIT_SHA || Date.now().toString(36)
).slice(0, 10);

const baseConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,

  // SEO: Next 15.2+ streams <title>/<meta>/<link rel=canonical> into <body>
  // for any UA not matched here (Googlebot, AI crawlers, Screaming Frog...).
  // Matching every UA makes metadata blocking again, so it always lands in
  // <head> and notFound() thrown from generateMetadata returns a real 404.
  htmlLimitedBots: /.*/,

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
    NEXT_PUBLIC_SW_VERSION: SW_VERSION, // batch 13 (service worker caches)
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
      // Batch 8: build assets (CSS/JS/fonts) stay crawlable so Google can
      // render pages, but must not be listed as "Crawled - not indexed".
      {
        source: "/_next/static/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;",
              "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https:;",
              "style-src 'self' 'unsafe-inline' https:;",
              "img-src 'self' data: blob: https:;",
              "media-src 'self' https:;",
              "connect-src 'self' https:;",
              "font-src 'self' data: https:;",
              "frame-src https:;",
              "worker-src 'self' blob:;",
            ].join(" "),
          },
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },

  async redirects() {
    const dynamicRedirects = (redirectsData as RedirectItem[]).map((r) => ({
      source: r.source.endsWith("/") ? r.source : `${r.source}/`,
      destination: r.destination.endsWith("/")
        ? r.destination
        : `${r.destination}/`,
      permanent: r.permanent ?? true,
    }));

    return [
      // 🌍 Force non-www → www
      {
        source: "/:path*",
        has: [{ type: "host", value: "fairtradesafaris.com" }],
        destination: "https://www.fairtradesafaris.com/:path*",
        permanent: true,
      },

      // 🔁 Trailing slash safety
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

      // Batch 8: GSC "Crawled - currently not indexed" cleanup (301s).
      // trailingSlash: true already 308s /foo -> /foo/ before these run.
      { source: "/blog/page/1/", destination: "/blog/", statusCode: 301 },
      {
        source:
          "/blog/tags/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/",
        destination: "/blog/",
        statusCode: 301,
      },
      // was a 2-hop chain via redirects.json + trailing slash
      {
        source: "/trips/destinations/rwanda/",
        destination: "/destination/rwanda/",
        statusCode: 301,
      },
      // duplicate Sanity doc (same YouTube video as greg-and-megan-shindler)
      {
        source: "/videoTestimonial/greg-and-megan-shindler1/",
        destination: "/videoTestimonial/greg-and-megan-shindler/",
        statusCode: 301,
      },

      // ✅ CORE FIXES
      {
        source: "/destinations/:slug/",
        destination: "/destination/:slug/",
        permanent: true,
      },
      // SEO: legacy / mistyped URLs that currently render soft-404s
      {
        source: "/non-profits/",
        destination: "/nonprofits/",
        permanent: true,
      },
      {
        source: "/ethicalsustainablesafaris/",
        destination: "/ethical-sustainable-safaris/",
        permanent: true,
      },
      {
        source: "/video-testimonials/",
        destination: "/videoTestimonial/",
        permanent: true,
      },
      {
        source: "/video-testimonials/:slug/",
        destination: "/videoTestimonial/:slug/",
        permanent: true,
      },
      {
        source: "/africansafariitineraries/null/",
        destination: "/africansafariitineraries/",
        permanent: true,
      },
      {
        source: "/destination/null/",
        destination: "/destination/",
        permanent: true,
      },
      {
        source: "/news/:path*/",
        destination: "/blog/",
        permanent: true,
      },
      {
        source: "/adventure/:path*/",
        destination: "/blog/",
        permanent: true,
      },

      // 🚀 SANITY-DRIVEN REDIRECTS
      ...dynamicRedirects,
    ];
  },
};

// PWA caching (batch 13)
// - Pages: always from the network when there is one (even if slow). The
//   saved copy is used only when the device is offline, then /offline.html.
//   (Before: a 3-second timeout served copies up to 7 days old on slow
//   connections, so visitors saw an old version of the site.)
// - /_next/static: file names change with every deploy, so a cached copy can
//   never be stale; cache-first keeps the site fast on poor signal.
// - Cache names carry the build version; worker/index.js deletes old ones.
// NOTE: urlPattern functions are copied into sw.js, so they must not use
// variables from this file.
const runtimeCaching = [
  {
    urlPattern: ({ request }: { request: Request }) =>
      request.mode === "navigate",
    handler: "NetworkFirst",
    options: {
      cacheName: `fts-pages-${SW_VERSION}`,
      expiration: {
        maxEntries: 60,
        maxAgeSeconds: 14 * 24 * 60 * 60,
      },
      matchOptions: { ignoreVary: true },
    },
  },
  {
    urlPattern: ({ url }: { url: URL }) =>
      url.origin === self.location.origin &&
      url.pathname.startsWith("/_next/static/"),
    handler: "CacheFirst",
    options: {
      cacheName: "fts-next-static",
      expiration: {
        maxEntries: 400,
        maxAgeSeconds: 60 * 24 * 60 * 60,
      },
    },
  },
  {
    urlPattern: ({ url, request }: { url: URL; request: Request }) =>
      url.origin === self.location.origin &&
      !url.pathname.startsWith("/_next/static/") &&
      ["script", "style", "worker"].includes(request.destination),
    handler: "NetworkFirst",
    options: {
      cacheName: `fts-assets-${SW_VERSION}`,
      expiration: {
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      },
    },
  },
  {
    urlPattern: ({ url, request }: { url: URL; request: Request }) =>
      url.origin === self.location.origin && request.destination === "image",
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "fts-images",
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      },
    },
  },
];

// (typed loosely: publicExcludes / RegExp buildExcludes are valid next-pwa
// options that its type definitions are missing)
const pwaOptions = {
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
  fallbacks: {
    // next-pwa expects "document" (the old "html" key was ignored, so the
    // offline page never showed)
    document: "/offline.html",
  },
  // Batch 13: don't pre-download the whole site (was ~60 MB of images and
  // code per visitor, bad on mobile data). Pages and files are saved as
  // they are visited; only the offline page is stored up front.
  publicExcludes: ["!**/*"],
  buildExcludes: [/.*/],
  additionalManifestEntries: [{ url: "/offline.html", revision: SW_VERSION }],
};
const finalConfig = withPWA(
  pwaOptions as unknown as Parameters<typeof withPWA>[0],
)(baseConfig);

export default withBundleAnalyzer(finalConfig);
