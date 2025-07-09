export const revalidate = 60;

import { client } from "@/lib/sanity";
import AmbassadorCard from "@/components/AmbassadorCard";
import type { Ambassador } from "@/types/ambassador";

export default async function AmbassadorsPage() {
  const ambassadors: Ambassador[] = await client.fetch(`
    *[_type == "ambassador"] | order(_createdAt desc){
      _id,
      name,
      role,
      description,
      ctaLabel,
      ctaLink,
      "image": image.asset->url,
      socials[] {
        platform,
        url,
        icon
      }
    }
  `);

  return (
    <main className="bg-[#fdf8f3] text-black min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/sunset-safari.webp')` }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-3xl">
            Meet Our Ambassadors & Collaborators
          </h1>
          <p className="text-lg text-white/90 max-w-xl">
            From influencers to wildlife photographers, meet the people who help
            us shape ethical travel.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-3xl mx-auto px-6 pt-12 pb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#3c2a1e] mb-4">
          The Faces Behind the Mission
        </h2>
        <p className="text-base text-gray-700 leading-relaxed">
          Our ambassadors are more than just names — they’re changemakers,
          cultural connectors, storytellers, and sustainability champions. Get
          to know the humans shaping how the world travels with heart.
        </p>
      </section>

      {/* Mini Value Grid */}
      <section className="max-w-5xl mx-auto px-6 pt-4 pb-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-2xl font-bold text-[#5a3e2b]">20+</p>
          <p className="text-sm text-gray-600">Global Ambassadors</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[#5a3e2b]">5M+</p>
          <p className="text-sm text-gray-600">Collective Reach</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[#5a3e2b]">1 Shared Mission</p>
          <p className="text-sm text-gray-600">
            Ethical, Purpose-Driven Travel
          </p>
        </div>
      </section>

      {/* Optional Visual Quote Strip */}
      <section className="bg-[#f0eae2] py-6">
        <div className="max-w-5xl mx-auto px-6 text-center italic text-[#3c2a1e] text-lg">
          “Travel isn’t just about seeing the world — it’s about seeing your
          place in it.”
          <br />
          <span className="not-italic text-sm text-gray-600">
            – One of Our Ambassadors
          </span>
        </div>
      </section>

      {/* Ambassador Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {ambassadors.map((amb) => (
            <AmbassadorCard key={amb._id} amb={amb} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#fdf4ea] py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-semibold text-[#3c2a1e] mb-4">
            Interested in Joining the Movement?
          </h3>
          <p className="text-gray-700 mb-6">
            We&apos;re always on the lookout for mission-aligned creators,
            guides, and advocates to help tell the story of conscious travel.
            Think you&apos;d be a fit?
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-[#5a3e2b] text-white rounded-full hover:bg-[#3a291e] transition font-medium"
          >
            Become an Ambassador
          </a>
        </div>
      </section>
    </main>
  );
}
