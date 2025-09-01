// components/TeamGrid.tsx
"use client";

import Image from "next/image";
import type { TeamMember } from "@/types/teamMember";

export default function TeamGrid({ team }: { team: TeamMember[] }) {
  return (
    <section className="bg-white py-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Meet the Team
          </h2>
          <p className="text-gray-600 max-w-xl">
            We’re a passionate group of ethical travel advocates, creatives, and
            leaders dedicated to transforming how the world experiences Africa.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {team.map((member) => (
            <div key={member.name} className="text-center group">
              <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="rounded-full object-cover shadow-md group-hover:scale-105 transition"
                  sizes="(max-width: 768px) 96px, 112px"
                />
                {member.featured && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#006778] text-white px-3 py-1 text-xs rounded-full shadow-lg">
                    {member.position}
                  </div>
                )}
              </div>
              <p className="mt-4 font-medium text-gray-800">{member.name}</p>
              {!member.featured && (
                <p className="text-sm text-gray-500">{member.position}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
