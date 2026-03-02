"use client";

import { useState } from "react";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";
import { PortableText } from "@portabletext/react";
import type { Ambassador } from "@/types/ambassador";
import { urlFor } from "../lib/sanity";
import Image from "next/image";

interface Props {
  amb: Ambassador;
}

export default function AmbassadorCard({ amb }: Props) {
  const [showModal, setShowModal] = useState(false);

  const hasSocials = Array.isArray(amb.socials) && amb.socials.length > 0;
  const isImageString = typeof amb.image === "string";

  const imageUrl =
    typeof amb.image === "string"
      ? amb.image
      : amb.image?.asset
        ? urlFor(amb.image).url()
        : undefined;

  return (
    <>
      {/* Card (linked if slug exists) */}
      <Link
        href={amb.slug?.current ? `/ambassadors/${amb.slug.current}` : "#"}
        className="group transition-transform duration-300 hover:scale-105 w-full max-w-sm mx-auto block"
        onClick={(e) => {
          if (!amb.slug?.current) {
            e.preventDefault();
            setShowModal(true);
          }
        }}
      >
        <div
          className="rounded-3xl overflow-hidden shadow-xl border border-white/10 backdrop-blur-md"
          style={{
            backgroundImage: isImageString
              ? `url(${amb.image})`
              : amb.image?.asset
                ? `url(${urlFor(amb.image).url()})`
                : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            aspectRatio: "3/4",
          }}
        >
          <div className="w-full h-full flex flex-col justify-end text-left p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
            <div className="backdrop-blur-sm bg-black/40 p-4 rounded-xl">
              <h3 className="text-white text-xl font-serif font-bold mb-1">
                {amb.name}
              </h3>
              <p className="text-white/80 text-xs uppercase tracking-wide">
                {amb.role}
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* Modal fallback if no slug */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-2xl text-gray-600 hover:text-black"
              aria-label="Close"
            >
              &times;
            </button>

            <div className="mb-4">
              {imageUrl && (
                <div className="relative w-full aspect-[3/2] mb-4 rounded-xl overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={amb.name}
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </div>
              )}
              <h3 className="text-2xl font-serif font-bold text-[#5a3e2b] mb-1">
                {amb.name}
              </h3>
              <p className="text-sm uppercase text-gray-500 mb-4">{amb.role}</p>
              <div className="prose prose-sm text-gray-800">
                <PortableText value={amb.description} />
              </div>
            </div>

            {hasSocials && (
              <div className="flex gap-3 mt-4">
                {amb.socials!.map((social, idx) => (
                  <SocialIcon
                    key={idx}
                    style={{ height: 28, width: 28 }}
                    url={social.url}
                    fgColor="#333"
                    bgColor="transparent"
                    className="bg-white/80 hover:bg-white p-2 rounded-full transition transform hover:scale-110"
                  />
                ))}
              </div>
            )}

            {amb.ctaLink && amb.ctaLabel && (
              <a
                href={amb.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 px-6 py-2 bg-[#5a3e2b] text-white font-semibold rounded-full shadow hover:bg-[#3a291e] transition"
              >
                {amb.ctaLabel}
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
