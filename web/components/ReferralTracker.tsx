"use client";
// components/ReferralTracker.tsx (batch 12, batch 26)
// Remembers an ambassador code from ?ref=CODE (or ?ambassador=CODE). Does
// nothing on normal page views. Only when a ref is present does it ask the
// site how many days to remember it (Ambassador Settings in Sanity).
// Batch 26: also (a) adds one to that code's monthly click count (at most
// once a day per browser, the count only, no personal data) and (b) adds the
// saved code to Zoho Bookings links when they are clicked, so the booking
// form's "Referral code" box is filled in.
import { useEffect } from "react";
import { cleanRefCode, getReferral, saveReferral, DEFAULT_REF_DAYS } from "@/lib/referral";
import { isBookingUrl, withBookingReferral } from "@/lib/bookingLink";

const CLICK_KEY = "fts_ref_click";

function countClick(code: string) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const mark = `${code}|${today}`;
    if (localStorage.getItem(CLICK_KEY) === mark) return;
    localStorage.setItem(CLICK_KEY, mark);
  } catch {
    /* private mode: still count once for this page view */
  }
  fetch("/api/ambassador/click/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
    keepalive: true,
  }).catch(() => {});
}

export default function ReferralTracker() {
  useEffect(() => {
    let code = "";
    try {
      const p = new URLSearchParams(window.location.search);
      code = cleanRefCode(p.get("ref") || p.get("ambassador"));
    } catch {
      return;
    }
    if (!code) return;
    // Save straight away with the default, then refine with the live setting.
    saveReferral(code, DEFAULT_REF_DAYS);
    if (navigator.onLine !== false) countClick(code);
    fetch("/api/ambassador-config/")
      .then((r) => (r.ok ? r.json() : null))
      .then((cfg: { cookieDays?: number } | null) => {
        const days = Number(cfg?.cookieDays);
        if (Number.isFinite(days) && days > 0 && days !== DEFAULT_REF_DAYS) saveReferral(code, days);
      })
      .catch(() => {});
  }, []);

  // Booking links anywhere on the site carry the saved code (batch 26).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(el instanceof HTMLAnchorElement) || !isBookingUrl(el.href)) return;
      const code = getReferral();
      if (!code) return;
      const next = withBookingReferral(el.href, code);
      if (next !== el.href) el.href = next;
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
