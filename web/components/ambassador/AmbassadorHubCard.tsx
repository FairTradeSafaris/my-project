"use client";
// components/ambassador/AmbassadorHubCard.tsx (batch 24)
// Small card on Safari Hub, shown only to people with an ambassador account
// (claimed or approved). Everyone else sees nothing; if the check fails
// (offline, error) it also shows nothing.
import Link from "next/link";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import type { AmbassadorMe } from "@/lib/ambassadorTypes";
import { homeBody, homeButtonOutline, homeCard, homeEyebrow } from "@/components/home/homeStyles";

export default function AmbassadorHubCard() {
  const [me, setMe] = useState<AmbassadorMe | null>(null);

  useEffect(() => {
    let alive = true;
    authFetch(`/api/ambassador/me/?ts=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: AmbassadorMe | null) => {
        if (alive && d && d.state && d.state !== "none") setMe(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!me) return null;
  const text =
    me.state === "pending"
      ? "Thank you for linking your code. Our team is confirming it, and your dashboard will open soon."
      : me.state === "paused"
        ? "Your ambassador account is paused at the moment."
        : "Your referral code, personal link, QR code and a ready-to-send message.";

  return (
    <section className={`${homeCard} flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-7`}>
      <div>
        <p className={homeEyebrow}>Ambassador Programme</p>
        <h2 className="mt-1 text-[22px] font-semibold text-[#24170f] sm:text-[24px]">
          Your ambassador area{me.code && me.state !== "pending" ? ` · ${me.code}` : ""}
        </h2>
        <p className={`mt-1 ${homeBody}`}>{text}</p>
      </div>
      <Link href="/client-home/ambassador/" className={homeButtonOutline}>
        Open ambassador area
      </Link>
    </section>
  );
}
