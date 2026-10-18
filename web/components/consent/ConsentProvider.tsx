"use client";
// Batch 13: ONE place that knows the visitor's cookie choice.
// - Only analytics/marketing tags depend on it (see ConsentScripts.tsx).
//   Login, menus, filters, the portal, wishlist etc. work the same for all.
// - Stored in a first-party cookie (fts_consent) and mirrored to
//   localStorage["cookieConsent"] ("accepted" / "denied") so existing
//   choices carry over and nobody is asked twice.
// - No page reload on Accept or Decline.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ConsentState = { decided: boolean; analytics: boolean; marketing: boolean };
type Ctx = ConsentState & {
  ready: boolean; // false until the stored choice has been read (first paint)
  accept: () => void;
  decline: () => void;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const COOKIE = "fts_consent";
const LS_KEY = "cookieConsent";
export const OPEN_COOKIE_SETTINGS = "fts:open-cookie-settings";
const UNDECIDED: ConsentState = { decided: false, analytics: false, marketing: false };

const ConsentContext = createContext<Ctx | null>(null);

function readStored(): ConsentState {
  try {
    const m = document.cookie.match(/(?:^|; )fts_consent=([^;]*)/);
    if (m) {
      const v = decodeURIComponent(m[1]); // e.g. "v1.a1.m0"
      return { decided: true, analytics: /\.a1\b/.test(v), marketing: /\.m1\b/.test(v) };
    }
    const legacy = localStorage.getItem(LS_KEY); // pre-batch-13 choice
    if (legacy === "accepted") return { decided: true, analytics: true, marketing: true };
    if (legacy === "denied") return { decided: true, analytics: false, marketing: false };
  } catch {
    /* storage blocked: treat as undecided */
  }
  return UNDECIDED;
}

function persist(s: ConsentState) {
  try {
    const v = `v1.a${s.analytics ? 1 : 0}.m${s.marketing ? 1 : 0}`;
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE}=${v}; Max-Age=${365 * 86400}; Path=/; SameSite=Lax${secure}`;
    localStorage.setItem(LS_KEY, s.analytics || s.marketing ? "accepted" : "denied");
  } catch {
    /* ignore */
  }
}

/** Remove Google Analytics / Ads cookies after a visitor withdraws consent. */
function clearGoogleCookies() {
  const host = location.hostname.replace(/^www\./, "");
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (/^(_ga|_gid|_gat|_gcl_|_gac_)/.test(name)) {
      for (const domain of ["", `; Domain=${host}`, `; Domain=.${host}`]) {
        document.cookie = `${name}=; Max-Age=0; Path=/${domain}`;
      }
    }
  });
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConsentState>(UNDECIDED);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const s = readStored();
    if (s.decided) persist(s); // migrate the old localStorage-only choice
    setState(s);
    setReady(true);

    const onOpen = () => setSettingsOpen(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_KEY) setState(readStored()); // another tab changed it
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS, onOpen);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(OPEN_COOKIE_SETTINGS, onOpen);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const set = useCallback((next: ConsentState) => {
    setState((prev) => {
      if ((prev.analytics || prev.marketing) && !(next.analytics || next.marketing)) {
        const w = window as unknown as { gtag?: (...a: unknown[]) => void };
        w.gtag?.("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
        clearGoogleCookies();
      }
      return next;
    });
    persist(next);
    setSettingsOpen(false);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      ready,
      accept: () => set({ decided: true, analytics: true, marketing: true }),
      decline: () => set({ decided: true, analytics: false, marketing: false }),
      settingsOpen,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
    }),
    [state, ready, settingsOpen, set],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): Ctx {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used inside <ConsentProvider>");
  return ctx;
}
