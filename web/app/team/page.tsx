export const revalidate = 60;

import { client } from "@/lib/sanity";
import type { TeamMember } from "@/types/teamMember";
import { Mail, Linkedin } from "lucide-react";
import Image from "next/image";

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

      {/* Team Section */}
      <section className="px-6 py-20 bg-[#f8f2eb] dark:bg-[#121212] transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          {/* Line Art + Heading */}
          <div className="text-center mb-16">
            <div className="mx-auto w-72 md:w-80 lg:w-96 relative h-20 opacity-90 mb-4 dark:invert">
              <Image
                src="/line-art-team.png"
                alt="Line art"
                fill
                className="object-contain"
                priority
              />
            </div>
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
                  <div className="w-28 h-28 relative rounded-full border-4 border-white dark:border-[#444] shadow-md overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
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
