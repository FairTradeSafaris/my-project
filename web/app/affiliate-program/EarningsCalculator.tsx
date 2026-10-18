"use client";
// Interactive earnings calculator (batch 12). Rates come from Sanity via props.
import { useEffect, useId, useRef, useState } from "react";
import styles from "./affiliate.module.css";

const fmt = (n: number) =>
  "US$" + (Number.isFinite(n) ? Math.round(n) : 0).toLocaleString("en-US");

/** Smoothly counts to the new figure (skipped for reduced motion). */
function useTween(target: number, ms = 450) {
  const [val, setVal] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVal(target);
      from.current = target;
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      const v = a + (target - a) * e;
      setVal(v);
      from.current = v;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return val;
}

const PRESETS = [6000, 10000, 15000, 25000];

export default function EarningsCalculator({
  commissionPercent,
  friendDiscount,
  minTripValue,
  groupMinGuests,
  excludedText,
}: {
  commissionPercent: number;
  friendDiscount: number;
  minTripValue: number;
  groupMinGuests: number;
  excludedText: string;
}) {
  const pct = Number.isFinite(commissionPercent) ? commissionPercent : 5;
  const [trip, setTrip] = useState(10000);
  const [count, setCount] = useState(3);
  const tripId = useId();
  const countId = useId();

  const perBooking = (trip * pct) / 100;
  const yearly = perBooking * count;
  const shownYearly = useTween(yearly);
  const friendGets = trip >= minTripValue ? friendDiscount : 0;

  const TRIP_MIN = 3000;
  const TRIP_MAX = 40000;
  const tripFill = ((trip - TRIP_MIN) / (TRIP_MAX - TRIP_MIN)) * 100;
  const countFill = ((count - 1) / (12 - 1)) * 100;
  const track = (p: number) => ({
    background: `linear-gradient(to right, #d9b48a 0%, #d9b48a ${p}%, rgba(245,235,221,0.18) ${p}%, rgba(245,235,221,0.18) 100%)`,
  });

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Controls */}
      <div className="lg:col-span-7">
        <div className="space-y-10">
          <div>
            <div className="flex items-end justify-between gap-4">
              <label htmlFor={tripId} className="text-sm font-medium text-[#e9dccb]">
                Typical safari package
              </label>
              <span className="text-2xl font-bold tabular-nums text-[#fbf6ef]">{fmt(trip)}</span>
            </div>
            <input
              id={tripId}
              type="range"
              min={TRIP_MIN}
              max={TRIP_MAX}
              step={500}
              value={trip}
              onChange={(e) => setTrip(Number(e.target.value))}
              aria-valuetext={fmt(trip)}
              className={`${styles.range} mt-4`}
              style={track(tripFill)}
            />
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Quick trip values">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTrip(p)}
                  aria-pressed={trip === p}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium tabular-nums transition ${
                    trip === p
                      ? "border-[#d9b48a] bg-[#d9b48a] text-[#24170f]"
                      : "border-[#f5ebdd]/25 text-[#e9dccb] hover:border-[#d9b48a] hover:text-[#fbf6ef]"
                  }`}
                >
                  {fmt(p)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-4">
              <label htmlFor={countId} className="text-sm font-medium text-[#e9dccb]">
                Friends who book in a year
              </label>
              <span className="text-2xl font-bold tabular-nums text-[#fbf6ef]">{count}</span>
            </div>
            <input
              id={countId}
              type="range"
              min={1}
              max={12}
              step={1}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              aria-valuetext={`${count} booking${count === 1 ? "" : "s"}`}
              className={`${styles.range} mt-4`}
              style={track(countFill)}
            />
          </div>

          <p className="text-xs leading-relaxed text-[#cdbba6]">
            Illustration only. Commission is {pct}% of the safari package and doesn&rsquo;t include {excludedText}.
          </p>
        </div>
      </div>

      {/* Result */}
      <div className="lg:col-span-5">
        <div className="relative overflow-hidden rounded-[28px] border border-[#f5ebdd]/15 bg-[#fbf6ef] p-7 text-[#24170f] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] sm:p-9">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#ead9c3]" />
          <p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a5a33]">You could earn</p>
          <p className="relative mt-3 text-5xl font-extrabold leading-none tracking-tight tabular-nums sm:text-6xl" aria-hidden>
            {fmt(shownYearly)}
          </p>
          <p className="sr-only" aria-live="polite">
            You could earn {fmt(yearly)} a year.
          </p>
          <p className="relative mt-2 text-sm text-[#5d4037]">a year, from {count} booking{count === 1 ? "" : "s"}</p>

          <dl className="relative mt-8 divide-y divide-[#e6d8c8] border-y border-[#e6d8c8] text-sm">
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#5d4037]">Per booking ({pct}%)</dt>
              <dd className="font-semibold tabular-nums">{fmt(perBooking)}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#5d4037]">Each friend saves</dt>
              <dd className="font-semibold tabular-nums">
                {friendGets > 0 ? fmt(friendGets) : <span className="font-normal text-[#7a5b47]">On trips from {fmt(minTripValue)}</span>}
              </dd>
            </div>
          </dl>

          <p className="relative mt-6 rounded-2xl bg-[#f2e7db] px-4 py-3 text-sm leading-relaxed text-[#3c2a1e]">
            <span className="font-semibold">Hosting a group?</span> Bring {groupMinGuests}+ paying guests and your own place is covered instead.
          </p>

          <a
            href="#apply"
            className="relative mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5d4037] px-6 py-3.5 text-sm font-semibold text-[#fbf6ef] transition hover:bg-[#3c2a1e] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5d4037]/30"
          >
            Apply to join
            <span aria-hidden>&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
