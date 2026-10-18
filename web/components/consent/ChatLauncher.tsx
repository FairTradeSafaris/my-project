"use client";
// Zoho SalesIQ chat. Loads straight away after Accept (as before). For
// everyone else a small "Chat with us" button loads it on click, so people
// who decline cookies can still reach the team.
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ScriptInjector, { type ScriptLike } from "@/components/ScriptInjector";

type Zoho = { salesiq?: { floatwindow?: { visible?: (v: string) => void } } };

export default function ChatLauncher({ scripts, autoLoad }: { scripts: ScriptLike[]; autoLoad: boolean }) {
  const [requested, setRequested] = useState(false);
  const pathname = usePathname() || "";
  const load = autoLoad || requested;

  // after a click, open the chat window once SalesIQ is ready
  useEffect(() => {
    if (!requested) return;
    let tries = 0;
    const t = window.setInterval(() => {
      const z = (window as unknown as { $zoho?: Zoho }).$zoho;
      const show = z?.salesiq?.floatwindow?.visible;
      if (typeof show === "function") {
        show("show");
        window.clearInterval(t);
      } else if (++tries > 60) window.clearInterval(t);
    }, 250);
    return () => window.clearInterval(t);
  }, [requested]);

  if (/^\/(sign-in|sign-up|sso-callback)/.test(pathname)) return null;
  if (load) return <ScriptInjector scripts={scripts} />;

  return (
    <button
      type="button"
      onClick={() => setRequested(true)}
      className="fixed bottom-[84px] right-4 z-[60] inline-flex items-center gap-2 rounded-full bg-[#5d4037] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#4a3328] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b48a] md:bottom-6 md:right-6"
      aria-label="Chat with us"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      </svg>
      Chat with us
    </button>
  );
}
