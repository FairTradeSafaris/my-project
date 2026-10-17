// lib/referral.ts (batch 12) - browser-only helpers for ambassador referral codes.
export const REF_KEY = "fts_ref";
export const REF_COOKIE = "fts_ref";
export const DEFAULT_REF_DAYS = 90;

export type StoredRef = { code: string; savedAt: number; expiresAt: number };

/** Codes are 2-32 letters, numbers, dash or underscore. Stored upper-case. */
export function cleanRefCode(v: unknown): string {
  const s = String(v ?? "").trim().toUpperCase();
  return /^[A-Z0-9_-]{2,32}$/.test(s) ? s : "";
}

export function saveReferral(code: string, days: number) {
  if (typeof window === "undefined") return;
  const clean = cleanRefCode(code);
  if (!clean) return;
  const d = Number.isFinite(days) && days > 0 ? Math.min(days, 365) : DEFAULT_REF_DAYS;
  const now = Date.now();
  const rec: StoredRef = { code: clean, savedAt: now, expiresAt: now + d * 86400000 };
  try {
    localStorage.setItem(REF_KEY, JSON.stringify(rec));
  } catch {
    /* private mode */
  }
  try {
    document.cookie = `${REF_COOKIE}=${encodeURIComponent(clean)}; Max-Age=${Math.round(d * 86400)}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  } catch {
    /* ignore */
  }
}

export function getReferral(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem(REF_KEY);
    if (raw) {
      const rec = JSON.parse(raw) as StoredRef;
      if (rec && rec.expiresAt > Date.now()) return cleanRefCode(rec.code);
      localStorage.removeItem(REF_KEY);
    }
  } catch {
    /* ignore */
  }
  const m = document.cookie.match(new RegExp(`(?:^|; )${REF_COOKIE}=([^;]*)`));
  return m ? cleanRefCode(decodeURIComponent(m[1])) : "";
}
