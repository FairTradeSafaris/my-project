"use client";

import { useEffect } from "react";

type Script = {
  label: string;
  code: string;
};

export default function ScriptInjector({ scripts }: { scripts: Script[] }) {
  useEffect(() => {
    scripts.forEach(({ code }) => {
      try {
        // Create a temporary wrapper to parse HTML string
        const wrapper = document.createElement("div");
        wrapper.innerHTML = code.trim();

        const scriptTag = wrapper.querySelector("script");

        if (scriptTag) {
          const newScript = document.createElement("script");

          // Copy attributes like src, async, defer if present
          Array.from(scriptTag.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });

          // Add inline content if script has it
          if (scriptTag.innerHTML) {
            newScript.text = scriptTag.innerHTML;
          }

          document.body.appendChild(newScript);
        } else {
          console.warn("No <script> tag found in:", code);
        }
      } catch (err) {
        console.error("Error injecting script:", err, code);
      }
    });
  }, [scripts]);

  return null;
}
