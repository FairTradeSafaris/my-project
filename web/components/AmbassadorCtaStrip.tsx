// components/AmbassadorCtaStrip.tsx (batch 12)
// "Become an Ambassador" strip for /ambassadors. Text and image come from
// Sanity > Ambassador Settings, with fallbacks. Hidden if the programme is off.
import Image from "next/image";
import Link from "next/link";
import LineArt from "@/components/LineArt";
import { getAmbassadorSettings, makeFill } from "@/lib/ambassadorSettings";

export default async function AmbassadorCtaStrip() {
  const s = await getAmbassadorSettings();
  if (!s.enabled) return null;
  const fill = makeFill(s);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24" aria-labelledby="amb-cta-title">
      <div className="group relative isolate overflow-hidden rounded-[32px] bg-[#24170f] text-[#fbf6ef] shadow-[0_40px_100px_-50px_rgba(36,23,15,0.8)]">
        <div className="absolute inset-y-0 right-0 -z-10 w-full md:w-[55%]">
          <Image
            src={s.stripImageUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-[#24170f]/70 md:bg-gradient-to-r md:from-[#24170f] md:via-[#24170f]/60 md:to-[#24170f]/10" />
        </div>

        <div className="grid gap-10 p-8 sm:p-12 md:grid-cols-12 md:items-center lg:p-16">
          <div className="md:col-span-7">
            <LineArt name="rhino" className="mb-6 w-44 text-[#e2c39c]/85" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e2c39c]">Ambassador Programme</p>
            <h2 id="amb-cta-title" className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              {fill(s.stripTitle)}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#e9dccb] sm:text-lg">{fill(s.stripText)}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="/affiliate-program/"
                className="inline-flex items-center gap-2 rounded-full bg-[#fbf6ef] px-7 py-3.5 text-sm font-semibold text-[#24170f] transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e2c39c]/60"
              >
                {fill(s.stripButtonLabel)}
                <span aria-hidden className="transition group-hover:translate-x-1">&rarr;</span>
              </Link>
              <Link href="/affiliate-program/#earnings" className="text-sm font-semibold text-[#fbf6ef] underline decoration-[#d9b48a] decoration-2 underline-offset-[6px] hover:text-white">
                See what you could earn
              </Link>
            </div>
          </div>

          <dl className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-[#1a100a]/50 md:col-span-5`}>
            {[
              { k: "3%", v: "commission" },
              { k: `${s.cookieDays}`, v: "day link" },
            ].map((f) => (
              <div key={f.v} className="bg-[#24170f]/40 px-4 py-5 text-center">
                <dt className="text-2xl font-bold text-white sm:text-3xl">{f.k}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#e9dccb]">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
