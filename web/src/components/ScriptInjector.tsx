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
        const wrapper = document.createElement("div");
        wrapper.innerHTML = code.trim();
        const scriptTag = wrapper.querySelector("script");

        if (scriptTag) {
          const newScript = document.createElement("script");
          // Copy attributes from original <script> tag
          Array.from(scriptTag.attributes).forEach((attr) =>
            newScript.setAttribute(attr.name, attr.value)
          );
          newScript.textContent = scriptTag.textContent;
          document.body.appendChild(newScript);
        }
      } catch (err) {
        console.error("Script injection failed:", err);
      }
    });
  }, [scripts]);

  return null;
}
