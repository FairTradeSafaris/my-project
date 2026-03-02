"use client";

import ScriptInjector, { type ScriptLike } from "@/components/ScriptInjector";
import { client as sanity } from "@/lib/sanity";
import { useEffect, useState } from "react";

export const revalidate = 300;

export default function GlobalScriptWrapper() {
  const [scripts, setScripts] = useState<ScriptLike[]>([]);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");

    if (consent === "accepted") {
      // Fetch scripts from Sanity only if user accepted cookies
      const fetchScripts = async () => {
        try {
          const query = `*[_type == "globalSettings"][0]{ customHeaderScripts }`;
          const opts: { next: { revalidate: number } } = {
            next: { revalidate },
          };
          const data = await sanity.fetch<{
            customHeaderScripts?: string[];
          }>(query, {}, opts);
          setScripts(data?.customHeaderScripts ?? []);
        } catch {
          // silently skip if it fails
          setScripts([]);
        }
      };

      fetchScripts();
    }
  }, []);

  if (!scripts.length) return null;

  return <ScriptInjector scripts={scripts} />;
}
