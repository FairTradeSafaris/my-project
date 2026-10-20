"use client";
// components/ambassador/EarningsCard.tsx (batch 28)
// "Your earnings" (figures from Zoho Deals): Pending / Ready to pay / Paid totals, progress to the
// minimum payout, an optional reward goal, the bookings list and the current
// rules in plain words, and a "Request payout" button. Loaded from /api after the page opens and never
// stored, so nothing private sits in the offline cache.
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import type { AmbassadorEarnings, EarningStatus } from "@/lib/ambassadorTypes";
import { homeBody, homeButton, homeCard, homeH3 } from "@/components/home/homeStyles";

const usd = (n: number) =>
  `US$${(Number.isFinite(n) ? n : 0).toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
const fmtDate = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
const STATUS: Record<EarningStatus, string> = {
  pending: "Booked, not earned yet",
  earned: "Earned, ready to pay",
  paid: "Paid to you",
};

function Figure({ value, label, note }: { value: number; label: string; note: string }) {
  return (
    <div className="rounded-xl border border-[#ebe1d3] bg-[#fbf8f3] px-5 py-4">
      <p className="text-[15px] font-semibold text-[#24170f]">{label}</p>
      <p className="mt-2 text-[30px] font-semibold leading-none text-[#24170f]">{usd(value)}</p>
      <p className="mt-2 text-[15px] leading-6 text-[#5c4a3d]">{note}</p>
    </div>
  );
}

function Progress({ label, value, max, text }: { label: string; value: number; max: number; text: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="mt-6">
      <p className="text-[16px] font-semibold text-[#24170f]">{label}</p>
      <div
        className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#efe5d6]"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div className="h-full rounded-full bg-[#a35c2d]" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-[15px] leading-6 text-[#5c4a3d]">{text}</p>
    </div>
  );
}

export default function EarningsCard({ offline = false }: { offline?: boolean }) {
  const [data, setData] = useState<AmbassadorEarnings | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [req, setReq] = useState<"" | "sending" | "sent" | "fail">("");
  const [reqMsg, setReqMsg] = useState("");

  const requestPayout = async () => {
    setReq("sending");
    setReqMsg("");
    try {
      const r = await authFetch(`/api/ambassador/payout-request/?ts=${Date.now()}`, { method: "POST", cache: "no-store" });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (r.ok && j.ok) {
        setReq("sent");
      } else {
        setReq("fail");
        setReqMsg(j.error || "Sorry, your request couldn't be sent. Please try again later.");
      }
    } catch {
      setReq("fail");
      setReqMsg("Sorry, your request couldn't be sent. Please check your connection and try again.");
    }
  };

  useEffect(() => {
    if (offline) return;
    let alive = true;
    authFetch(`/api/ambassador/earnings/?ts=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: AmbassadorEarnings) => {
        if (!alive) return;
        setData(d);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [offline]);

  return (
    <section className={`${homeCard} p-6 md:p-8`} aria-labelledby="amb-earnings">
      <h3 id="amb-earnings" className={homeH3}>
        Your earnings
      </h3>

      {offline ? (
        <p className={`mt-3 ${homeBody}`}>You&apos;re offline. Your earnings will appear when you reconnect.</p>
      ) : status === "loading" ? (
        <p className={`mt-3 ${homeBody}`}>Loading your earnings…</p>
      ) : status === "error" || !data ? (
        <p className={`mt-3 ${homeBody}`}>Your earnings can&apos;t be loaded right now. Please try again later.</p>
      ) : !data.enabled ? (
        <>
          <p className={`mt-3 ${homeBody}`}>
            Your earnings will appear here soon: what&apos;s pending, what&apos;s ready to pay and what has been paid.
          </p>
          <div className="mt-6 rounded-xl bg-[#f7f3ec] px-5 py-4">
            <p className="text-[16px] font-semibold text-[#24170f]">How your earnings work</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-7 text-[#5c4a3d]">
              {data.rules.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <Figure value={data.totals.pending} label="Pending" note="Friends have booked. Not earned yet." />
            <Figure value={data.totals.earned} label="Ready to pay" note="Earned and waiting for the next payment." />
            <Figure value={data.totals.paid} label="Paid" note="Already paid to you. Thank you!" />
          </div>

          <Progress
            label="Towards your next payment"
            value={data.totals.earned}
            max={data.minPayout}
            text={
              data.totals.earned >= data.minPayout
                ? `You have ${usd(data.totals.earned)} ready. It will be included in the next payment.`
                : `${usd(data.totals.earned)} of ${usd(data.minPayout)}. We pay once at least ${usd(data.minPayout)} is ready.`
            }
          />

          <div className="mt-5">
            {req === "sent" || data.payoutRequested ? (
              <p className="rounded-xl border border-[#ebe1d3] bg-[#fbf8f3] px-5 py-3 text-[16px] text-[#24170f]" aria-live="polite">
                Request sent, we&apos;ll be in touch.
              </p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={requestPayout}
                  disabled={data.totals.earned < data.minPayout || req === "sending"}
                  className={`${homeButton} disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {req === "sending" ? "Sending…" : "Request payout"}
                </button>
                <p className="mt-2 text-[15px] leading-6 text-[#5c4a3d]" aria-live="polite">
                  {req === "fail"
                    ? reqMsg
                    : data.totals.earned < data.minPayout
                      ? `You can request a payout once ${usd(data.minPayout)} is ready.`
                      : "We'll check the figures and pay you by your chosen method."}
                </p>
              </>
            )}
          </div>

          {data.reward && (
            <Progress
              label={`Reward goal: ${data.reward.label}`}
              value={data.reward.progress}
              max={data.reward.target}
              text={
                data.reward.type === "value"
                  ? `${usd(data.reward.progress)} of ${usd(data.reward.target)} in paid bookings.`
                  : `${data.reward.progress} of ${data.reward.target} paid bookings.`
              }
            />
          )}

          <div className="my-7 border-t border-[#efe5d6]" />

          <h4 className="text-[17px] font-semibold text-[#24170f]">Bookings</h4>
          {data.bookings.length === 0 ? (
            <p className={`mt-2 ${homeBody}`}>
              No bookings yet. When a friend books a safari, it will appear here with what you earn.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-left text-[16px]">
                <thead>
                  <tr className="border-b border-[#ebe1d3] text-[15px] text-[#5c4a3d]">
                    <th scope="col" className="py-3 pr-4 font-semibold">Friend</th>
                    <th scope="col" className="py-3 pr-4 font-semibold">Booked</th>
                    <th scope="col" className="py-3 pr-4 font-semibold">Status</th>
                    <th scope="col" className="py-3 text-right font-semibold">You earn</th>
                  </tr>
                </thead>
                <tbody>
                  {data.bookings.map((b, i) => (
                    <tr key={`${b.date}-${i}`} className="border-b border-[#f2ebe0] text-[#24170f]">
                      <td className="py-3 pr-4">{b.firstName}</td>
                      <td className="py-3 pr-4">{fmtDate(b.date)}</td>
                      <td className="py-3 pr-4">{STATUS[b.status]}</td>
                      <td className="py-3 text-right">{usd(b.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-7 rounded-xl bg-[#f7f3ec] px-5 py-4">
            <p className="text-[16px] font-semibold text-[#24170f]">How your earnings work</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-7 text-[#5c4a3d]">
              {data.rules.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}
