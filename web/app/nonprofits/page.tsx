export const revalidate = 60;

import { client as sanity } from "@/lib/sanity";
import type { Metadata } from "next";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import NonProfitCard from "@/components/NonProfitCard";
import type { NonProfit } from "@/types/nonProfit";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("nonprofits");
  return metadata;
}

export default async function NonProfitsPage() {
  const nonprofits = await sanity.fetch<NonProfit[]>(
    `*[_type == "nonProfit"] | order(_createdAt desc){
      _id,
      name,
      mission,
      description,
      ctaLabel,
      ctaLink,
      website,
      "logo": logo.asset->url,
      socials[] { platform, url, icon }
    }`,
  );

  return (
    <main className="bg-white text-[#2c1b13] min-h-screen">
      {/* Page Intro */}
      <section className="max-w-3xl mx-auto px-6 pt-14 pb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#3c2a1e]">
          Our Impact Partners
        </h1>
        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
          We collaborate with purpose-driven non-profits to protect nature,
          uplift communities, and transform travel into a force for good. Meet
          the organizations making it happen.
        </p>
      </section>

      {/* Grid of Non-Profit Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-16 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {nonprofits.map((org) => (
          <NonProfitCard key={org._id} org={org} />
        ))}
      </section>

      {/* Quote Section */}
      <section className="bg-[#f7f3ee] py-10">
        <div className="max-w-4xl mx-auto px-6 text-center italic text-[#3c2a1e] text-lg">
          “When we travel consciously, we don’t just visit — we contribute.”
          <br />
          <span className="not-italic text-sm text-gray-600">
            – FTS Non-Profit Partner
          </span>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#fdf4ea] py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-[#3c2a1e] mb-4">
            Want to Partner With Us?
          </h2>
          <p className="text-gray-700 mb-6">
            We&apos;re always open to teaming up with mission-aligned
            organizations. If your non-profit supports ethical travel,
            conservation, or community development — let’s talk.
          </p>
          <Link
            href="/contact/"
            className="inline-block px-6 py-3 bg-[#5a3e2b] text-white rounded-full hover:bg-[#3a291e] transition font-medium"
          >
            Become a Partner
          </Link>
        </div>
      </section>
    </main>
  );
}
