// components/video/ftsVideo.ts (batch 25)
// The Fair Trade Safaris YouTube film, in one place (no Sanity change).
// Facts taken from the YouTube page itself (18 Oct 2026): title, upload date
// 2019-06-27T14:19:59-07:00, duration PT5M31S, channel "Fair Trade Safaris".
export const FTS_VIDEO = {
  id: "ARcR_mGkZ_s",
  title: "Safe, luxurious, and affordable wildlife safaris in Africa",
  description:
    "Meet Fair Trade Safaris: a socially conscious travel company planning memorable trips to Africa, from wildlife safaris and beach holidays to mountain climbs, food experiences and relaxing retreats, with every journey giving back to wildlife and local communities.",
  uploadDate: "2019-06-27T14:19:59-07:00",
  duration: "PT5M31S",
  durationSeconds: 331,
  durationLabel: "5 min 31 sec",
  thumbnailMax: "https://i.ytimg.com/vi/ARcR_mGkZ_s/maxresdefault.jpg",
  thumbnailHq: "https://i.ytimg.com/vi/ARcR_mGkZ_s/hqdefault.jpg",
  watchUrl: "https://www.youtube.com/watch?v=ARcR_mGkZ_s",
  shortUrl: "https://youtu.be/ARcR_mGkZ_s",
  embedUrl: "https://www.youtube.com/embed/ARcR_mGkZ_s",
  playerUrl: "https://www.youtube-nocookie.com/embed/ARcR_mGkZ_s?autoplay=1&rel=0&modestbranding=1",
  alt: "Safe, luxurious, and affordable wildlife safaris in Africa: Fair Trade Safaris video",
} as const;

/** schema.org VideoObject for the page the video is shown on. */
export function ftsVideoJsonLd(pageUrl: string) {
  const v = FTS_VIDEO;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${pageUrl}#fts-video`,
    name: v.title,
    description: v.description,
    thumbnailUrl: [v.thumbnailMax, v.thumbnailHq],
    uploadDate: v.uploadDate,
    duration: v.duration,
    embedUrl: v.embedUrl,
    contentUrl: v.watchUrl,
    inLanguage: "en",
    isFamilyFriendly: true,
  };
}
