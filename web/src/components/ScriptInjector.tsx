"use client";

import { useEffect } from "react";

type Script = {
  code: string;
  label?: string;
};

export default function ScriptInjector({ scripts }: { scripts: Script[] }) {
  useEffect(() => {
    scripts.forEach(({ code }) => {
      const script = document.createElement("script");

      // Try to extract the `src` if present
      const srcMatch = code.match(/src=["']([^"']+)["']/);
      if (srcMatch) {
        script.src = srcMatch[1];
        script.defer = true;
      } else {
        // Otherwise strip <script> tags and inject code
        const cleanedCode = code
          .replace(/<script.*?>/, "")
          .replace(/<\/script>/, "");
        script.innerHTML = cleanedCode;
      }

      document.head.appendChild(script);
    });
  }, [scripts]);

  return null;
}
