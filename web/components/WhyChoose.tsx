"use client";

// Batch 20: calm restyle (display only). Same Sanity title, image, reasons
// and button; wider container, consistent type and spacing.
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "@/components/SanityImage";
import Link from "next/link";
import {
  homeBody,
  homeButton,
  homeContainer,
  homeH2,
  homeSection,
} from "@/components/home/homeStyles";

type WhyChooseBlock = {
  sectionTitle: PortableTextBlock[];
  sideImage?: { asset: { url: string }; alt?: string };
  reasons: {
    icon?: { asset: { url: string }; alt?: string };
    title: string;
    description: string;
  }[];
};

type WhyChooseProps = { data: WhyChooseBlock };

export default function WhyChoose({ data }: WhyChooseProps) {
  const { sectionTitle, sideImage, reasons } = data;

  return (
    <section className={`bg-white text-[#24170f] ${homeSection}`}>
      <div
        className={`${homeContainer} grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:grid-cols-[5fr_6fr] lg:gap-16`}
      >
        {/* Image */}
        {sideImage?.asset?.url && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#f2e7db] md:aspect-[4/5] lg:aspect-[5/5]">
            <Image
              src={sideImage.asset.url}
              alt={sideImage.alt || "Why Travel Visual"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
              loading="lazy"
            />
          </div>
        )}

        {/* Text */}
        <div>
          <PortableText
            value={sectionTitle}
            components={{
              block: {
                normal: ({ children }) => <h2 className={homeH2}>{children}</h2>,
                center: ({ children }) => <h2 className={homeH2}>{children}</h2>,
              },
              marks: {
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-[#a35c2d]">{children}</em>
                ),
              },
            }}
          />

          <ul className="mt-8 divide-y divide-[#efe5d6]">
            {reasons?.map((item, index) => (
              <li key={index} className="flex items-start gap-5 py-5 first:pt-0">
                {item.icon?.asset?.url && (
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#f2e7db]">
                    <Image
                      src={item.icon.asset.url}
                      alt={item.icon.alt || item.title || "Icon"}
                      width={28}
                      height={28}
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  {item.title ? (
                    <h3 className="text-[19px] font-semibold leading-snug text-[#24170f]">
                      {item.title}
                    </h3>
                  ) : (
                    <div className="mb-1 h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                  )}
                  {item.description ? (
                    <p className={`mt-1.5 break-words ${homeBody}`}>
                      {item.description}
                    </p>
                  ) : (
                    <div className="mt-2 h-4 w-full animate-pulse rounded bg-gray-100" />
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Link href="/destination/" className={homeButton}>
              Discover Our Destinations
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
