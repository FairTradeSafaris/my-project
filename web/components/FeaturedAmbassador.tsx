"use client";
import { TypedObject } from "sanity";
import { PortableText } from "@portabletext/react";
import Image from "@/components/SanityImage";
import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import Link from "next/link";
import {
  homeBody,
  homeButtonOutline,
  homeCard,
  homeContainer,
  homeH2,
  homeH3,
  homeSection,
  homeTextLink,
} from "@/components/home/homeStyles";
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";

type SocialLink = {
  platform: string;
  url: string;
};

type Ambassador = {
  _id: string;
  name: string;
  role: string;
  description: TypedObject[];
  slug?: { current: string };
  ctaLabel?: string;
  ctaLink?: string;
  image?: string;
  socials?: SocialLink[];
};

const platformIcons: Record<string, React.ReactElement> = {
  instagram: <Instagram className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
  youtube: <Youtube className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  website: <Globe className="h-5 w-5" />,
};

export default function FeaturedAmbassador() {
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);

  useEffect(() => {
    const fetchAmbassador = async () => {
      try {
        const result = await client.fetch<Ambassador>(
          `*[_type == "ambassador" && featured == true][0]{
            _id,
            name,
            role,
            description,
            slug,
            ctaLabel,
            ctaLink,
            "image": image.asset->url,
            socials
          }`,
        );

        setAmbassador(result || null);
      } catch (err) {
        console.error("❌ Failed to fetch ambassador:", err);
      }
    };

    fetchAmbassador();
  }, []);

  if (!ambassador) return null;

  // Batch 20: calm restyle (display only). Same ambassador, text, image,
  // button, socials and links.
  const profileHref = ambassador.slug?.current
    ? `/ambassadors/${ambassador.slug.current}`
    : null;
  const photo = ambassador.image && (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f2e7db] md:aspect-auto md:h-full md:min-h-[360px]">
      <Image
        src={ambassador.image}
        alt={ambassador.name}
        width={400}
        height={400}
        className="h-full w-full object-cover md:absolute md:inset-0"
        unoptimized
      />
    </div>
  );

  return (
    <section className={`relative bg-[#f7f3ec] text-[#24170f] ${homeSection}`}>
      <div className={homeContainer}>
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <h2 className={homeH2}>Featured Connection</h2>
          <Link href="/ambassadors" className={homeTextLink}>
            See All Connections <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={`mt-8 grid grid-cols-1 gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10 md:p-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] ${homeCard}`}>
          {/* Image */}
          {photo &&
            (profileHref ? (
              <Link href={profileHref} className="block">
                {photo}
              </Link>
            ) : (
              photo
            ))}

          {/* Text */}
          <div className="min-w-0 self-center">
            {profileHref ? (
              <Link href={profileHref} className="block">
                <h3 className={`${homeH3} transition-colors hover:text-[#a35c2d]`}>
                  {ambassador.name}
                </h3>
              </Link>
            ) : (
              <h3 className={homeH3}>{ambassador.name}</h3>
            )}

            <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#a35c2d]">
              {ambassador.role}
            </p>

            <div className={`mt-4 space-y-3 ${homeBody}`}>
              <PortableText value={ambassador.description} />
            </div>

            {/* CTA + Socials */}
            <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-[#efe5d6] pt-6">
              {ambassador.ctaLink && (
                <a
                  href={ambassador.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={homeButtonOutline}
                >
                  {ambassador.ctaLabel || "Learn More"}
                </a>
              )}

              {ambassador.socials && ambassador.socials.length > 0 && (
                <div className="flex items-center gap-2">
                  {ambassador.socials.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-11 w-11 place-items-center rounded-full text-[#5d4037] transition-colors hover:bg-[#f2e7db] hover:text-[#24170f]"
                      title={social.platform}
                      aria-label={social.platform}
                    >
                      {platformIcons[social.platform.toLowerCase()] ?? (
                        <Globe className="h-5 w-5" />
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
