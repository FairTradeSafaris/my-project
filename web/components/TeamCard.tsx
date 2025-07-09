// /components/TeamCard.tsx
import { PortableText } from "@portabletext/react";
import type { TeamMember } from "@/types/teamMember";

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col items-center p-6 text-center transition hover:shadow-lg">
      <img
        src={member.image}
        alt={member.name}
        className="w-32 h-32 object-cover rounded-full mb-4"
      />
      <h3 className="text-xl font-bold">{member.name}</h3>
      <p className="text-sm text-[#5a3e2b] mb-3">{member.position}</p>
      <div className="text-sm text-gray-700 mb-4">
        <PortableText value={member.bio} />
      </div>
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0072b1] font-medium text-sm hover:underline"
        >
          Connect on LinkedIn
        </a>
      )}
    </div>
  );
}
