// components/LeadMagnet.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Gift, X } from "lucide-react";

type Claim = { bookTitle: string; bookUrl: string };

export default function LeadMagnet() {
  const { isSignedIn, user } = useUser();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);

  const router = useRouter();
  const pulseTimeout = useRef<NodeJS.Timeout | null>(null);

  // pulse
  useEffect(() => {
    setPulse(true);
    pulseTimeout.current = setTimeout(() => setPulse(false), 800);
    const interval = setInterval(() => {
      setPulse(true);
      pulseTimeout.current = setTimeout(() => setPulse(false), 800);
    }, 30000);
    return () => {
      clearInterval(interval);
      if (pulseTimeout.current) clearTimeout(pulseTimeout.current);
    };
  }, []);

  // claim status
  useEffect(() => {
    if (!user?.id || !isSignedIn) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/claim-status?userId=${user.id}`);
        const data = await res.json();
        setClaim(data.claim || null);
      } catch (e) {
        console.error("❌ claim-status", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id, isSignedIn]);

  // computed CTA
  const content = useMemo(() => {
    if (!isSignedIn)
      return { label: "Claim your free guide", href: "/sign-in" };
    if (loading) return { label: "Loading...", href: "#" };
    if (!claim)
      return { label: "You qualify for a free safari guide", href: "/books" };
    return {
      label: "Book a discovery call",
      href: "https://bookings.fairtradesafaris.com/",
    };
  }, [isSignedIn, loading, claim]);

  // open from floating (desktop only)
  const handleOpen = () => {
    const isDiscoverCall = content.href.includes(
      "bookings.fairtradesafaris.com"
    );
    if (isDiscoverCall) {
      setIframeReady(false);
      setShowModal(true);
    } else if (content.href !== "#") {
      router.push(content.href);
    }
  };

  // esc / body lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setShowModal(false);
    if (showModal) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [showModal]);

  return (
    <>
      {/* Floating bubble — HIDDEN on mobile */}
      <div
        onClick={handleOpen}
        className="hidden md:block fixed bottom-4 left-4 z-[9999] cursor-pointer group"
        aria-label={content.label}
        style={{ pointerEvents: loading ? "none" : undefined }}
      >
        <div
          className={[
            "flex items-center gap-3 bg-[#F8ECD7] border border-[#D6BE9F] rounded-2xl",
            "px-5 py-3 shadow-md transition-all duration-200 hover:shadow-lg",
            pulse ? "animate-bounce" : "",
            "animate-fadeInUp",
          ].join(" ")}
        >
          <Gift size={20} className="text-[#A3783C]" />
          <span className="text-[#564227] font-medium text-base">
            {content.label}
          </span>
        </div>
      </div>

      {/* Shared modal (also used from BottomTabBar) */}
      {showModal && (
        <div
          className="fixed inset-0 z-[10000] bg-black/50"
          onClick={() => setShowModal(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute top-0 right-0 h-full w-full sm:w-[90vw] md:w-[80vw] lg:w-[70vw] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#f2e7db] border-b border-gray-200 shadow-md relative px-4 pt-4 pb-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-2xl font-bold text-gray-800 hover:text-black"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:pr-10 gap-4">
                <img
                  src="/logos/logo-top.png"
                  alt="Fair Trade Safaris"
                  className="h-10 w-auto"
                />
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                    Discovery Call
                  </h2>
                  <p className="text-sm text-gray-600">
                    Pick a time that works for you.
                  </p>
                </div>
              </div>
            </div>

            {!iframeReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/70 rounded-md px-4 py-2 text-sm text-gray-700 shadow">
                  Loading scheduler…
                </div>
              </div>
            )}
            <iframe
              src="https://bookings.fairtradesafaris.com/portal-embed#/fairtradesafaris"
              className="w-full h-[calc(100%-80px)]"
              style={{ border: "none" }}
              allowFullScreen
              loading="lazy"
              onLoad={() => setIframeReady(true)}
            />
          </div>
        </div>
      )}
    </>
  );
}
