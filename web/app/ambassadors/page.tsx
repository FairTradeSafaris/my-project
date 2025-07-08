export const revalidate = 60;

import { client } from "@/../lib/sanity";
import AmbassadorCard from "@/components/AmbassadorCard";
import type { Ambassador } from "@/../types/ambassador";

export default async function AmbassadorsPage() {
  const ambassadors: Ambassador[] = await client.fetch(`
    *[_type == "ambassador"] | order(_createdAt desc){
      _id,
      name,
      role,
      description,
      ctaLabel,
      ctaLink,
      image,
      socials[]{
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

      {/* Ambassador Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {ambassadors.map((amb) => (
            <AmbassadorCard key={amb._id} amb={amb} />
          ))}
        </div>
      </section>
    </main>
  );
}
