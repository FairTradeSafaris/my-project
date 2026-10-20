"use client";
// components/ambassador/ReferralsCard.tsx (batch 26)
// "Your referrals": link clicks this month / in total, and (once Zoho's
// Referral_Code field is switched on) the friends who enquired with the
// ambassador's code: first name, date and stage only. Loaded from /api after
// the page opens and never stored, so nothing private sits in the offline cache.
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import type { AmbassadorReferrals } from "@/lib/ambassadorTypes";
import { homeBody, homeCard, homeH3 } from "@/components/home/homeStyles";

const fmtDate = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
const fmtMonth = (m: string) => {
  const d = new Date(`${m}-15T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? m : d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
};

function Figure({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-[#ebe1d3] bg-[#fbf8f3] px-5 py-4">
      <p className="text-[32px] font-semibold leading-none text-[#24170f]">{value.toLocaleString("en-US")}</p>
      <p className="mt-2 text-[15px] text-[#5c4a3d]">{label}</p>
    </div>
  );
}

export default function ReferralsCard({ offline = false }: { offline?: boolean }) {
  const [data, setData] = useState<AmbassadorReferrals | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (offline) return;
    let alive = true;
    authFetch(`/api/ambassador/referrals/?ts=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: AmbassadorReferrals) => {
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
    <section className={`${homeCard} p-6 md:p-8`} aria-labelledby="amb-referrals">
      <h3 id="amb-referrals" className={homeH3}>
        Your referrals
      </h3>

      {offline ? (
        <p className={`mt-3 ${homeBody}`}>You&apos;re offline. Your figures will appear when you reconnect.</p>
      ) : status === "loading" ? (
        <p className={`mt-3 ${homeBody}`}>Loading your figures…</p>
      ) : status === "error" || !data ? (
        <p className={`mt-3 ${homeBody}`}>Your figures couldn&apos;t be loaded just now. Please try again later.</p>
      ) : (
        <>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Figure value={data.clicksThisMonth} label="Visits through your link this month" />
            <Figure value={data.clicksTotal} label="Visits through your link so far" />
          </div>
          {data.months.length > 1 && (
            <p className={`mt-4 ${homeBody}`}>
              {data.months
                .slice(1, 4)
                .map((m) => `${fmtMonth(m.month)}: ${m.count}`)
                .join(" · ")}
            </p>
          )}
          <p className="mt-3 text-[15px] leading-6 text-[#5c4a3d]">
            Each person is counted once a day. We only count visits, never who visited.
          </p>

          <div className="my-7 border-t border-[#efe5d6]" />

          <h4 className="text-[17px] font-semibold text-[#24170f]">Friends who have been in touch</h4>
          {data.referrals === null ? (
            <p className={`mt-2 ${homeBody}`}>
              The list of friends who enquire with your code will appear here soon. Our team already records every
              referral, so nothing is missed in the meantime.
            </p>
          ) : data.referrals.length === 0 ? (
            <p className={`mt-2 ${homeBody}`}>
              No enquiries with your code yet. When a friend gets in touch, their first name will appear here.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-left text-[16px]">
                <thead>
                  <tr className="border-b border-[#ebe1d3] text-[15px] text-[#5c4a3d]">
                    <th scope="col" className="py-3 pr-4 font-semibold">Friend</th>
                    <th scope="col" className="py-3 pr-4 font-semibold">Date</th>
                    <th scope="col" className="py-3 font-semibold">Where things stand</th>
                  </tr>
                </thead>
                <tbody>
                  {data.referrals.map((r, i) => (
                    <tr key={`${r.date}-${i}`} className="border-b border-[#f2ebe0] text-[#24170f]">
                      <td className="py-3 pr-4">{r.firstName}</td>
                      <td className="py-3 pr-4">{fmtDate(r.date)}</td>
                      <td className="py-3">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
