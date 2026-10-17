"use client";
// components/ReferralTracker.tsx (batch 12)
// Remembers an ambassador code from ?ref=CODE (or ?ambassador=CODE). Does
// nothing on normal page views. Only when a ref is present does it ask the
// site how many days to remember it (Ambassador Settings in Sanity).
import { useEffect } from "react";
import { cleanRefCode, saveReferral, DEFAULT_REF_DAYS } from "@/lib/referral";

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
    fetch("/api/ambassador-config/")
      .then((r) => (r.ok ? r.json() : null))
      .then((cfg: { cookieDays?: number } | null) => {
        const days = Number(cfg?.cookieDays);
        if (Number.isFinite(days) && days > 0 && days !== DEFAULT_REF_DAYS) saveReferral(code, days);
      })
      .catch(() => {});
  }, []);
  return null;
}
