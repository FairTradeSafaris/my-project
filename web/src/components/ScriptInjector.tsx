"use client";

import { useEffect } from "react";

type Script = {
  label: string;
  code: string;
};

export default function ScriptInjector({ scripts }: { scripts: Script[] }) {
  useEffect(() => {
    const preconnected = new Set<string>();

    scripts.forEach(({ code }) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = code.trim();

      const scriptTags = wrapper.querySelectorAll("script");

      scriptTags.forEach((node) => {
        // PRECONNECT LOGIC
        const src = node.getAttribute("src");
        if (src) {
          try {
            const url = new URL(src);
            const origin = url.origin;

            if (!preconnected.has(origin)) {
              const link = document.createElement("link");
              link.rel = "preconnect";
              link.href = origin;
              link.crossOrigin = "anonymous";
              document.head.appendChild(link);
              preconnected.add(origin);
            }
          } catch (err: unknown) {
            console.warn("Invalid script src for preconnect:", src, err);
          }
        }

        // SCRIPT INJECTION
        const script = document.createElement("script");
        for (const attr of node.attributes) {
          script.setAttribute(attr.name, attr.value);
        }
        if (node.textContent) {
          script.textContent = node.textContent;
        }

        document.body.appendChild(script);
      });
    });
  }, [scripts]);

  return null;
}
