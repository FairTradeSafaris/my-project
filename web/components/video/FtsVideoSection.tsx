// components/video/FtsVideoSection.tsx (batch 25)
// Calm homepage-style section with the Fair Trade Safaris film. Server
// component: the heading, description, thumbnail <img> (inside the facade)
// and the VideoObject JSON-LD are all in the page HTML for search engines.
import { FTS_VIDEO, ftsVideoJsonLd } from "./ftsVideo";
import VideoFacade from "./VideoFacade";
import { homeBody, homeContainer, homeEyebrow, homeH2, homeTextLink } from "@/components/home/homeStyles";

export default function FtsVideoSection({
  pageUrl,
  tone = "white",
  eyebrow = "Watch our story",
}: {
  /** Canonical URL of the page, used for the JSON-LD @id. */
  pageUrl: string;
  tone?: "white" | "cream";
  eyebrow?: string;
}) {
  const v = FTS_VIDEO;
  return (
    <section
      className={`${tone === "cream" ? "bg-[#f7f3ec]" : "bg-white"} py-12 md:py-16`}
      aria-labelledby="fts-video-title"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ftsVideoJsonLd(pageUrl)) }}
      />
      <div className={`${homeContainer} grid items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14`}>
        <div>
          <p className={homeEyebrow}>{eyebrow}</p>
          <h2 id="fts-video-title" className={`mt-3 ${homeH2}`}>
            {v.title}
          </h2>
          <p className={`mt-4 ${homeBody} md:text-[17px] md:leading-8`}>{v.description}</p>
          <p className="mt-5 text-[15px] text-[#5c4a3d]">
            Video · {v.durationLabel} ·{" "}
            <a href={v.watchUrl} target="_blank" rel="noopener noreferrer" className={homeTextLink}>
              Watch on YouTube
            </a>
          </p>
        </div>
        <VideoFacade />
      </div>
    </section>
  );
}
