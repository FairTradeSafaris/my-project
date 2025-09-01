"use client";

import { useEffect, useMemo, useRef } from "react";

export type Script = {
  label?: string;
  code: string;
  once?: boolean;
};

export type ScriptLike = Script | string;

type Props = {
  scripts?: ScriptLike[];
  cspNonce?: string;
  target?: "head" | "body";
};

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
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
    const addedScripts: HTMLScriptElement[] = [];
    const addedLinks: HTMLLinkElement[] = [];
    const container = target === "head" ? document.head : document.body;

    normalized.forEach(({ code, label, once }) => {
      if (!code) return;

      const wrapper = document.createElement("div");
      wrapper.innerHTML = code;

      // --- Handle <script> tags ---
      const scriptTags = wrapper.querySelectorAll("script");
      scriptTags.forEach((node) => {
        const src = node.getAttribute("src") || "";
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
        addedScripts.push(script);
      });

      // --- Handle <link> tags ---
      const linkTags = wrapper.querySelectorAll("link");
      linkTags.forEach((node) => {
        const href = node.getAttribute("href");
        const rel = node.getAttribute("rel");

        if (!href || !rel) return;

        const signature = `rel:${rel}-href:${href}`;

        if (once) {
          const exists = !!document.querySelector(
            `link[rel="${rel}"][href="${href}"]`
          );
          if (exists) return;
        }

        const link = document.createElement("link");
        for (const attr of Array.from(node.attributes)) {
          link.setAttribute(attr.name, attr.value);
        }

        link.setAttribute("data-injected-by", "ScriptInjector");
        if (label) link.setAttribute("data-label", label);
        link.setAttribute("data-signature", signature);

        document.head.appendChild(link);
        addedLinks.push(link);
      });
    });

    // ✅ Take a snapshot of what was added in this render
    const cleanupSnapshot = {
      scripts: addedScripts,
      links: addedLinks,
    };

    createdEls.current.scripts = addedScripts;
    createdEls.current.links = addedLinks;

    return () => {
      cleanupSnapshot.scripts.forEach((el) => el.parentNode?.removeChild(el));
      cleanupSnapshot.links.forEach((el) => el.parentNode?.removeChild(el));
    };
  }, [normalized, cspNonce, target]);

  return null;
}
