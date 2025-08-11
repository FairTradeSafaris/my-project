"use client";

import { useEffect } from "react";

/**
 * Minimal service worker registrar for App Router projects.
 * Registers /sw.js in production only.
 */
export default function PWARegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const swUrl = "/sw.js";

    navigator.serviceWorker
      .register(swUrl, { scope: "/" })
      .then((registration) => {
        console.log("[PWA] Service worker registered:", registration.scope);

        // Listen for updates to the SW
        registration.onupdatefound = () => {
          const installing = registration.installing;
          if (!installing) return;

          installing.onstatechange = () => {
            if (installing.state === "installed") {
              if (navigator.serviceWorker.controller) {
                console.log(
                  "[PWA] New content available; will apply on next reload."
                );
              } else {
                console.log("[PWA] Content cached for offline use.");
              }
            }
          };
        };
      })
      .catch((err) => {
        console.error("[PWA] Service worker registration failed:", err);
      });
  }, []);

  return null;
}
