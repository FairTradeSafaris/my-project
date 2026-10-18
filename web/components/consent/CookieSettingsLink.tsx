"use client";
// Footer link that reopens the cookie banner.
import { OPEN_COOKIE_SETTINGS } from "./ConsentProvider";

export default function CookieSettingsLink({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))} className={className}>
      Cookie settings
    </button>
  );
}
