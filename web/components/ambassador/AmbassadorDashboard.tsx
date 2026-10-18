"use client";
// components/ambassador/AmbassadorDashboard.tsx (batch 24)
// What an approved ambassador sees: their code, personal link, QR code and
// ready-to-send messages, plus a short reminder of how the programme works.
// Display only; the data comes from /api/ambassador/me/.
import { useState } from "react";
import Link from "next/link";
import type { AmbassadorMe } from "@/lib/ambassadorTypes";
import QrCode from "./QrCode";
import { FTS_VIDEO } from "@/components/video/ftsVideo"; // batch 25
import {
  homeBody,
  homeButton,
  homeButtonOutline,
  homeCard,
  homeEyebrow,
  homeH3,
  homeTextLink,
} from "@/components/home/homeStyles";

const money = (n: number) => (Number.isFinite(n) ? Math.round(n).toLocaleString("en-US") : "0");

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const t = document.createElement("textarea");
      t.value = text;
      t.setAttribute("readonly", "");
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      const ok = document.execCommand("copy");
      t.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function CopyButton({ text, label, primary = false }: { text: string; label: string; primary?: boolean }) {
  const [done, setDone] = useState<"" | "ok" | "fail">("");
  return (
    <button
      type="button"
      className={primary ? homeButton : homeButtonOutline}
      onClick={async () => {
        setDone((await copyText(text)) ? "ok" : "fail");
        window.setTimeout(() => setDone(""), 2500);
      }}
    >
      <span aria-live="polite">{done === "ok" ? "Copied ✓" : done === "fail" ? "Please copy by hand" : label}</span>
    </button>
  );
}

