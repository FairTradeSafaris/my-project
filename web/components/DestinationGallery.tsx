"use client";

import Image from "next/image";
import { Images } from "lucide-react";
import { createPortal } from "react-dom";

type Props = {
  gallery: string[];
  isOpen: boolean;
  currentIndex: number;
  onOpen: (index?: number) => void;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
  dockBottom: number;
};

export default function DestinationGallery({
  gallery,
  isOpen,
  currentIndex,
  onOpen,
  onClose,
  onChangeIndex,
  dockBottom,
}: Props) {
  if (!gallery?.length) return null;

  const images = gallery.filter(
    (img) =>
      typeof img === "string" &&
      img.startsWith("http") &&
      /\.(jpe?g|png|webp|avif)$/i.test(img),
  );

  return (
    <>
      {/* Desktop floating dock */}
      <div className="hidden md:block pointer-events-none">
        <div
          className="absolute left-6 right-6 transition-all"
          style={{ bottom: dockBottom }}
        >
          <div className="pointer-events-auto backdrop-blur-sm bg-black/30 border border-white/10 rounded-2xl px-3 py-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-white">
                <span className="text-xl">📸</span>
                <span className="font-semibold">Photo Highlights</span>
              </div>
              <button
                onClick={() => onOpen(0)}
                className="text-sm underline hover:no-underline text-white"
              >
                Open gallery
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {images.slice(0, 10).map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  className="shrink-0 w-28 h-20 rounded-md overflow-hidden border border-white/10"
                  onClick={() => onOpen(i)}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    width={160}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile section */}
      <div className="md:hidden mt-10">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Images size={18} />
          Photo Highlights
        </h3>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {images.slice(0, 8).map((img, i) => (
            <button
              key={`${img}-${i}`}
              className="shrink-0 w-48 h-32 rounded-xl overflow-hidden border border-white/10"
              onClick={() => onOpen(i)}
            >
              <Image
                src={img}
                alt={`Photo highlight ${i + 1}`}
                width={384}
                height={256}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        <button
          onClick={() => onOpen(0)}
          className="mt-3 text-sm underline text-white/80 hover:text-white"
        >
          View all photos →
        </button>
      </div>

      {/* Modal */}
      {isOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
              onClick={onClose}
            />

            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white text-black font-bold"
              >
                ×
              </button>

              <div className="relative w-full max-w-5xl aspect-[16/9] rounded-xl overflow-hidden bg-black">
                <Image
                  src={images[currentIndex]}
                  alt={`Gallery image ${currentIndex + 1}`}
                  fill
                  priority
                  className="object-cover"
                />

                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                  onClick={() =>
                    onChangeIndex(
                      currentIndex === 0 ? images.length - 1 : currentIndex - 1,
                    )
                  }
                >
                  ←
                </button>

                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                  onClick={() =>
                    onChangeIndex(
                      currentIndex === images.length - 1 ? 0 : currentIndex + 1,
                    )
                  }
                >
                  →
                </button>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
