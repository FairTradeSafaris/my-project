export const revalidate = 60;

import { client } from "@/lib/sanity";
import type { TeamMember } from "@/types/teamMember";
import { Mail, Linkedin } from "lucide-react";

export default async function TeamPage() {
  const team: TeamMember[] =
    await client.fetch(`*[_type == "teamMember"] | order(_createdAt asc){
    _id,
    name,
    position,
    email,
    linkedin,
    "image": image.asset->url,
    bio
  }`);

  return (
    <main className="bg-background text-foreground dark:bg-[#1a1a1a] dark:text-[#fdf8f3] min-h-screen font-sans">
      {/* Hero Section — DO NOT TOUCH */}
      <section className="relative">
        <div
          className="relative bg-cover bg-center min-h-[500px] flex items-center justify-start px-6"
          style={{ backgroundImage: `url('/sunset-safari.webp')` }}
        >
          <div className="absolute inset-0 bg-black/60 z-0" />
          <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-12 items-center py-12">
            <div className="max-w-xl">
              <h1 className="text-white text-5xl font-semibold leading-tight mb-4">
                Meet the Team
              </h1>
              <p className="text-white/90 text-lg leading-relaxed">
                The humans behind the journeys — planners, storytellers, and
                change-makers with a shared mission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subheading */}
      <section className="text-center max-w-3xl mx-auto px-6 pt-12 pb-6">
        <h2 className="text-[22px] font-medium text-[#3c2a1e] dark:text-[#fdf8f3] tracking-tight">
          Purpose-Driven. People-Led.
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 leading-snug">
          Every Fair Trade Safari is crafted by humans who believe in ethical
          impact, bold storytelling, and soulful discovery.
        </p>
      </section>

      {/* Team Section */}
      <section className="px-6 py-20 bg-[#f8f2eb] dark:bg-[#121212] transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          {/* Line Art + Heading */}
          <div className="text-center mb-16">
            <img
              src="/line-art-team.png"
              alt="Line art"
              className="mx-auto w-72 md:w-80 lg:w-96 opacity-90 mb-4 dark:invert"
            />
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#3c2a1e] dark:text-[#fdf8f3] tracking-tight leading-tight">
              Meet the Humans Behind the Magic
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {team.map((member) => (
              <div
                key={member._id}
                className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-sm overflow-hidden border border-[#e4d6c4] dark:border-[#3a3a3a] transition hover:shadow-md"
              >
                {/* Card Top Pattern */}
                <div
                  className="h-20 bg-top bg-repeat-x"
                  style={{ backgroundImage: "url('/teambg.png')" }}
                />

                <div className="flex flex-col items-center text-center px-6 -mt-12 pb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-[#444] shadow-md"
                  />
                  <h4 className="mt-6 text-lg font-semibold text-[#3c2a1e] dark:text-[#fdf8f3] leading-tight">
                    {member.name}
                  </h4>
                  <p className="text-sm text-[#7a5c3e] dark:text-[#c0a97e] mt-1">
                    {member.position}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">
                    {member.bio?.[0]?.children?.[0]?.text ||
                      "Short intro goes here."}
                  </p>

                  {/* Social Icons */}
                  <div className="flex gap-4 mt-4 text-[#3c2a1e] dark:text-[#fdf8f3]">
                    {member.email && (
                      <a href={`mailto:${member.email}`} title="Email">
                        <Mail className="w-5 h-5 hover:opacity-80" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5 hover:opacity-80" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
