export const revalidate = 60;

import { client } from "@/lib/sanity";
import type { TeamMember } from "@/types/teamMember";
import TeamCard from "@/components/TeamCard";

export default async function TeamPage() {
  const team: TeamMember[] = await client.fetch(`
    *[_type == "teamMember"] | order(_createdAt asc){
      _id,
      name,
      position,
      email,
      linkedin,
      "image": image.asset->url,
      bio
    }
  `);

  return (
    <main className="bg-[#fdf8f3] text-black min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/sunset-safari.webp')` }} // Same image as Ambassador page
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 z-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-3xl">
            Meet the Team
          </h1>
          <p className="text-lg text-white/90 max-w-xl">
            The humans behind the journeys — planners, storytellers, and
            change-makers with a shared mission.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-3xl mx-auto px-6 pt-12 pb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#3c2a1e] mb-4">
          Purpose-Driven. People-Led.
        </h2>
        <p className="text-base text-gray-700 leading-relaxed">
          Our core team ensures every Fair Trade Safari is crafted with passion,
          ethics, and excellence. Get to know us.
        </p>
      </section>

      {/* Team Member Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {team?.length > 0 ? (
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <TeamCard key={member._id} member={member} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No team members found.</p>
        )}
      </section>
    </main>
  );
}
