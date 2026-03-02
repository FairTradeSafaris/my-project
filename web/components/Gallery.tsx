"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type GalleryImage = {
  url: string;
  alt?: string;
  caption?: string;
  credit?: string;
};

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  if (!images?.length) return null;

  return (
    <>
      <section className="w-full py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Photo Highlights
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className="overflow-hidden rounded-xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setSelected(img)}
            >
              <Image
                src={img.url}
                alt={img.alt || `Gallery image ${i + 1}`}
                width={400}
                height={300}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
              {(img.caption || img.credit) && (
                <div className="mt-2 text-center px-2 text-sm text-gray-600">
                  {img.caption && <p>{img.caption}</p>}
                  {img.credit && (
                    <p className="text-xs text-gray-500 italic mt-1">
                      Photo credit: {img.credit}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal for enlarged image */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <div className="relative">
            <Image
              src={selected.url}
              alt={selected.alt || "Enlarged view"}
              width={1000}
              height={700}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg shadow-lg"
            />
            {selected.caption && (
              <p className="text-white text-center mt-4 max-w-lg mx-auto">
                {selected.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
