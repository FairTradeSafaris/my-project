"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Gift } from "lucide-react";

type Claim = {
  bookTitle: string;
  bookUrl: string;
};

export default function LeadMagnet() {
  const { isSignedIn, user } = useUser();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);
  const router = useRouter();
  const pulseTimeout = useRef<NodeJS.Timeout | null>(null);

  // Pulse every 30 seconds (and on mount)
  useEffect(() => {
    // Pulse immediately on mount
    console.log("Pulse on mount");
    setPulse(true);
    pulseTimeout.current = setTimeout(() => {
      setPulse(false);
      console.log("Pulse off after 800ms");
    }, 800);

    const interval = setInterval(() => {
      console.log("Pulse every 30s");
      setPulse(true);
      pulseTimeout.current = setTimeout(() => {
        setPulse(false);
        console.log("Pulse off after 800ms (interval)");
      }, 800);
    }, 30000);

    return () => {
      clearInterval(interval);
      if (pulseTimeout.current) clearTimeout(pulseTimeout.current);
    };
  }, []);

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
    if (!isSignedIn)
      return { label: "Claim your free guide", href: "/sign-in" };
    if (loading) return { label: "Loading...", href: "#" };
    if (!claim)
      return { label: "You qualify for a free safari guide", href: "/books" };
    return {
      label: "Book a discovery call",
      href: "https://bookings.fairtradesafaris.com/",
    };
  };
  const content = getContent();

  // Debugging: log pulse value
  console.log("pulse state is", pulse);

  return (
    <div
      onClick={() => router.push(content.href)}
      className="fixed bottom-4 left-4 z-[9999] cursor-pointer group"
      aria-label={content.label}
      style={{ pointerEvents: loading ? "none" : undefined }}
    >
      <div
        className={[
          "flex items-center gap-2 md:gap-3",
          "bg-[#F8ECD7] border border-[#D6BE9F] rounded-2xl",
          "px-3 py-2 md:px-5 md:py-3 shadow-md",
          "transition-all duration-200 hover:shadow-lg",
          pulse ? "animate-bounce" : "",
          "animate-fadeInUp",
        ].join(" ")}
      >
        <Gift size={20} className="text-[#A3783C] hidden md:block" />
        <span className="text-[#564227] font-medium text-sm md:text-base">
          {content.label}
        </span>
      </div>
    </div>
  );
}
