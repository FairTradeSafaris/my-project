"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Leaf, Users, Gem } from "lucide-react";

export default function EthicalSustainableSafarisPage() {
  return (
    <main className="min-h-screen bg-[#fdf8f3] text-black font-sans">
      <section className="px-5 sm:px-6 py-14 sm:py-16 md:py-20 max-w-4xl mx-auto space-y-12 sm:space-y-14 md:space-y-16">
        {/* H1 */}
        <div className="space-y-5 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#5c4033] leading-tight">
            Ethical Safari Company in Africa
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl">
            Travel that protects wildlife, empowers communities, and delivers
            unforgettable safari experiences.
          </p>
        </div>

        {/* Intro */}
        <div className="space-y-5 sm:space-y-6 text-base sm:text-lg leading-relaxed text-gray-800">
          <p>
            If you are searching for an ethical safari company in Africa, you
            are not just planning a trip — you are choosing how your travel
            impacts the continent.
          </p>
          <p>
            At{" "}
            <Link
              href="/"
              className="text-[#5c4033] underline hover:no-underline"
            >
              Fair Trade Safaris
            </Link>
            , every journey is designed to support conservation, strengthen
            local communities, and provide exceptional luxury experiences
            without compromise.
          </p>
        </div>

        {/* Ethical Definition */}
        <div className="space-y-5 sm:space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[#5c4033]" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#5c4033]">
              What Makes a Safari Company Ethical?
            </h2>
          </div>

          <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
            An ethical safari company goes beyond game drives and luxury lodges.
            It ensures tourism protects wildlife, funds conservation, creates
            fair employment, and preserves ecosystems.
          </p>

          <ul className="list-disc list-inside space-y-3 text-base sm:text-lg text-gray-800">
            <li>Supports endangered wildlife protection</li>
            <li>Funds anti-poaching and conservation programs</li>
            <li>Creates fair local employment</li>
            <li>Preserves cultural heritage</li>
            <li>Operates transparently and responsibly</li>
          </ul>
        </div>

        {/* Safari Regions */}
        <div className="space-y-5 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#5c4033]">
            Sustainable Safari Tours Across Africa
          </h2>

          <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
            Our sustainable safari tours operate across East and Southern
            Africa, including{" "}
            <Link
              href="/destination/tanzania"
              className="text-[#5c4033] underline hover:no-underline"
            >
              Tanzania
            </Link>
            ,{" "}
            <Link
              href="/destination/botswana"
              className="text-[#5c4033] underline hover:no-underline"
            >
              Botswana
            </Link>
            ,{" "}
            <Link
              href="/destination/kenya"
              className="text-[#5c4033] underline hover:no-underline"
            >
              Kenya
            </Link>
            ,{" "}
            <Link
              href="/destination/zambia"
              className="text-[#5c4033] underline hover:no-underline"
            >
              Zambia
            </Link>
            ,{" "}
            <Link
              href="/destination/zimbabwe"
              className="text-[#5c4033] underline hover:no-underline"
            >
              Zimbabwe
            </Link>
            , and{" "}
            <Link
              href="/destination/south-africa"
              className="text-[#5c4033] underline hover:no-underline"
            >
              South Africa
            </Link>
            .
          </p>

          <div className="mt-4">
            <Link
              href="/destination/"
              className="inline-block w-full sm:w-auto text-center border border-[#5c4033] text-[#5c4033] px-6 py-3 rounded-lg font-medium hover:bg-[#5c4033] hover:text-white transition"
            >
              Explore All Destinations
            </Link>
          </div>
        </div>

        {/* Wildlife */}
        <div className="space-y-5 sm:space-y-6">
          <div className="flex items-center gap-3">
            <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-[#5c4033]" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#5c4033]">
              Wildlife Conservation Comes First
            </h2>
          </div>

          <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
            Africa’s wildlife faces growing pressure from habitat loss and
            poaching. We partner with lodges and conservancies that actively
            fund ranger patrols, wildlife research, and habitat restoration.
          </p>

          <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
            Learn more about how our safaris align with our{" "}
            <Link
              href="/founderspromise"
              className="text-[#5c4033] underline hover:no-underline"
            >
              founder’s promise and core values
            </Link>
            .
          </p>
        </div>

        {/* Image Anchor */}
        <div className="my-10 sm:my-12">
          <div className="relative w-full h-[320px] sm:h-[420px] md:h-[550px] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/Serengeti-2-cheetahs-sitting-on-mound-1-scaled.jpg"
              alt="Cheetahs resting on a mound in the Serengeti representing wildlife conservation in Africa"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Community */}
        <div className="space-y-5 sm:space-y-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 text-[#5c4033]" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#5c4033]">
              Community-Based Tourism That Empowers
            </h2>
          </div>

          <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
            Sustainable travel must benefit local communities. We prioritize
            partnerships that provide fair wages, support women-led enterprises,
            and reinvest in schools and healthcare.
          </p>
        </div>

        {/* Luxury */}
        <div className="space-y-5 sm:space-y-6">
          <div className="flex items-center gap-3">
            <Gem className="w-6 h-6 sm:w-7 sm:h-7 text-[#5c4033]" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#5c4033]">
              Luxury That Gives Back
            </h2>
          </div>

          <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
            Ethical safaris do not mean sacrificing comfort. Our guests enjoy
            eco-luxury lodges, private guides, curated itineraries, and seamless
            logistics — all designed with sustainability in mind.
          </p>

          <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
            When you are ready, we invite you to{" "}
            <Link
              href="/contact"
              className="text-[#5c4033] underline hover:no-underline"
            >
              start planning your safari
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
