"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Wallet, RefreshCcw, Star, Quote } from "lucide-react";

export default function OurPromisePage() {
  return (
    <main className="min-h-screen bg-[#fdf8f3] text-black font-sans">
      <section className="px-5 sm:px-6 py-14 sm:py-16 md:py-20 max-w-5xl mx-auto space-y-12 sm:space-y-14 md:space-y-16">
        {/* Header */}
        <div className="space-y-5 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#5c4033]">
            The Founder’s Promise
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl">
            At{" "}
            <Link
              href="/"
              className="text-[#5c4033] underline hover:no-underline"
            >
              Fair Trade Safaris
            </Link>
            , travel isn’t just business — it’s personal.
          </p>
        </div>

        {/* Quote Block */}
        <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
          <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-[#5c4033] shrink-0 sm:mt-1" />
          <div>
            <p className="text-xl sm:text-2xl italic text-gray-800 mb-3 leading-relaxed">
              I would never design a trip for you that I wouldn’t take myself —
              with my own family.
            </p>
            <p className="text-gray-600">
              That’s not marketing. That’s a promise.
            </p>
          </div>
        </div>

        {/* Line Art Divider */}
        <div className="relative w-full h-[160px] sm:h-[200px] md:h-[220px] opacity-60 mt-8 sm:mt-12">
          <Image
            src="/line-art-team.png"
            alt="Safari line art illustration featuring acacia trees, safari vehicle, and giraffes"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* SAFE Framework */}
        <div className="space-y-8 sm:space-y-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#5c4033]">
              What is S.A.F.E.?
            </h2>

            <p className="mt-4 text-base sm:text-lg text-gray-800 leading-relaxed">
              S.A.F.E. stands for{" "}
              <strong>
                Security, Affordability, Flexibility, and Experiences
              </strong>{" "}
              — the framework behind every safari we design.
            </p>

            <p className="mt-4 text-base sm:text-lg text-gray-800 leading-relaxed">
              It also reflects our broader commitment to{" "}
              <Link
                href="/ethical-sustainable-safaris"
                className="text-[#5c4033] underline hover:no-underline"
              >
                ethical and sustainable safari travel in Africa
              </Link>
              .
            </p>
          </div>

          <ul className="space-y-10 sm:space-y-12">
            {/* Security */}
            <li className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[#5c4033] shrink-0 sm:mt-1" />
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">
                  Security
                </h3>
                <p className="text-gray-800 leading-relaxed text-base sm:text-lg">
                  From bush flights to private conservancies across Africa,
                  every partner is vetted for safety, professionalism, and
                  reliability.
                </p>

                <div className="mt-6">
                  <Link
                    href="/destination/"
                    className="inline-block w-full sm:w-auto text-center border border-[#5c4033] text-[#5c4033] px-6 py-3 rounded-lg font-medium hover:bg-[#5c4033] hover:text-white transition"
                  >
                    Explore All Destinations
                  </Link>
                </div>
              </div>
            </li>

            {/* Affordability */}
            <li className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
              <Wallet className="w-6 h-6 sm:w-7 sm:h-7 text-[#5c4033] shrink-0 sm:mt-1" />
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">
                  Affordability
                </h3>
                <p className="text-gray-800 leading-relaxed text-base sm:text-lg">
                  Luxury should reflect value — not inflated margins. Our
                  long-standing relationships across Africa allow us to deliver
                  premium safari experiences responsibly.
                </p>
                <div className="mt-4">
                  <Link
                    href="/africansafariitineraries/"
                    className="text-[#5c4033] font-medium underline hover:no-underline"
                  >
                    Explore Our Safari Itineraries
                  </Link>
                </div>
              </div>
            </li>

            {/* Flexibility */}
            <li className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
              <RefreshCcw className="w-6 h-6 sm:w-7 sm:h-7 text-[#5c4033] shrink-0 sm:mt-1" />
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">
                  Flexibility
                </h3>
                <p className="text-gray-800 leading-relaxed text-base sm:text-lg">
                  Whether you&apos;re planning a honeymoon, a private
                  expedition, or a multi-generational safari, your itinerary is
                  designed entirely around your goals.
                </p>
              </div>
            </li>

            {/* Experiences */}
            <li className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
              <Star className="w-6 h-6 sm:w-7 sm:h-7 text-[#5c4033] shrink-0 sm:mt-1" />
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">
                  Experiences
                </h3>
                <p className="text-gray-800 leading-relaxed text-base sm:text-lg">
                  Every lodge, guide, and experience we recommend has been
                  personally vetted. If it’s included in your safari, it meets
                  our standards — no exceptions.
                </p>
                <div className="mt-4">
                  <Link
                    href="/africansafariitineraries/"
                    className="text-[#5c4033] font-medium underline hover:no-underline"
                  >
                    View Featured Safari Experiences
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Closing CTA */}
        <div className="pt-10 sm:pt-12 border-t border-gray-300 space-y-6">
          <p className="text-base sm:text-lg text-gray-800 leading-relaxed max-w-3xl">
            If you’re ready to plan a safari built on trust, integrity, and
            purpose, we invite you to{" "}
            <Link
              href="/contact"
              className="text-[#5c4033] underline hover:no-underline"
            >
              begin your journey with us
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
