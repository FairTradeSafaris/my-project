"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/lib/sanity";
import type { SanityImageAssetDocument } from "@sanity/client";

type NonProfit = {
  _id: string;
  name: string;
  slug?: { current: string };
  logo?: { asset?: SanityImageAssetDocument };
};

export default function NonProfitCarousel() {
  const [partners, setPartners] = useState<NonProfit[]>([]);

  useEffect(() => {
    const fetchNonProfits = async () => {
      const data = await client.fetch(
        `*[_type == "nonProfit"]{
          _id,
          name,
          slug,
          logo { asset }
        }`,
      );
      setPartners(data || []);
    };
    fetchNonProfits();
  }, []);

  if (!partners.length) return null;

  // Duplicate the list for infinite loop illusion
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="relative z-10 bg-[#fdf7f1] py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Our Non-Profit Partners
        </h2>

        <div className="carousel-track-wrapper">
          <div className="carousel-track">
            {duplicatedPartners.map((partner, index) => (
              <div key={`${partner._id}-${index}`} className="carousel-item">
                <Link href="/nonprofits" className="block group">
                  {partner.logo?.asset && (
                    <Image
                      src={urlFor(partner.logo.asset).width(200).url()}
                      alt={partner.name}
                      width={160}
                      height={100}
                      className="mx-auto h-20 object-contain grayscale opacity-80 group-hover:opacity-100 transition"
                    />
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .carousel-track-wrapper {
          overflow: hidden;
          position: relative;
        }

        .carousel-track {
          display: flex;
          gap: 3.5rem;
          animation: scroll 60s linear infinite;
        }

        .carousel-item {
          flex: 0 0 auto;
          width: 10rem;
        }

        .carousel-track-wrapper:hover .carousel-track {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .carousel-track {
            gap: 2rem;
            animation-duration: 45s;
          }
        }
      `}</style>
    </section>
  );
}
