"use client";
// components/ambassador/AmbassadorArea.tsx (batch 24)
// /client-home/ambassador/: signed-out -> sign-in card; signed-in -> loads
// /api/ambassador/me/ after the page opens (never part of the cached page,
// so offline mode is unchanged) and shows the claim form, "waiting for
// approval", or the dashboard. Uses the existing Clerk sign-in as it is.
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import type { AmbassadorMe } from "@/lib/ambassadorTypes";
import AmbassadorDashboard from "./AmbassadorDashboard";
import { homeBody, homeButton, homeButtonOutline, homeCard, homeTextLink } from "@/components/home/homeStyles";

const h2 = "text-[24px] font-semibold leading-tight text-[#24170f] md:text-[28px]";

export function SignInCard() {
  return (
    <section className={`${homeCard} mx-auto max-w-2xl p-6 text-center md:p-10`}>
      <h2 className={h2}>Please sign in to see your ambassador area</h2>
      <p className={`mx-auto mt-3 max-w-xl ${homeBody}`}>
        Use the same email address you gave us when you applied to the Ambassador Programme.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={`/sign-in/?redirect_url=${encodeURIComponent("/client-home/ambassador/")}`} className={homeButton}>
          Sign in
        </Link>
        <Link href="/sign-up/" className={homeButtonOutline}>
          Create an account
        </Link>
      </div>
      <p className={`mt-6 ${homeBody}`}>
        Not an ambassador yet?{" "}
        <Link href="/affiliate-program/" className={homeTextLink}>
          About the Ambassador Programme
        </Link>
      </p>
    </section>
  );
}

export function ClaimCard({ onClaimed }: { onClaimed: (me: AmbassadorMe) => void }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const clean = code.trim().toUpperCase();
    if (!/^[A-Z0-9_-]{2,32}$/.test(clean)) {
      setError("Please enter your code exactly as it appears in our email, for example JANE25.");
      return;
    }
    setBusy(true);
    try {
      const res = await authFetch("/api/ambassador/claim/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: clean }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; me?: AmbassadorMe };
      if (res.ok && data.ok && data.me) onClaimed(data.me);
      else setError(data.error || "Sorry, something went wrong. Please try again.");
    } catch {
      setError("We couldn't reach our website. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={`${homeCard} mx-auto max-w-2xl p-6 md:p-10`}>
      <h2 className={h2}>Link your ambassador account</h2>
      <p className={`mt-3 ${homeBody} md:text-[17px] md:leading-8`}>
        Enter the referral code from our welcome email. You only need to do this once. Our team will confirm it,
        usually within a working day, and then your dashboard opens here.
      </p>
      <form onSubmit={submit} className="mt-6" noValidate>
        <label htmlFor="amb-claim" className="block text-[15px] font-semibold text-[#24170f]">
          Your referral code
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="amb-claim"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={32}
            placeholder="e.g. JANE25"
            aria-describedby="amb-claim-msg"
            className="h-12 flex-1 rounded-xl border border-[#d9cbb8] bg-white px-4 text-[17px] tracking-[0.06em] text-[#24170f] placeholder:tracking-normal placeholder:text-[#8a7766] focus:border-[#a35c2d] focus:outline-none focus:ring-2 focus:ring-[#a35c2d]/20"
          />
          <button type="submit" disabled={busy} className={`${homeButton} disabled:opacity-60`}>
            {busy ? "Linking…" : "Link my account"}
          </button>
        </div>
        <p id="amb-claim-msg" role="alert" className="mt-3 min-h-[1.5rem] text-[15px] font-medium text-[#9a3412]">
          {error}
        </p>
      </form>
      <div className="mt-4 border-t border-[#efe5d6] pt-5">
        <p className={homeBody}>
          No code yet?{" "}
          <Link href="/affiliate-program/" className={homeTextLink}>
            Apply to become an ambassador
          </Link>
        </p>
      </div>
    </section>
  );
}

export function PendingCard({ code }: { code?: string }) {
  return (
    <section className={`${homeCard} mx-auto max-w-2xl p-6 md:p-10`}>
      <h2 className={h2}>Thank you, we&apos;re confirming your account</h2>
      <p className={`mt-3 ${homeBody} md:text-[17px] md:leading-8`}>
        {code ? (
          <>
            You entered the code <span className="font-semibold text-[#24170f]">{code}</span>.{" "}
          </>
        ) : null}
        Our team checks every new link by hand, usually within a working day. Your dashboard will open on this page
        as soon as it&apos;s confirmed.
      </p>
      <p className={`mt-4 ${homeBody}`}>
        Questions?{" "}
        <Link href="/contact/" className={homeTextLink}>
          Contact us
        </Link>
      </p>
    </section>
  );
}

function MessageCard({ title, text }: { title: string; text: string }) {
  return (
    <section className={`${homeCard} mx-auto max-w-2xl p-6 md:p-10`}>
      <h2 className={h2}>{title}</h2>
      <p className={`mt-3 ${homeBody}`}>{text}</p>
    </section>
  );
}

function SignedInArea() {
  const { user } = useUser();
  const userId = user?.id;
  const cacheKey = userId ? `amb_${userId}` : "";
  const [me, setMe] = useState<AmbassadorMe | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "offline" | "error">("loading");

  const load = useCallback(async () => {
    if (!cacheKey) return;
    try {
      const res = await authFetch(`/api/ambassador/me/?ts=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as AmbassadorMe;
      setMe(data);
      setStatus("ready");
      try {
        // Keep only what the offline view needs (code, link, numbers).
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch {
        /* private mode */
      }
    } catch {
      let cached: AmbassadorMe | null = null;
      try {
        const raw = localStorage.getItem(cacheKey);
        cached = raw ? (JSON.parse(raw) as AmbassadorMe) : null;
      } catch {
        cached = null;
      }
      if (cached) setMe(cached);
      setStatus(typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "error");
    }
  }, [cacheKey]);

  useEffect(() => {
    load();
    const back = () => load();
    window.addEventListener("online", back);
    return () => window.removeEventListener("online", back);
  }, [load]);

  if (status === "loading") {
    return (
      <section className={`${homeCard} mx-auto max-w-2xl p-6 md:p-10`} aria-busy="true">
        <p className={homeBody}>Loading your ambassador details…</p>
      </section>
    );
  }

  if (!me) {
    return status === "offline" ? (
      <MessageCard title="You're offline" text="Your ambassador details will appear here when you're back online." />
    ) : (
      <MessageCard
        title="We couldn't load your details"
        text="Please refresh the page in a moment. If it keeps happening, contact us and we'll help."
      />
    );
  }

  if (me.state === "none") return <ClaimCard onClaimed={(m) => { setMe(m); setStatus("ready"); }} />;
  if (me.state === "pending") return <PendingCard code={me.code} />;
  return <AmbassadorDashboard me={me} firstName={user?.firstName} offline={status !== "ready"} />;
}

export default function AmbassadorArea() {
  return (
    <>
      <SignedIn>
        <SignedInArea />
      </SignedIn>
      <SignedOut>
        <SignInCard />
      </SignedOut>
    </>
  );
}
