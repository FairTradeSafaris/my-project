"use client";
// Ambassador application form (batch 12) -> /api/ambassador-signup
import { useEffect, useRef, useState } from "react";
import { getReferral } from "@/lib/referral";

type Status = "idle" | "sending" | "success" | "error";

const inputCls =
  "w-full rounded-xl border border-[#dccbb8] bg-white px-4 py-3 text-[15px] text-[#24170f] placeholder:text-[#8f7766] transition focus:border-[#5d4037] focus:outline-none focus:ring-4 focus:ring-[#5d4037]/15";
const labelCls = "mb-1.5 block text-sm font-medium text-[#3c2a1e]";
const opt = <span className="font-normal text-[#7a5b47]">(optional)</span>;

const AUDIENCE = [
  "Friends & family",
  "Under 1,000 followers",
  "1,000 – 10,000",
  "10,000 – 50,000",
  "50,000 – 250,000",
  "250,000+",
  "A group or community I lead",
];

export default function AmbassadorSignupForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [firstName, setFirstName] = useState("");
  const startedAt = useRef(Date.now());
  const refCode = useRef("");
  useEffect(() => {
    refCode.current = getReferral();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const f = new FormData(form);
    const data = {
      firstName: String(f.get("firstName") ?? ""),
      lastName: String(f.get("lastName") ?? ""),
      email: String(f.get("email") ?? ""),
      phone: String(f.get("phone") ?? ""),
      country: String(f.get("country") ?? ""),
      social: String(f.get("social") ?? ""),
      audience: String(f.get("audience") ?? ""),
      why: String(f.get("why") ?? ""),
      agreed: f.get("agreed") === "on",
      referralCode: refCode.current,
      website: String(f.get("website") ?? ""), // honeypot
      elapsedMs: Date.now() - startedAt.current,
    };
    setFirstName(data.firstName);
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/ambassador-signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json?.ok !== false) {
        form.reset();
        setStatus("success");
      } else {
        setErrorMsg(typeof json?.error === "string" ? json.error : "");
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" aria-live="polite" className="flex min-h-[420px] flex-col items-start justify-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[#5d4037] text-2xl text-[#fbf6ef]" aria-hidden>
          ✓
        </span>
        <h3 className="mt-6 text-2xl font-bold text-[#24170f]">
          Thank you{firstName ? `, ${firstName}` : ""}.
        </h3>
        <p className="mt-3 max-w-md leading-relaxed text-[#5d4037]">
          Your application is with our team. We read every one personally and will be in touch within a few working days
          with your personal code and link.
        </p>
      </div>
    );
  }

  const sending = status === "sending";
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="amb-website">Website</label>
        <input id="amb-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="amb-first" className={labelCls}>First name</label>
          <input id="amb-first" name="firstName" required maxLength={100} autoComplete="given-name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="amb-last" className={labelCls}>Last name</label>
          <input id="amb-last" name="lastName" required maxLength={100} autoComplete="family-name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="amb-email" className={labelCls}>Email</label>
          <input id="amb-email" name="email" type="email" required maxLength={200} autoComplete="email" className={inputCls} />
        </div>
        <div>
          <label htmlFor="amb-phone" className={labelCls}>Phone / WhatsApp {opt}</label>
          <input id="amb-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={inputCls} />
        </div>
        <div>
          <label htmlFor="amb-country" className={labelCls}>Country</label>
          <input id="amb-country" name="country" required maxLength={80} autoComplete="country-name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="amb-audience" className={labelCls}>Audience size {opt}</label>
          <div className="relative">
            <select id="amb-audience" name="audience" defaultValue="" className={`${inputCls} appearance-none pr-10`}>
              <option value="">Choose one</option>
              {AUDIENCE.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <svg aria-hidden viewBox="0 0 12 8" className="pointer-events-none absolute right-4 top-1/2 h-2 w-3 -translate-y-1/2 text-[#5d4037]">
              <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" fill="none" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="amb-social" className={labelCls}>Instagram, blog or website {opt}</label>
        <input id="amb-social" name="social" maxLength={300} placeholder="https:// or @handle" className={inputCls} />
      </div>
      <div>
        <label htmlFor="amb-why" className={labelCls}>Why would you like to be an ambassador? {opt}</label>
        <textarea
          id="amb-why"
          name="why"
          rows={4}
          maxLength={2000}
          placeholder="Your safari story, who you'd share with, anything we should know"
          className={inputCls}
        />
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-[#3c2a1e]">
        <input type="checkbox" name="agreed" required className="mt-1 h-4 w-4 shrink-0 accent-[#5d4037]" />
        <span>
          I&rsquo;ve read and agree to the{" "}
          <a
            href="#terms"
            onClick={() => {
              const d = document.getElementById("terms");
              if (d instanceof HTMLDetailsElement) d.open = true;
            }}
            className="font-semibold text-[#5d4037] underline decoration-[#d9b48a] decoration-2 underline-offset-4 hover:text-[#24170f]">
            programme terms
          </a>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={sending}
        aria-busy={sending}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5d4037] px-6 py-4 text-[15px] font-semibold text-[#fbf6ef] transition hover:bg-[#3c2a1e] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5d4037]/30 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {sending ? "Sending…" : "Send my application"}
        {!sending && <span aria-hidden className="transition group-hover:translate-x-1">&rarr;</span>}
      </button>

      <div aria-live="polite" role="status">
        {status === "error" && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {errorMsg || "Sorry, your application couldn't be sent."} Please try again, or email info@fairtradesafaris.com.
          </p>
        )}
      </div>
    </form>
  );
}
