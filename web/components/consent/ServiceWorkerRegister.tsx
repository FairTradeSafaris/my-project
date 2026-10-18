"use client";
// Batch 13: register the offline service worker (/sw.js).
// next-pwa's automatic registration only works with the old "pages" router,
// so on this app-router site the worker was never installed for new
// visitors. Registering it here turns offline mode back on.
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        /* offline mode is a bonus; ignore failures */
      });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);
  return null;
}
