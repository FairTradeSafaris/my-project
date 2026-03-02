"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoTestimonial } from "./VideoTestimonials";
import Image from "next/image";
import Link from "next/link";

export default function VideoTestimonialCard({
  testimonial,
}: {
  testimonial: VideoTestimonial;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Card container */}
      <div
        className="relative w-full max-w-sm cursor-pointer rounded-xl overflow-hidden shadow-md group"
        onClick={() => setOpen(true)}
      >
        {/* Thumbnail Image with Overlay */}
        <div className="w-full aspect-square relative">
          <Image
            src={testimonial.thumbnailUrl || "/fallback.jpg"}
            alt={`Preview of ${testimonial.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white text-black p-2 rounded-full shadow-md">
            ▶
          </div>
        </div>

        {/* Quote box */}
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 shadow-xl border border-gray-200 rounded-xl z-30 flex flex-col">
          <p className="italic text-sm text-gray-700 leading-snug line-clamp-2">
            “{testimonial.quote}”
          </p>

          <p className="text-xs text-gray-500 mt-2">
            – {testimonial.name}, {testimonial.location}
          </p>

          <Link
            href={`/videoTestimonial/${testimonial.slug}`}
            className="text-xs text-green-700 mt-2 underline hover:text-green-900"
            onClick={(e) => e.stopPropagation()}
          >
            View dedicated video page →
          </Link>
        </div>
      </div>

      {/* Modal Player */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-6xl h-[80vh] px-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={testimonial.videoUrl}
                className="w-full h-full rounded-xl"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={`Testimonial video from ${testimonial.name}`}
              />
              <button
                className="absolute top-2 right-2 text-white text-3xl font-bold"
                onClick={() => setOpen(false)}
                aria-label="Close video"
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
