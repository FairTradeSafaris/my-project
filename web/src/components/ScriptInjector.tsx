"use client";

import { useEffect } from "react";

type Script = {
  label: string;
  code: string;
};

export default function ScriptInjector({ scripts }: { scripts: Script[] }) {
  useEffect(() => {
    scripts.forEach(({ code }) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = code.trim();
      const scriptEl = wrapper.firstElementChild;
      if (scriptEl && scriptEl.tagName === "SCRIPT") {
        document.body.appendChild(scriptEl);
      }
    });
  }, [scripts]);

  return null;
}
