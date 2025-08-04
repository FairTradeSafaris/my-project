"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Claim = {
  bookTitle: string;
  bookUrl: string;
};

export default function LeadMagnet() {
  const { isSignedIn, user } = useUser();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const directionDegrees = 225;

  useEffect(() => {
    if (!user?.id || !isSignedIn) return;

    const fetchClaim = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/claim-status?userId=${user.id}`);
        const data = await res.json();
        setClaim(data.claim || null);
      } catch (err) {
        console.error("❌ Error fetching claim status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [user?.id, isSignedIn]);

  const getContent = () => {
    if (!isSignedIn) return { label: "Claim your free book", href: "/sign-in" };
    if (loading) return { label: "Loading...", href: "#" };
    if (!claim)
      return { label: "You qualify for a free guide", href: "/books" };
    return {
      label: "Book a discovery call",
      href: "https://bookings.fairtradesafaris.com/",
    };
  };

  const content = getContent();

  return (
    <div
      onClick={() => router.push(content.href)}
      className="fixed bottom-0 left-0 z-[9999] cursor-pointer group"
    >
      {/* ✅ NEW wrapper with wiggle animation */}
      <div className="animate-cornerWiggle group-hover:animate-none origin-bottom-left">
        <div
          className="relative w-36 h-36"
          style={{
            clipPath: "polygon(0% 100%, 0% 0%, 100% 100%)",
            backgroundColor: "#ffc107",
          }}
        >
          {/* Full-size box inside triangle */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div
              className="text-black font-semibold text-[13px] tracking-tight"
              style={{
                transform: `rotate(${directionDegrees + 180}deg) translate(-10px, -30px)`,
                transformOrigin: "left center",
                whiteSpace: "nowrap",
                textShadow: "0 1px 1px rgba(0,0,0,0.2)",
              }}
            >
              {content.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