export default function AmbassadorDashboard({
  me,
  firstName,
  offline = false,
}: {
  me: AmbassadorMe;
  firstName?: string | null;
  offline?: boolean;
}) {
  const p = me.programme;
  const code = me.code || "";
  const link = me.link || "";
  const discount = `US$${money(p.friendDiscount)}`;
  const minTrip = `US$${money(p.minTripValue)}`;
  const [message, setMessage] = useState(
    `I'd like to recommend Fair Trade Safaris for a custom, ethical African safari. They look after every detail, and each trip supports local guides and communities. Use my link and you'll get ${discount} off your first safari of ${minTrip} or more: ${link}\n\nOr enter my code ${code} on their contact form (or mention it when you call or WhatsApp them): https://www.fairtradesafaris.com/contact/?ref=${encodeURIComponent(code)}`,
  );
  const paused = me.state === "paused";
  const videoMessage = `Here's a short film about Fair Trade Safaris (${FTS_VIDEO.durationLabel}): ${FTS_VIDEO.shortUrl}\n\nIf you'd like to plan a trip, use my link for ${discount} off your first safari of ${minTrip} or more: ${link}\nor enter my code ${code} on their contact form.`;

  return (
    <div className="space-y-8">
      {offline && (
        <p className="rounded-xl border border-[#ebe1d3] bg-[#fbf8f3] px-5 py-3 text-[15px] text-[#5c4a3d]">
          You&apos;re offline. Showing your saved ambassador details.
        </p>
      )}

      {/* Welcome */}
      <section className={`${homeCard} p-6 md:p-8`}>
        <p className={homeEyebrow}>Ambassador Programme</p>
        <h2 className="mt-2 text-[26px] font-semibold leading-tight text-[#24170f] md:text-[30px]">
          Welcome{firstName ? `, ${firstName}` : ""}
        </h2>
        {paused ? (
          <p className={`mt-3 max-w-3xl ${homeBody}`}>
            Your ambassador account is paused at the moment, so new referrals are not being linked to your code. If
            you think this is a mistake, please{" "}
            <Link href="/contact/" className="font-medium text-[#9a4f22] underline decoration-[#c9974f] underline-offset-4">
              contact us
            </Link>
            .
          </p>
        ) : (
          <p className={`mt-3 max-w-3xl ${homeBody} md:text-[17px] md:leading-8`}>
            Thank you for sharing the Africa you love. Everything you need is on this page: your personal code, your
            link, a QR code and a message you can send to friends.
          </p>
        )}
      </section>

      {!paused && (
        <>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            {/* Code + link */}
            <section className={`${homeCard} p-6 md:p-8`} aria-labelledby="amb-code">
              <h3 id="amb-code" className={homeH3}>
                Your referral code
              </h3>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <p className="rounded-xl border border-[#ebe1d3] bg-[#fbf8f3] px-5 py-3 text-[30px] font-semibold tracking-[0.08em] text-[#24170f] md:text-[34px]">
                  {code}
                </p>
                <CopyButton text={code} label="Copy code" />
              </div>
              <p className={`mt-3 ${homeBody}`}>
                Friends can use your code instead of your link: they enter it in the &ldquo;Ambassador referral code&rdquo; box on our{" "}
                <Link href="/contact/" className="font-medium text-[#9a4f22] underline decoration-[#c9974f] underline-offset-4">
                  contact form
                </Link>
                , or mention it when they call, email or WhatsApp us.
              </p>

              <div className="my-7 border-t border-[#efe5d6]" />

              <h3 className={homeH3}>Your personal link</h3>
              <label htmlFor="amb-link" className="sr-only">
                Your personal link
              </label>
              <input
                id="amb-link"
                readOnly
                value={link}
                onFocus={(e) => e.currentTarget.select()}
                className="mt-4 h-12 w-full rounded-xl border border-[#d9cbb8] bg-white px-4 text-[16px] text-[#24170f] focus:border-[#a35c2d] focus:outline-none focus:ring-2 focus:ring-[#a35c2d]/20"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <CopyButton text={link} label="Copy link" primary />
                <a href={link} target="_blank" rel="noopener noreferrer" className={homeButtonOutline}>
                  Open link
                </a>
              </div>
              <p className={`mt-4 ${homeBody}`}>
                Anyone who clicks your link and enquires within {p.cookieDays} days is linked to you. Your link works
                on any page: just add <span className="font-semibold text-[#24170f]">?ref={code}</span> to the end of
                an address on our website.
              </p>
            </section>

            {/* QR */}
            <section className={`${homeCard} p-6 md:p-8`} aria-labelledby="amb-qr">
              <h3 id="amb-qr" className={homeH3}>
                Your QR code
              </h3>
              <p className={`mt-2 ${homeBody}`}>
                Print it on a card or add it to a talk or slide. Scanning it opens your personal link.
              </p>
              <div className="mt-6">{link && <QrCode value={link} fileName={`fair-trade-safaris-${code}.png`} />}</div>
            </section>
          </div>

          {/* Share */}
          <section className={`${homeCard} p-6 md:p-8`} aria-labelledby="amb-share">
            <h3 id="amb-share" className={homeH3}>
              Share with friends
            </h3>
            <p className={`mt-2 ${homeBody}`}>Here is a message you can send. Change the words to make them your own.</p>
            <label htmlFor="amb-message" className="sr-only">
              Message to share
            </label>
            <textarea
              id="amb-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="mt-4 w-full rounded-xl border border-[#d9cbb8] bg-white px-4 py-3 text-[16px] leading-7 text-[#24170f] focus:border-[#a35c2d] focus:outline-none focus:ring-2 focus:ring-[#a35c2d]/20"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={homeButtonOutline}
              >
                Share on WhatsApp
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent("A safari company I'd recommend")}&body=${encodeURIComponent(message)}`}
                className={homeButtonOutline}
              >
                Share by email
              </a>
              <CopyButton text={message} label="Copy message" />
            </div>

            {/* batch 25: share kit, our short film */}
            <div className="mt-8 border-t border-[#efe5d6] pt-7">
              <div className="grid items-center gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
                <a href={FTS_VIDEO.watchUrl} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-[#ebe1d3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={FTS_VIDEO.thumbnailHq} alt={FTS_VIDEO.alt} width={480} height={360} loading="lazy" className="aspect-video w-full object-cover" />
                </a>
                <div>
                  <p className="text-[17px] font-semibold text-[#24170f]">Share our short film</p>
                  <p className={`mt-1 ${homeBody}`}>
                    &ldquo;{FTS_VIDEO.title}&rdquo; ({FTS_VIDEO.durationLabel}). A friendly first look for friends who are new to us.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(videoMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={homeButtonOutline}
                    >
                      Share film on WhatsApp
                    </a>
                    <CopyButton text={videoMessage} label="Copy film message" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* How it works */}
      <section className="rounded-2xl bg-[#f7f3ec] p-6 md:p-8" aria-labelledby="amb-how">
        <h3 id="amb-how" className={homeH3}>
          How it works
        </h3>
        <ul className="mt-5 grid gap-5 md:grid-cols-3">
          <li className={`${homeCard} p-5`}>
            <p className="text-[17px] font-semibold text-[#24170f]">Your friends save {discount}</p>
            <p className={`mt-2 ${homeBody}`}>On their first safari of {minTrip} or more, when they book through your link or code.</p>
          </li>
          <li className={`${homeCard} p-5`}>
            <p className="text-[17px] font-semibold text-[#24170f]">You earn {p.commissionPercent}%</p>
            <p className={`mt-2 ${homeBody}`}>Of the safari package they book, not including {p.excludedText}.</p>
          </li>
          <li className={`${homeCard} p-5`}>
            <p className="text-[17px] font-semibold text-[#24170f]">When you are paid</p>
            <p className={`mt-2 ${homeBody}`}>{p.payoutTerms}</p>
          </li>
        </ul>
        <p className={`mt-6 ${homeBody}`}>
          Your referrals and earnings will appear on this page in a future update. Questions in the meantime?{" "}
          <Link href="/contact/" className={homeTextLink}>
            Contact us
          </Link>
        </p>
      </section>
    </div>
  );
}
