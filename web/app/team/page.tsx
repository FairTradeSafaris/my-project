// /app/team/page.tsx
export const revalidate = 60;

import { client } from "@/lib/sanity";
import type { TeamMember } from "@/types/teamMember";
import { Mail, Linkedin } from "lucide-react";
import Image from "@/components/SanityImage";
import type { Metadata } from "next";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import { coreButton, coreCard, coreContainer } from "@/components/core/coreStyles";

// --- SEO METADATA ---
export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("team");

  return {
    ...metadata,
    title:
      metadata?.title ||
      "Meet the Team | Fair Trade Safaris — The People Behind the Purpose",
    description:
      metadata?.description ||
      "Meet the passionate team behind Fair Trade Safaris—dedicated travel experts driven by ethics, conservation, and meaningful impact.",
  };
}

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

  const pageData = await client.fetch(`*[_type == "teamPage"][0]{
      title,
      intro,
      ctaText,
      ctaLink
    }`);

  return (
    <main className="bg-background text-foreground   min-h-screen font-sans">
      {/* Hero Section — DO NOT TOUCH */}

      {/* Batch 23: same header; wider container, homepage-style cards (display only) */}
      <section className="py-14 md:py-16 bg-[#f7f3ec]  transition-colors duration-500">
        <div className={coreContainer}>
          {/* Line Art + Editable Heading */}
          <div className="text-center mb-12">
            <div className="mx-auto w-72 md:w-80 lg:w-96 relative h-20 opacity-90 mb-4 ">
              <Image
                src="/line-art-team.png"
                alt="Line art"
                fill
                className="object-contain"
                priority
              />
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[#3c2a1e]  tracking-tight leading-tight">
              {pageData?.title || "Meet the Humans Behind the Magic"}
            </h1>

            {pageData?.intro && (
              <p className="mt-4 text-[17px] leading-8 text-[#5c4a3d] max-w-2xl mx-auto">
                {pageData.intro[0]?.children[0]?.text}
              </p>
            )}
          </div>

          {/* Team Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {team.map((member) => (
              <div
                key={member._id}
                className={`${coreCard} overflow-hidden`}
              >
                <div
                  className="h-20 bg-top bg-repeat-x"
                  style={{ backgroundImage: "url('/teambg.png')" }}
                />

                <div className="flex flex-col items-center text-center px-6 -mt-12 pb-6">
                  <div className="w-28 h-28 relative rounded-full border-4 border-white  shadow-md overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>

                  <h4 className="mt-5 text-[20px] font-semibold text-[#24170f] leading-snug">
                    {member.name}
                  </h4>

                  <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#a35c2d]">
                    {member.position}
                  </p>

                  <p className="mt-4 text-[16px] leading-7 text-[#5c4a3d]">
                    {member.bio?.[0]?.children?.[0]?.text ||
                      "Short intro goes here."}
                  </p>

                  <div className="mt-5 flex w-full justify-center gap-5 border-t border-[#efe5d6] pt-5 text-[#5d4037]">
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

          {/* Optional CTA */}
          {pageData?.ctaText && pageData?.ctaLink && (
            <div className="text-center mt-12">
              <a
                href={pageData.ctaLink}
                className={coreButton}
              >
                {pageData.ctaText}
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
