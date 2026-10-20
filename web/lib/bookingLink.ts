"use client";
// lib/bookingLink.ts (batch 26)
// Adds the visitor's saved ambassador code to Zoho Bookings links and embeds,
// so the "Referral code" box on the booking form is filled in for them.
//
// Zoho Bookings pre-fills any booking-form field (default or custom) from a
// query parameter named exactly like the field label, placed after the
// "#/workspace" part of the URL, e.g.
//   https://bookings.fairtradesafaris.com/portal-embed#/fairtradesafaris?Referral%20code=JANE25
// (help.zoho.com > Zoho Bookings > Booking page > "Pre-fill Field values").
// The visitor can still see and change the value. Nothing is sent anywhere
// except to Zoho Bookings, and only when a code was saved from a ?ref= link.
import { useEffect, useState } from "react";
import { getReferral } from "@/lib/referral";

/** Label of the booking-form field in Zoho Bookings (must match exactly). */
export const BOOKING_REF_FIELD = process.env.NEXT_PUBLIC_ZOHO_BOOKING_REF_FIELD || "Referral code";

export function isBookingUrl(url: string): boolean {
  try {
    const u = new URL(url, "https://www.fairtradesafaris.com");
    return /(^|\.)bookings\.fairtradesafaris\.com$/i.test(u.hostname) || /\.zohobookings\.(com|eu|in)$/i.test(u.hostname);
  } catch {
    return false;
  }
}

/** Returns url with the referral code added (unchanged if no code or not a booking URL). */
export function withBookingReferral(url: string, code: string): string {
  if (!code || !url || !isBookingUrl(url)) return url;
  const key = encodeURIComponent(BOOKING_REF_FIELD);
  if (url.includes(`${key}=`)) return url;
  const pair = `${key}=${encodeURIComponent(code)}`;
  const hashAt = url.indexOf("#");
  if (hashAt === -1) {
    // Plain booking page link: Zoho's router reads the params after the hash.
    return `${url.replace(/\/?$/, "/")}#/fairtradesafaris?${pair}`;
  }
  return url.includes("?", hashAt) ? `${url}&${pair}` : `${url}?${pair}`;
}

/** React hook: the booking URL with the saved code, filled in after the page loads. */
export function useBookingUrl(url: string): string {
  const [out, setOut] = useState(url);
  useEffect(() => {
    setOut(withBookingReferral(url, getReferral()));
  }, [url]);
  return out;
}
