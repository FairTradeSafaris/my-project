"use client";

import Image from "@/components/SanityImage";
import Link from "next/link";
import { ShieldCheck, Leaf, Users, Gem } from "lucide-react";
import LineArt from "@/components/LineArt";
import {
  coreBody,
  coreButtonOutline,
  coreCard,
  coreContainer,
  coreCream,
  coreDivider,
  coreH1,
  coreH2,
  coreIconBadge,
  coreLead,
  coreLink,
  coreSection,
} from "@/components/core/coreStyles";

// Batch 23: homepage-style layout (display only). Same headings, words, links,
// image and order as before; the content now sits in white rounded cards on
// alternating cream / white sections.
const h2 = `${coreH2} text-[24px] md:text-[28px]`;
const body = `${coreBody} md:text-[17px] md:leading-8`;

export default function EthicalSustainableSafarisPage() {
  return (
    <main className="min-h-screen bg-white text-[#24170f] font-sans">
      {/* H1 + Intro */}
      <section className={`bg-white ${coreSection}`}>
        <div className={`${coreContainer} grid gap-8 md:grid-cols-12 md:items-center`}>
          <div className="space-y-5 md:col-span-8">
            <h1 className={coreH1}>Ethical Safari Company in Africa</h1>
            <p className={`${coreLead} max-w-3xl`}>
              Travel that protects wildlife, empowers communities, and delivers
              unforgettable safari experiences.
            </p>

            <div className={`space-y-4 ${body} max-w-3xl`}>
              <p>
                If you are searching for an ethical safari company in Africa, you
                are not just planning a trip — you are choosing how your travel
                impacts the continent.
              </p>
              <p>
                At{" "}
                <Link href="/" className={coreLink}>
                  Fair Trade Safaris
                </Link>
                , every journey is designed to support conservation, strengthen
                local communities, and provide exceptional luxury experiences
                without compromise.
              </p>
            </div>
          </div>
          <LineArt
            name="elephant-acacia"
            className="hidden w-full max-w-[360px] justify-self-end text-[#c9974f]/70 md:col-span-4 md:block"
          />
        </div>
      </section>

      {/* Ethical definition + regions */}
      <section className={`${coreCream} ${coreSection}`}>
        <div className={`${coreContainer} grid gap-6 lg:grid-cols-2`}>
          {/* Ethical Definition */}
          <div className={`${coreCard} space-y-4 p-6 md:p-8`}>
            <div className="flex items-center gap-4">
              <span className={coreIconBadge}>
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h2 className={h2}>What Makes a Safari Company Ethical?</h2>
            </div>

            <p className={body}>
              An ethical safari company goes beyond game drives and luxury lodges.
              It ensures tourism protects wildlife, funds conservation, creates
              fair employment, and preserves ecosystems.
            </p>

            <ul className={`list-disc space-y-2 pl-5 marker:text-[#c9974f] ${body}`}>
              <li>Supports endangered wildlife protection</li>
              <li>Funds anti-poaching and conservation programs</li>
              <li>Creates fair local employment</li>
              <li>Preserves cultural heritage</li>
              <li>Operates transparently and responsibly</li>
            </ul>
          </div>

          {/* Safari Regions */}
          <div className={`${coreCard} flex flex-col p-6 md:p-8`}>
            <h2 className={h2}>Sustainable Safari Tours Across Africa</h2>

            <p className={`mt-4 ${body}`}>
              Our sustainable safari tours operate across East and Southern
              Africa, including{" "}
              <Link href="/destination/tanzania" className={coreLink}>
                Tanzania
              </Link>
              ,{" "}
              <Link href="/destination/botswana" className={coreLink}>
                Botswana
              </Link>
              ,{" "}
              <Link href="/destination/kenya" className={coreLink}>
                Kenya
              </Link>
              ,{" "}
              <Link href="/destination/zambia" className={coreLink}>
                Zambia
              </Link>
              ,{" "}
              <Link href="/destination/zimbabwe" className={coreLink}>
                Zimbabwe
              </Link>
              , and{" "}
              <Link href="/destination/south-africa" className={coreLink}>
                South Africa
              </Link>
              .
            </p>

            <div className={`mt-auto pt-6`}>
              <div className={`${coreDivider} pt-6`}>
                <Link
                  href="/destination/"
                  className={`${coreButtonOutline} w-full sm:w-auto`}
                >
                  Explore All Destinations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wildlife + image (feature card) */}
      <section className={`bg-white ${coreSection}`}>
        <div className={coreContainer}>
          <div className={`${coreCard} grid gap-6 p-5 sm:p-7 md:grid-cols-12 md:gap-10 md:p-9`}>
            {/* Wildlife */}
            <div className="space-y-4 self-center md:col-span-6">
              <div className="flex items-center gap-4">
                <span className={coreIconBadge}>
                  <Leaf className="h-6 w-6" />
                </span>
                <h2 className={h2}>Wildlife Conservation Comes First</h2>
              </div>

              <p className={body}>
                Africa’s wildlife faces growing pressure from habitat loss and
                poaching. We partner with lodges and conservancies that actively
                fund ranger patrols, wildlife research, and habitat restoration.
              </p>

              <p className={body}>
                Learn more about how our safaris align with our{" "}
                <Link href="/founderspromise" className={coreLink}>
                  founder’s promise and core values
                </Link>
                .
              </p>
            </div>

            {/* Image Anchor */}
            <div className="md:order-first md:col-span-6">
              <div className="relative h-[260px] w-full overflow-hidden rounded-xl bg-[#f2e7db] sm:h-[360px] md:h-[420px]">
                <Image
                  src="/images/Serengeti-2-cheetahs-sitting-on-mound-1-scaled.jpg"
                  alt="Cheetahs resting on a mound in the Serengeti representing wildlife conservation in Africa"
                  fill
                  sizes="(min-width: 1440px) 660px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community + Luxury */}
      <section className={`${coreCream} ${coreSection}`}>
        <div className={`${coreContainer} grid gap-6 lg:grid-cols-2`}>
          {/* Community */}
          <div className={`${coreCard} space-y-4 p-6 md:p-8`}>
            <div className="flex items-center gap-4">
              <span className={coreIconBadge}>
                <Users className="h-6 w-6" />
              </span>
              <h2 className={h2}>Community-Based Tourism That Empowers</h2>
            </div>

            <p className={body}>
              Sustainable travel must benefit local communities. We prioritize
              partnerships that provide fair wages, support women-led enterprises,
              and reinvest in schools and healthcare.
            </p>
          </div>

          {/* Luxury */}
          <div className={`${coreCard} space-y-4 p-6 md:p-8`}>
            <div className="flex items-center gap-4">
              <span className={coreIconBadge}>
                <Gem className="h-6 w-6" />
              </span>
              <h2 className={h2}>Luxury That Gives Back</h2>
            </div>

            <p className={body}>
              Ethical safaris do not mean sacrificing comfort. Our guests enjoy
              eco-luxury lodges, private guides, curated itineraries, and seamless
              logistics — all designed with sustainability in mind.
            </p>

            <p className={body}>
              When you are ready, we invite you to{" "}
              <Link href="/contact" className={coreLink}>
                start planning your safari
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
