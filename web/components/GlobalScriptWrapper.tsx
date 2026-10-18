"use client";
// Batch 13: Sanity "custom header scripts", sorted by what they do.
//   necessary  - <link>/<meta> only (preconnects, verification): always on
//   chat       - Zoho SalesIQ: loads after Accept, or when the visitor
//                clicks "Chat with us" (a click is a clear request)
//   analytics  - everything else (Google tag etc.): only after Accept,
//                with Google Consent Mode v2 (basic mode)
// Devon keeps managing the scripts in Sanity exactly as before. Anything
// new that isn't recognised is treated as analytics, so nothing starts
// tracking before Accept by accident.
import { useEffect, useMemo, useState } from "react";
import ScriptInjector, { type ScriptLike } from "@/components/ScriptInjector";
import { client as sanity } from "@/lib/sanity";
import { useConsent } from "@/components/consent/ConsentProvider";
import ChatLauncher from "@/components/consent/ChatLauncher";

type SanityScript = { code?: string; label?: string; location?: string };

// Old entries that are wrong and are now handled in app/layout.tsx:
// the Sanity preconnect had a typo (jw917r14) and the Clerk one pointed at
// an unused dev host.
const SKIP = [/jw917r14/i, /clerk\.accounts\.dev/i, /accounts\.dev/i];

const CONSENT_DEFAULT = `<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
</script>`;

export default function GlobalScriptWrapper() {
  const { ready, analytics } = useConsent();
  const [raw, setRaw] = useState<SanityScript[]>([]);

  useEffect(() => {
    sanity
      .fetch<{ customHeaderScripts?: (SanityScript | string)[] }>(`*[_type == "globalSettings"][0]{ customHeaderScripts }`)
      .then((d) => setRaw((d?.customHeaderScripts ?? []).map((s) => (typeof s === "string" ? { code: s } : s))))
      .catch(() => setRaw([]));
  }, []);

  const groups = useMemo(() => {
    const necessary: ScriptLike[] = [];
    const chat: ScriptLike[] = [];
    const tracking: ScriptLike[] = [];
    for (const s of raw) {
      const code = (s.code ?? "").trim();
      if (!code) continue;
      const item = { code, label: s.label };
      if (/salesiq|zohopublic|zsiq/i.test(code)) chat.push(item);
      else if (!/<script/i.test(code)) {
        if (!SKIP.some((re) => re.test(code))) necessary.push(item);
      } else tracking.push(item);
    }
    return { necessary, chat, tracking };
  }, [raw]);

  return (
    <>
      {groups.necessary.length > 0 && <ScriptInjector scripts={groups.necessary} />}
      {ready && analytics && groups.tracking.length > 0 && (
        <ScriptInjector scripts={[{ code: CONSENT_DEFAULT, label: "Consent Mode v2" }, ...groups.tracking]} />
      )}
      {ready && groups.chat.length > 0 && <ChatLauncher scripts={groups.chat} autoLoad={analytics} />}
    </>
  );
}
