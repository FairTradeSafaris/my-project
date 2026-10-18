"use client";

import Image from "@/components/SanityImage";
import Link from "next/link";
import { ShieldCheck, Wallet, RefreshCcw, Star, Quote } from "lucide-react";
import {
  coreBody,
  coreButtonOutline,
  coreCard,
  coreContainer,
  coreCream,
  coreDivider,
  coreH1,
  coreH2,
  coreH3,
  coreIconBadge,
  coreLead,
  coreLink,
  coreSection,
} from "@/components/core/coreStyles";

// Batch 23: homepage-style layout (display only). Same headings, words, links,
// line art and order; S.A.F.E. points are white cards on cream.
const body = `${coreBody} md:text-[17px] md:leading-8`;

export default function OurPromisePage() {
  return (
    <main className="min-h-screen bg-white text-[#24170f] font-sans">
      <section className={`bg-white ${coreSection}`}>
        <div className={`${coreContainer} grid gap-8 md:grid-cols-12 md:items-center`}>
          {/* Header */}
          <div className="space-y-5 md:col-span-6">
            <h1 className={coreH1}>
              The Founder’s Promise
            </h1>

            <p className={`${coreLead} max-w-3xl`}>
              At{" "}
              <Link href="/" className={coreLink}>
                Fair Trade Safaris
              </Link>
              , travel isn’t just business — it’s personal.
            </p>
          </div>

          {/* Quote Block */}
          <div className={`${coreCard} flex flex-col items-start gap-4 p-6 sm:flex-row sm:gap-5 sm:p-8 md:col-span-6`}>
            <span className={coreIconBadge}>
              <Quote className="h-6 w-6" />
            </span>
            <div>
              <p className="mb-3 text-[21px] italic leading-relaxed text-[#24170f] sm:text-[24px]">
                I would never design a trip for you that I wouldn’t take myself —
                with my own family.
              </p>
              <p className="text-[16px] text-[#5c4a3d]">
                That’s not marketing. That’s a promise.
              </p>
            </div>
          </div>
        </div>

        {/* Line Art Divider */}
        <div className={coreContainer}>
          <div className="relative mt-8 h-[140px] w-full opacity-60 sm:h-[180px] md:mt-10 md:h-[200px]">
            <Image
              src="/line-art-team.png"
              alt="Safari line art illustration featuring acacia trees, safari vehicle, and giraffes"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* SAFE Framework */}
      <section className={`${coreCream} ${coreSection}`}>
        <div className={coreContainer}>
          <div className="max-w-3xl">
            <h2 className={coreH2}>
              What is S.A.F.E.?
            </h2>

            <p className={`mt-4 ${body}`}>
              S.A.F.E. stands for{" "}
              <strong className="font-semibold text-[#24170f]">
                Security, Affordability, Flexibility, and Experiences
              </strong>{" "}
              — the framework behind every safari we design.
            </p>

            <p className={`mt-4 ${body}`}>
              It also reflects our broader commitment to{" "}
              <Link href="/ethical-sustainable-safaris" className={coreLink}>
                ethical and sustainable safari travel in Africa
              </Link>
              .
            </p>
          </div>

          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Security */}
            <li className={`${coreCard} flex flex-col items-start gap-4 p-6 sm:flex-row sm:gap-5 md:p-8`}>
              <span className={coreIconBadge}>
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div className="flex h-full w-full flex-col">
                <h3 className={`${coreH3} mb-3`}>
                  Security
                </h3>
                <p className={body}>
                  From bush flights to private conservancies across Africa,
                  every partner is vetted for safety, professionalism, and
                  reliability.
                </p>

                <div className={`mt-6 ${coreDivider} pt-6`}>
                  <Link
                    href="/destination/"
                    className={`${coreButtonOutline} w-full sm:w-auto`}
                  >
                    Explore All Destinations
                  </Link>
                </div>
              </div>
            </li>

            {/* Affordability */}
            <li className={`${coreCard} flex flex-col items-start gap-4 p-6 sm:flex-row sm:gap-5 md:p-8`}>
              <span className={coreIconBadge}>
                <Wallet className="h-6 w-6" />
              </span>
              <div className="flex h-full w-full flex-col">
                <h3 className={`${coreH3} mb-3`}>
                  Affordability
                </h3>
                <p className={body}>
                  Luxury should reflect value — not inflated margins. Our
                  long-standing relationships across Africa allow us to deliver
                  premium safari experiences responsibly.
                </p>
                <div className={`mt-6 ${coreDivider} pt-6`}>
                  <Link
                    href="/africansafariitineraries/"
                    className={`${coreButtonOutline} w-full sm:w-auto`}
                  >
                    Explore Our Safari Itineraries
                  </Link>
                </div>
              </div>
            </li>

            {/* Flexibility */}
            <li className={`${coreCard} flex flex-col items-start gap-4 p-6 sm:flex-row sm:gap-5 md:p-8`}>
              <span className={coreIconBadge}>
                <RefreshCcw className="h-6 w-6" />
              </span>
              <div>
                <h3 className={`${coreH3} mb-3`}>
                  Flexibility
                </h3>
                <p className={body}>
                  Whether you&apos;re planning a honeymoon, a private
                  expedition, or a multi-generational safari, your itinerary is
                  designed entirely around your goals.
                </p>
              </div>
            </li>

            {/* Experiences */}
            <li className={`${coreCard} flex flex-col items-start gap-4 p-6 sm:flex-row sm:gap-5 md:p-8`}>
              <span className={coreIconBadge}>
                <Star className="h-6 w-6" />
              </span>
              <div className="flex h-full w-full flex-col">
                <h3 className={`${coreH3} mb-3`}>
                  Experiences
                </h3>
                <p className={body}>
                  Every lodge, guide, and experience we recommend has been
                  personally vetted. If it’s included in your safari, it meets
                  our standards — no exceptions.
                </p>
                <div className={`mt-6 ${coreDivider} pt-6`}>
                  <Link
                    href="/africansafariitineraries/"
                    className={`${coreButtonOutline} w-full sm:w-auto`}
                  >
                    View Featured Safari Experiences
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className={`bg-white ${coreSection}`}>
        <div className={coreContainer}>
          <p className={`${coreLead} max-w-3xl`}>
            If you’re ready to plan a safari built on trust, integrity, and
            purpose, we invite you to{" "}
            <Link href="/contact" className={coreLink}>
              begin your journey with us
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
