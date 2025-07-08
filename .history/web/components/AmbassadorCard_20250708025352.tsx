"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import SocialIcon from "./SocialIcon";
import { portableTextComponents } from "@/lib/portableTextComponents";
import type { Ambassador } from "@/types/ambassador";

export default function AmbassadorCard({ amb }: { amb: Ambassador }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full max-w-sm mx-auto perspective cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-[420px] transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl shadow-lg overflow-hidden bg-black">
          <div className="relative w-full h-full">
            <Image
              src={urlFor(amb.image).width(800).height(500).url()}
              alt={amb.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, 400px"
            />

            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4 space-y-2">
              <div>
                <h2 className="text-white text-xl font-bold">{amb.name}</h2>
                <p className="text-sm text-white opacity-80">{amb.role}</p>
              </div>
              <div className="flex gap-3">
                {amb.socials?.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-[#3c2a1e] p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <SocialIcon
                      platform={social.platform}
                      size={20}
                      icon={social.icon}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl shadow-lg bg-white overflow-hidden">
          <div className="flex flex-col justify-between h-full p-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{amb.name}</h2>
              <p className="text-sm text-gray-600 mb-2">{amb.role}</p>
              <PortableText
                value={amb.description}
                components={portableTextComponents}
              />
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                {amb.socials?.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#3c2a1e] text-white p-3 rounded-full hover:bg-[#2b1e15] transition"
                  >
                    <SocialIcon
                      platform={social.platform}
                      size={24}
                      icon={social.icon}
                    />
                  </a>
                ))}
              </div>

              <div className="flex justify-start">
                <a
                  href={amb.ctaLink}
                  className="px-4 py-2 bg-[#3c2a1e] text-white rounded hover:bg-[#2b1e15] text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {amb.ctaLabel || "Learn more"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
