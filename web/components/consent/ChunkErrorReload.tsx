"use client";
// If a tab was opened before a deploy, its old page can ask for code files
// that no longer exist ("ChunkLoadError"). Reload once to get the fresh
// version instead of showing a half-working page.
import { useEffect } from "react";

const KEY = "fts_chunk_reload";

export default function ChunkErrorReload() {
  useEffect(() => {
    const isChunkError = (msg: string) => /ChunkLoadError|Loading chunk [\w-]+ failed|Loading CSS chunk|Failed to fetch dynamically imported module/i.test(msg);
    const tryReload = (msg: string) => {
      if (!isChunkError(msg)) return;
      try {
        if (sessionStorage.getItem(KEY)) return; // only once per tab
        sessionStorage.setItem(KEY, "1");
      } catch {
        return;
      }
      location.reload();
    };
    const onError = (e: ErrorEvent) => tryReload(String(e.message || e.error?.name || ""));
    const onRejection = (e: PromiseRejectionEvent) => {
      const r = e.reason as { name?: string; message?: string } | undefined;
      tryReload(`${r?.name ?? ""} ${r?.message ?? String(e.reason ?? "")}`);
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    // a successful load clears the flag so a later deploy can reload again
    const t = window.setTimeout(() => {
      try {
        sessionStorage.removeItem(KEY);
      } catch {}
    }, 10000);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      window.clearTimeout(t);
    };
  }, []);
  return null;
}
