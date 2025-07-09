import { SocialIcon } from "react-social-icons";
import { PortableText } from "@portabletext/react";
import type { Ambassador } from "@/types/ambassador";

interface Props {
  amb: Ambassador;
}

export default function AmbassadorCard({ amb }: Props) {
  return (
    <div className="relative w-full max-w-sm mx-auto group transition-transform duration-300 hover:scale-105">
      <div
        className="rounded-t-[80px] rounded-b-[58px] overflow-hidden shadow-2xl border border-white/10 backdrop-blur-md"
        style={{
          backgroundImage: `url(${amb.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          aspectRatio: "3/4",
        }}
      >
        <div className="w-full h-full flex flex-col justify-end text-center px-6 pb-6 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
          <div className="backdrop-blur-sm bg-black/30 p-4 rounded-xl mb-4">
            <h3 className="text-white text-2xl font-extrabold mb-1">
              {amb.name}
            </h3>
            <p className="text-white/80 text-sm font-semibold uppercase tracking-wide">
              {amb.role}
            </p>
          </div>

          <div className="text-white/80 text-sm leading-relaxed mb-5 px-4 backdrop-blur-sm bg-black/20 rounded-xl">
            <PortableText value={amb.description} />
          </div>

          {amb.socials?.length ? (
            <div className="flex justify-center gap-4 mb-5">
              {amb.socials.map((social, idx) => (
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
          ) : null}

          {amb.ctaLink && amb.ctaLabel && (
            <a
              href={amb.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-[#5a3e2b] text-white font-semibold rounded-full shadow hover:bg-[#3a291e] transition"
            >
              {amb.ctaLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
