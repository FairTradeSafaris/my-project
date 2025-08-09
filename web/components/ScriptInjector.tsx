"use client";

import { useEffect, useMemo, useRef } from "react";

export type Script = {
  /** Optional label for debugging */
  label?: string;
  /** HTML snippet that may contain one or more <script> tags */
  code: string;
  /** If true (default), do not inject again if same src/hash already exists */
  once?: boolean;
};

/** Allow raw string snippets too (e.g., "<script src=...></script>") */
export type ScriptLike = Script | string;

type Props = {
  /** List of scripts/snippets to inject; accepts Script objects or raw strings */
  scripts?: ScriptLike[];
  /** Optional CSP nonce to apply to injected <script> tags if not already present */
  cspNonce?: string;
  /** Where to inject the scripts */
  target?: "head" | "body";
};

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0; // force 32‑bit
  }
  return String(h);
};

const toScriptObject = (s: ScriptLike): Script =>
  typeof s === "string" ? { code: s, once: true } : s;

export default function ScriptInjector({
  scripts = [],
  cspNonce,
  target = "body",
}: Props) {
  // Stable, trimmed inputs (avoid churn in deps)
  const normalized = useMemo(
    () =>
      scripts.map(toScriptObject).map((s) => ({
        ...s,
        code: s.code?.trim() ?? "",
        once: s.once ?? true,
      })),
    [scripts]
  );

  const createdEls = useRef<{
    scripts: HTMLScriptElement[];
    links: HTMLLinkElement[];
  }>({ scripts: [], links: [] });

  useEffect(() => {
    const added: HTMLScriptElement[] = [];
    const linksAdded: HTMLLinkElement[] = [];
    const preconnected = new Set<string>(); // per-effect run

    const ensurePreconnect = (origin: string) => {
      if (!origin || preconnected.has(origin)) return;
      // don't duplicate existing site links
      if (
        document.head.querySelector(`link[rel="preconnect"][href="${origin}"]`)
      ) {
        preconnected.add(origin);
        return;
      }
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = origin;
      link.crossOrigin = "anonymous";
      link.setAttribute("data-injected-by", "ScriptInjector");
      document.head.appendChild(link);
      linksAdded.push(link);
      preconnected.add(origin);
    };

    const container = target === "head" ? document.head : document.body;

    normalized.forEach(({ code, label, once }) => {
      if (!code) return;

      // Parse the snippet in a detached container
      const wrapper = document.createElement("div");
      wrapper.innerHTML = code;

      const scriptTags = wrapper.querySelectorAll("script");
      scriptTags.forEach((node) => {
        // Preconnect (if src present)
        const src = node.getAttribute("src") || "";
        if (src) {
          try {
            const origin = new URL(src, location.href).origin;
            ensurePreconnect(origin);
          } catch {
            // ignore invalid URL
          }
        }

        // Dedupe logic
        const signature = src
          ? `src:${src}`
          : `inline:${hash(node.textContent ?? "")}`;
        if (once) {
          const exists =
            !!document.querySelector(
              `script[data-signature="${CSS.escape(signature)}"]`
            ) ||
            (!!src &&
              !!document.querySelector(`script[src="${CSS.escape(src)}"]`));
          if (exists) return;
        }

        // Clone as a fresh script element (executes)
        const script = document.createElement("script");
        for (const attr of Array.from(node.attributes)) {
          script.setAttribute(attr.name, attr.value);
        }
        if (!script.getAttribute("nonce") && cspNonce) {
          script.setAttribute("nonce", cspNonce);
        }
        if (node.textContent) script.textContent = node.textContent;

        script.setAttribute("data-injected-by", "ScriptInjector");
        if (label) script.setAttribute("data-label", label);
        script.setAttribute("data-signature", signature);

        container.appendChild(script);
        added.push(script);
      });
    });

    createdEls.current.scripts = added;
    createdEls.current.links = linksAdded;

    // Cleanup only what we added
    return () => {
      createdEls.current.scripts.forEach((el) =>
        el.parentNode?.removeChild(el)
      );
      createdEls.current.scripts = [];
      createdEls.current.links.forEach((el) => {
        if (el.getAttribute("data-injected-by") === "ScriptInjector") {
          el.parentNode?.removeChild(el);
        }
      });
      createdEls.current.links = [];
    };
  }, [normalized, cspNonce, target]);

  return null;
}
