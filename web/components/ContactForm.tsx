"use client";

import { useRef, useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

const inputCls =
  "w-full rounded-md border border-[#cdbfb0] bg-white px-3 py-2.5 text-[#3c2f2f] placeholder:text-gray-500 focus:border-[#5c4033] focus:outline-none focus:ring-2 focus:ring-[#5c4033]/30";
const labelCls = "mb-1 block text-sm font-medium text-[#3c2f2f]";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const startedAt = useRef(Date.now());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const f = new FormData(form);

    const data = {
      firstName: String(f.get("firstName") ?? ""),
      lastName: String(f.get("lastName") ?? ""),
      email: String(f.get("email") ?? ""),
      phone: String(f.get("phone") ?? ""),
      travelMonth: String(f.get("travelMonth") ?? ""),
      message: String(f.get("message") ?? ""),
      appointment: f.get("appointment") === "on",
      marketingConsent: f.get("promos") === "on",
      website: String(f.get("website") ?? ""),
      elapsedMs: Date.now() - startedAt.current,
    };

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
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
      <div role="status" aria-live="polite" className="rounded-lg border border-[#cdbfb0] bg-[#f2e7db] p-6 text-[#3c2f2f]">
        <p className="text-lg font-semibold">Thank you, your message is on its way.</p>
        <p className="mt-2 text-sm text-[#6b4f3f]">
          One of our safari specialists will get back to you within one business day.
        </p>
        <button
          type="button"
          onClick={() => { startedAt.current = Date.now(); setStatus("idle"); }}
          className="mt-4 text-sm font-semibold text-[#5c4033] underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate={false}>
      {/* Hidden from people; bots fill it in */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-first" className={labelCls}>First name</label>
          <input id="cf-first" name="firstName" type="text" autoComplete="given-name" className={inputCls} required maxLength={100} />
        </div>
        <div>
          <label htmlFor="cf-last" className={labelCls}>Last name</label>
          <input id="cf-last" name="lastName" type="text" autoComplete="family-name" className={inputCls} required maxLength={100} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-email" className={labelCls}>Email</label>
          <input id="cf-email" name="email" type="email" autoComplete="email" className={inputCls} required maxLength={200} />
        </div>
        <div>
          <label htmlFor="cf-phone" className={labelCls}>Phone / WhatsApp</label>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" className={inputCls} required maxLength={40} />
        </div>
      </div>
      <div>
        <label htmlFor="cf-month" className={labelCls}>
          When would you like to travel? <span className="font-normal text-[#6b4f3f]">(optional)</span>
        </label>
        <input id="cf-month" name="travelMonth" type="text" placeholder="e.g. August 2027" className={inputCls} maxLength={60} />
      </div>
      <div>
        <label htmlFor="cf-message" className={labelCls}>
          Tell us about your trip <span className="font-normal text-[#6b4f3f]">(optional)</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="Who's travelling, places you dream of, anything we should know"
          className={inputCls}
        />
      </div>
      <div className="flex items-start gap-3">
        <input type="checkbox" name="appointment" id="appointment" className="mt-1 h-4 w-4 accent-[#5c4033]" />
        <label htmlFor="appointment" className="text-sm text-[#3c2f2f]">
          I would like to set up an appointment with a representative
        </label>
      </div>
      <div className="flex items-start gap-3">
        <input type="checkbox" name="promos" id="promos" className="mt-1 h-4 w-4 accent-[#5c4033]" />
        <label htmlFor="promos" className="text-sm text-[#3c2f2f]">
          <strong>News, Promotions and Marketing:</strong> I consent to receiving SMS or electronic marketing messages from Fair Trade Safaris.
        </label>
      </div>
      <button
        type="submit"
        disabled={sending}
        aria-busy={sending}
        className="mt-2 w-full rounded-md bg-[#5c4033] px-4 py-3 font-semibold text-white transition hover:bg-[#3f2d24] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {sending ? "Sending…" : "Send message"}
      </button>
      <div aria-live="polite" role="status">
        {status === "error" && (
          <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {errorMsg || "Sorry, your message couldn't be sent."} Please try again, or reach us on WhatsApp or at info@fairtradesafaris.com.
          </p>
        )}
      </div>
    </form>
  );
}
