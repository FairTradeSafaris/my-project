"use client";
import { TypedObject } from "sanity";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import Link from "next/link";
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
  instagram: <Instagram className="w-6 h-6" />,
  facebook: <Facebook className="w-6 h-6" />,
  youtube: <Youtube className="w-6 h-6" />,
  linkedin: <Linkedin className="w-6 h-6" />,
  twitter: <Twitter className="w-6 h-6" />,
  website: <Globe className="w-6 h-6" />,
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

  return (
    <section className="relative py-20 bg-[#fdf3e9] text-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            Featured Connection
          </h2>

          <Link
            href="/ambassadors"
            className="inline-block mt-4 text-sm font-medium text-[#5a3e2b] hover:text-black transition"
          >
            See All Connections →
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-8 bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition">
          {/* Image */}
          {ambassador.image && ambassador.slug?.current ? (
            <Link
              href={`/ambassadors/${ambassador.slug.current}`}
              className="w-full md:w-1/3 flex-shrink-0 block"
            >
              <Image
                src={ambassador.image}
                alt={ambassador.name}
                width={400}
                height={400}
                className="rounded-lg object-cover w-full"
                unoptimized
              />
            </Link>
          ) : (
            ambassador.image && (
              <div className="w-full md:w-1/3 flex-shrink-0">
                <Image
                  src={ambassador.image}
                  alt={ambassador.name}
                  width={400}
                  height={400}
                  className="rounded-lg object-cover w-full"
                  unoptimized
                />
              </div>
            )
          )}

          {/* Text */}
          <div className="w-full md:w-2/3">
            {ambassador.slug?.current ? (
              <Link
                href={`/ambassadors/${ambassador.slug.current}`}
                className="block"
              >
                <h3 className="text-2xl font-semibold mb-1 hover:text-[#5a3e2b] transition">
                  {ambassador.name}
                </h3>
              </Link>
            ) : (
              <h3 className="text-2xl font-semibold mb-1">{ambassador.name}</h3>
            )}

            <p className="text-sm text-gray-500 mb-4">{ambassador.role}</p>

            <div className="prose prose-sm text-gray-800 max-w-none">
              <PortableText value={ambassador.description} />
            </div>

            {/* CTA + Socials */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {ambassador.ctaLink && (
                <a
                  href={ambassador.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[#5a3e2b] border border-[#5a3e2b] px-6 py-2 rounded-full hover:bg-[#5a3e2b] hover:text-white transition font-medium text-sm"
                >
                  {ambassador.ctaLabel || "Learn More"}
                </a>
              )}

              {ambassador.socials && ambassador.socials.length > 0 && (
                <div className="flex gap-3 items-center">
                  {ambassador.socials.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5a3e2b] hover:text-black transition"
                      title={social.platform}
                    >
                      {platformIcons[social.platform.toLowerCase()] ?? (
                        <Globe className="w-6 h-6" />
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
