"use client";

import { useEffect, useState } from "react";
import Image from "@/components/SanityImage";
import Link from "next/link";
import { client, urlFor } from "@/lib/sanity";
import type { SanityImageAssetDocument } from "@sanity/client";
import {
  homeContainer,
  homeH2,
  homeSection,
} from "@/components/home/homeStyles";

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

  // Batch 20: a calm, still grid of all partner logos (each shown once)
  // instead of the endlessly scrolling strip. Same logos, names and links.
  return (
    <section className={`relative z-10 bg-white ${homeSection}`}>
      <div className={homeContainer}>
        <h2 className={`text-center ${homeH2}`}>Our Non-Profit Partners</h2>

        <ul className="mx-auto mt-8 grid max-w-[1200px] grid-cols-3 items-center gap-x-6 gap-y-8 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
          {partners.map((partner) => (
            <li key={partner._id} className="flex justify-center">
              <Link
                href="/nonprofits"
                className="block rounded-md p-1 opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
              >
                {partner.logo?.asset && (
                  <Image
                    src={urlFor(partner.logo.asset).width(200).url()}
                    alt={partner.name}
                    width={160}
                    height={100}
                    className="mx-auto h-12 w-auto max-w-[110px] object-contain md:h-14"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
