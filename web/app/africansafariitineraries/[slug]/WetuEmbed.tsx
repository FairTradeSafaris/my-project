"use client";

// Batch 4: the Wetu itinerary iframe pulls ~20 MB (JS bundles, reCAPTCHA, a
// 2.7 MB logo) and was loaded on page load even with loading="lazy". It now
// loads only after the page itself has finished loading (window load + idle),
// and then only once the box is near the viewport, or straight away on click.
// On mobile the box starts ~600px down, i.e. in the first screen, so waiting
// for "load" is what keeps it from competing with the hero image and the
// page's own JS. Same 800px bordered box, so the page looks the same once
// it has loaded.

import { useEffect, useRef, useState } from "react";

export default function WetuEmbed({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (load) return;
    const el = boxRef.current;
    let io: IntersectionObserver | undefined;
    let idleId: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const observe = () => {
      if (!el || typeof IntersectionObserver === "undefined") {
        setLoad(true);
        return;
      }
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setLoad(true);
            io?.disconnect();
          }
        },
        { rootMargin: "300px 0px" },
      );
      io.observe(el);
    };
    const afterIdle = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(observe, { timeout: 1500 });
      } else {
        timer = setTimeout(observe, 200);
      }
    };

    if (document.readyState === "complete") afterIdle();
    else window.addEventListener("load", afterIdle, { once: true });

    return () => {
      window.removeEventListener("load", afterIdle);
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timer) clearTimeout(timer);
      io?.disconnect();
    };
  }, [load]);

  return (
    <div
      ref={boxRef}
      className="border rounded-2xl overflow-hidden shadow-md"
    >
      {load ? (
        <iframe
          src={src}
          title={`${title}: day-by-day itinerary`}
          className="w-full h-[800px]"
          style={{ border: "none" }}
          allowFullScreen
        />
      ) : (
        <div className="w-full h-[800px] flex flex-col items-center justify-center gap-4 bg-[#FAF4EC] text-center px-6">
          <p className="text-gray-700">Loading the day-by-day itinerary…</p>
          <button
            type="button"
            onClick={() => setLoad(true)}
            className="bg-[#C8B08A] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#b79e74] transition"
          >
            Show the itinerary now
          </button>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-700 underline"
          >
            Open it in a new tab
          </a>
        </div>
      )}
    </div>
  );
}
