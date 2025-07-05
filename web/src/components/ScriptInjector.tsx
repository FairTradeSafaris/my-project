"use client";

import { useEffect } from "react";

type Script = {
  label: string;
  code: string;
};

export default function ScriptInjector({ scripts }: { scripts: Script[] }) {
  useEffect(() => {
    scripts.forEach(({ code }) => {
      // Create a temporary DOM element to extract all <script> tags
      const wrapper = document.createElement("div");
      wrapper.innerHTML = code.trim();

      const scriptTags = wrapper.querySelectorAll("script");

      scriptTags.forEach((node) => {
        const script = document.createElement("script");

        // Copy attributes
        for (const attr of node.attributes) {
          script.setAttribute(attr.name, attr.value);
        }

        // Copy inline script content
        if (node.textContent) {
          script.textContent = node.textContent;
        }

        // Append to body (as per Zoho’s requirement)
        document.body.appendChild(script);
      });
    });
  }, [scripts]);

  return null;
}
