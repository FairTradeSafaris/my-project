"use client";

import { useEffect, useRef } from "react";

export default function PremiumHeroVideo({
  videoUrl,
  posterUrl,
}: {
  videoUrl: string;
  posterUrl?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // autoplay blocked — silently ignore
      });
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      muted
      loop
      playsInline
      preload="auto"
      poster={posterUrl}
    >
      <source src={videoUrl} type="video/mp4" />
    </video>
  );
}
