// Batch 13: extra service-worker code (next-pwa adds this to sw.js).
// On every new deploy, delete caches from older versions so visitors never
// get an old copy of the site. Cache names are set in next.config.ts.
const VERSION = process.env.NEXT_PUBLIC_SW_VERSION;
const KEEP = new Set([
  `fts-pages-${VERSION}`,
  `fts-assets-${VERSION}`,
  "fts-next-static",
  "fts-images",
]);
// cache names used before batch 13
const LEGACY = new Set(["html-pages", "static-assets", "images"]);

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => LEGACY.has(k) || (k.startsWith("fts-") && !KEEP.has(k)))
          .map((k) => caches.delete(k)),
      ),
    ),
  );
});
