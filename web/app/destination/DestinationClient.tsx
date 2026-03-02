"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import Image from "next/image";
import Link from "next/link";

import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import CountryTabs from "@/components/CountryTabs";

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------
const AUTOPLAY_MS = 10_000;
const USER_PAUSE_MS = 30_000;
// ----------------------------------------------------------------------------
// Types (local to this component)
// ----------------------------------------------------------------------------
export type PTBlock = PortableTextBlock;

export type PracticalSection = { title?: string; content?: PTBlock };

export type Destination = {
  slug?: { current?: string } | null; // incoming data might include null
  title: string;
  image?: string | null;
  subtitle?: string | null;
  description?: string | null;
  bestTime?: string | null;
  highSeason?: string | null;
  rating?: number | null;
  reviews?: number | null;
  flagImage?: string | null;
  tags?: string[] | null;
  mapLocation?: string | null;
  gallery?: string[] | null;
  travelInfo?: PTBlock | null;
  highlights?: PTBlock | null;
  practicalStuff?: PracticalSection[] | null;
  didYouKnowImage?: string | null;
  didYouKnowText?: string | null;
};

// CountryTabs expects slug?: { current?: string } | undefined (no null).
type TabDestination = {
  title: string;
  slug?: { current?: string };
  flagImage?: string;
};

// ----------------------------------------------------------------------------
// Portal helper
// ----------------------------------------------------------------------------
function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
import type {
  PortableTextComponents,
  PortableTextBlockComponent,
  PortableTextListComponent,
  PortableTextMarkComponent,
} from "@portabletext/react";

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: (({ children }) => (
      <h1 className="text-3xl font-bold mt-6 mb-4">{children}</h1>
    )) as PortableTextBlockComponent,
    h2: (({ children }) => (
      <h2 className="text-2xl font-semibold mt-5 mb-3">{children}</h2>
    )) as PortableTextBlockComponent,
    normal: (({ children }) => (
      <p className="mb-4">{children}</p>
    )) as PortableTextBlockComponent,
  },
  list: {
    bullet: (({ children }) => (
      <ul className="list-disc pl-6 mb-4">{children}</ul>
    )) as PortableTextListComponent,
    number: (({ children }) => (
      <ol className="list-decimal pl-6 mb-4">{children}</ol>
    )) as PortableTextListComponent,
  },
  marks: {
    strong: (({ children }) => (
      <strong className="font-semibold">{children}</strong>
    )) as PortableTextMarkComponent,
    em: (({ children }) => (
      <em className="italic">{children}</em>
    )) as PortableTextMarkComponent,
  },
};

export default function DestinationClient({
  initialDestinations = [],
}: {
  initialDestinations?: Destination[];
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const destinations: Destination[] = useMemo(() => {
    return Array.isArray(initialDestinations)
      ? initialDestinations.filter(Boolean)
      : [];
  }, [initialDestinations]);
  useEffect(() => {
    console.log("INITIAL DESTINATIONS:", initialDestinations);
    console.log("PROCESSED DESTINATIONS:", destinations);
  }, [initialDestinations, destinations]);

  const tabItems: TabDestination[] = useMemo(() => {
    return destinations.map((d) => ({
      title: d.title,
      slug: d.slug ?? undefined,
      flagImage: d.flagImage ?? undefined,
    }));
  }, [destinations]);

  const prefersReducedMotion = usePrefersReducedMotion();

  // panels / sheets
  const [aboutOpen, setAboutOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  // selection (index-based to make autoplay robust)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = destinations[selectedIndex] ?? null;
  useEffect(() => {
    console.log("SELECTED OBJECT:", selected);
    console.log("IMAGE URL:", selected?.image);
  }, [selected]);
  useEffect(() => {
    console.log("INITIAL DESTINATIONS:", initialDestinations);
    console.log("PROCESSED DESTINATIONS:", destinations);
  }, [initialDestinations, destinations]);

  useEffect(() => {
    console.log("SELECTED:", selected);
  }, [selected]);
  // cross-fade support

  // autoplay control
  const [userPausedUntil, setUserPausedUntil] = useState<number>(0);

  // dock positioning (avoid covering CTAs)

  // guard selectedIndex when list changes

  // smooth background fade when country changes

  // measure CTA block; keep dock just above it

  const canAutoplay =
    !prefersReducedMotion &&
    !aboutOpen &&
    !bookingOpen &&
    !galleryOpen &&
    Date.now() > userPausedUntil &&
    destinations.length > 1;

  useEffect(() => {
    if (!canAutoplay) return;
    const id = window.setInterval(() => {
      setSelectedIndex((cur) => (cur + 1) % destinations.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [destinations.length, canAutoplay]);

  // manual select pauses autoplay for 30s
  const handleSelect = (d: Destination) => {
    const i = destinations.findIndex((x) => {
      const slugMatch =
        x.slug?.current && d.slug?.current
          ? x.slug.current === d.slug.current
          : false;
      return slugMatch || x.title === d.title;
    });
    setSelectedIndex(i >= 0 ? i : 0);
    setAboutOpen(false);
    setUserPausedUntil(Date.now() + USER_PAUSE_MS);
  };

  const anyOverlayOpen = aboutOpen || bookingOpen || galleryOpen;
  useEffect(() => {
    if (typeof document === "undefined") return;
    const { body } = document;
    if (anyOverlayOpen) {
      const original = body.style.overflow;
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = original;
      };
    }
  }, [anyOverlayOpen]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (galleryOpen) setGalleryOpen(false);
        if (aboutOpen) setAboutOpen(false);
        if (bookingOpen) setBookingOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [galleryOpen, aboutOpen, bookingOpen]);

  if (!destinations.length) {
    return (
      <main className="min-h-screen grid place-items-center bg-[var(--background)] text-[var(--foreground)] p-10">
        <div className="text-center max-w-lg">
          <h1 className="text-2xl font-semibold mb-2">No destinations yet</h1>
          <p className="text-sm opacity-80">
            Please add destinations in the CMS.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative bg-[var(--background)] text-[var(--foreground)]">
      {/* Mobile sticky chips */}
      {/* Elegant Intro Transition */}
      {/* Breadcrumb */}
      <div className="w-full bg-[#f2e7db] border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-3 text-sm text-black/60">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/" className="hover:text-black transition">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href="/destination/"
                  className="hover:text-black transition"
                >
                  Destination
                </Link>
              </li>
              {selected?.title && (
                <>
                  <li>/</li>
                  <li className="text-black font-medium">{selected.title}</li>
                </>
              )}
            </ol>
          </nav>
        </div>
      </div>
      <section className="relative bg-gradient-to-b from-[#f8f5f0] to-[#f2e7db] py-8 md:py-12 border-b border-black/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#2F3E46] tracking-wide">
            Discover Africa’s Finest Safari Countries
          </h2>

          <p className="mt-4 text-base md:text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
            Each destination offers its own rhythm — wildlife migrations,
            dramatic landscapes, cultural richness, and meaningful travel
            experiences.
          </p>

          <div className="mt-8 w-20 h-[2px] bg-[#2F3E46] mx-auto opacity-40" />
        </div>
      </section>
      <div className="md:hidden sticky top-0 z-20 bg-[#f2e7db] border-b border-[var(--border)]">
        <h2 className="text-base font-semibold px-4 py-3">
          Top-rated Safari Countries
        </h2>
        <CountryTabs
          items={tabItems}
          selectedSlug={selected?.slug?.current ?? undefined}
          onSelect={(d) => handleSelect(d as Destination)}
        />
      </div>

      <div className="w-full relative">
        {
          <div className="relative md:h-[200vh]">
            <section className="relative w-full aspect-[16/10] md:h-screen text-white overflow-hidden md:sticky md:top-0">
              {/* Background */}
              {/* Sidebar (desktop only) */}
              <nav
                className="hidden md:flex absolute left-0 top-0 h-full w-72 z-40
  flex-col justify-center
  backdrop-blur-xl bg-black/40 border-r border-white/10 
  text-white shadow-2xl"
                aria-label="Top-rated Safari Countries"
              >
                <h2 className="text-lg font-semibold px-6 mb-4">
                  Top-rated Safari Countries
                </h2>
                <ul className="space-y-1">
                  {destinations.map((dest, i) => (
                    <li key={dest.slug?.current ?? `${dest.title}-${i}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIndex(i);
                          setUserPausedUntil(Date.now() + USER_PAUSE_MS);
                        }}
                        className={`w-full text-left px-6 py-3 flex items-center gap-2 transition
            ${
              selectedIndex === i
                ? "bg-[#E5D5B8] text-black font-semibold"
                : "hover:bg-white/10"
            }`}
                      >
                        {dest.flagImage && (
                          <Image
                            src={dest.flagImage}
                            alt={`${dest.title} flag`}
                            width={24}
                            height={16}
                            className="w-6 h-4 object-cover rounded-[2px]"
                          />
                        )}
                        <span className="truncate">{dest.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="absolute inset-0 z-0">
                {selected?.image && (
                  <Image
                    src={selected.image}
                    alt={selected.title ?? "Safari landscape"}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center md:object-center"
                  />
                )}

                {/* Luxury gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
              </div>

              {/* Content Wrapper */}
              <div className="relative z-30 w-full md:pl-72 px-6 pt-16 pb-10 h-full flex flex-col justify-end">
                {/* Top Content */}
                <div className="max-w-2xl space-y-6 mt-24 md:mt-0">
                  <h2
                    className="absolute 
  bottom-10 left-6
  md:top-32 md:bottom-auto md:left-[20rem]
  z-40
  text-3xl md:text-6xl lg:text-7xl
  font-semibold
  uppercase tracking-[0.2em]
  text-white
  drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
                  >
                    {selected?.title}
                  </h2>

                  {selected?.subtitle && (
                    <p className="text-lg md:text-xl text-white/80 italic">
                      {selected.subtitle}
                    </p>
                  )}

                  {selected?.description && (
                    <p className="text-white/90 leading-relaxed">
                      {selected.description}
                    </p>
                  )}
                </div>

                {/* Bottom Dock Area */}
                <div className="mt-16 space-y-6">
                  {/* Photo Highlights Dock */}
                  {selected?.gallery?.length ? (
                    <div className="hidden md:block absolute top-[58%] right-20 -translate-y-1/2 w-[500px] max-w-[85%] z-30">
                      <div className="bg-gradient-to-r from-black/70 via-black/60 to-black/40 bg-gradient-to-r from-black/70 via-black/60 to-black/40 border border-white/10 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                        <div className="text-lg font-semibold mb-4">
                          Highlights
                        </div>
                        {(selected?.bestTime || selected?.highSeason) && (
                          <div className="flex flex-wrap gap-3 mb-4">
                            {selected?.bestTime && (
                              <div className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs text-white/90">
                                <span className="text-white/60 mr-1">
                                  Best Time:
                                </span>
                                {selected.bestTime}
                              </div>
                            )}

                            {selected?.highSeason && (
                              <div className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs text-white/90">
                                <span className="text-white/60 mr-1">
                                  High Season:
                                </span>
                                {selected.highSeason}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4 pb-5">
                          {selected.gallery.slice(0, 6).map((img, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setGalleryOpen(true);
                                setCurrentImageIndex(i);
                              }}
                              className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-white/10 hover:scale-105 transition-transform duration-300"
                            >
                              <Image
                                src={img}
                                alt={`Thumbnail ${i + 1}`}
                                width={320}
                                height={220}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                        <div className="pt-6 flex flex-col gap-3">
                          {selected?.slug?.current && (
                            <Link
                              href={`/africansafariitineraries?q=${selected.slug.current}`}
                              className="w-full text-center px-8 py-3 bg-[#E5D5B8] text-black font-semibold rounded-lg hover:bg-[#d4c3a3] transition shadow-md"
                            >
                              Explore Itineraries
                            </Link>
                          )}

                          {selected?.slug?.current && (
                            <Link
                              href={`/destination/${selected.slug.current}/`}
                              className="w-full text-center px-8 py-3 border border-white/30 text-white rounded-lg hover:bg-white hover:text-black transition"
                            >
                              More About {selected?.title}
                            </Link>
                          )}

                          <button
                            onClick={() => setBookingOpen(true)}
                            className="w-full text-center px-8 py-3 text-white/80 hover:text-white underline underline-offset-4 transition"
                          >
                            Book a Discovery Call
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* CTAs */}
                </div>
              </div>
            </section>{" "}
          </div>
        }
      </div>
      {/* ---------- MOBILE EDITORIAL HIGHLIGHTS ---------- */}
      {/* ---------- MOBILE EDITORIAL HIGHLIGHTS ---------- */}
      {selected?.gallery?.length && (
        <section className="md:hidden bg-[#efe4d3] text-black py-5">
          <div className="max-w-xl mx-auto px-6">
            {/* Section Intro */}
            <div className="mb-12">
              <p className="uppercase tracking-widest text-xs text-black/50 mb-3">
                Discover
              </p>
              <h3 className="text-3xl font-semibold leading-tight">
                Highlights of {selected?.title}
              </h3>
              <div className="mt-6 w-16 h-[2px] bg-black/30" />
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4 mb-14">
              {selected.gallery.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setGalleryOpen(true);
                    setCurrentImageIndex(i);
                  }}
                  className="aspect-[4/3] rounded-xl overflow-hidden shadow-md"
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* CTA Stack */}
            <div className="flex flex-col gap-4">
              {selected?.slug?.current && (
                <Link
                  href={`/africansafariitineraries?q=${selected.slug.current}`}
                  className="w-full text-center px-6 py-3 bg-[#E5D5B8] text-black font-semibold rounded-lg shadow-sm"
                >
                  Explore Itineraries
                </Link>
              )}

              {selected?.slug?.current && (
                <Link
                  href={`/destination/${selected.slug.current}/`}
                  className="w-full text-center px-6 py-3 border border-black/30 rounded-lg"
                >
                  More About {selected?.title}
                </Link>
              )}

              <button
                onClick={() => setBookingOpen(true)}
                className="text-center underline underline-offset-4 text-black/70"
              >
                Book a Discovery Call
              </button>
            </div>
          </div>
        </section>
      )}
      {/* ---------- GALLERY MODAL ---------- */}
      {galleryOpen && selected?.gallery?.length ? (
        <Portal>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
            onClick={() => setGalleryOpen(false)}
          />

          <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4">
            <button
              onClick={() => setGalleryOpen(false)}
              className="absolute top-6 right-6 z-[10000] w-10 h-10 rounded-full bg-white text-black hover:bg-neutral-200 font-bold text-lg shadow-md"
              aria-label="Close gallery"
            >
              ×
            </button>

            <div className="relative w-full max-w-5xl aspect-[16/9] rounded-xl overflow-hidden bg-black shadow-xl">
              <Image
                src={selected!.gallery![currentImageIndex]}
                alt={`Gallery image ${currentImageIndex + 1}`}
                fill
                sizes="100vw"
                priority
                className="object-cover transition-opacity duration-500"
              />

              {/* Image counter */}
              <div className="absolute bottom-3 right-4 text-sm text-white bg-black/50 px-2 py-1 rounded">
                {currentImageIndex + 1} / {selected!.gallery!.length}
              </div>

              {/* Left arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? selected!.gallery!.length - 1 : prev - 1,
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              >
                ←
              </button>

              {/* Right arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev === selected!.gallery!.length - 1 ? 0 : prev + 1,
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              >
                →
              </button>
            </div>
          </div>
        </Portal>
      ) : null}

      {/* ---------- ABOUT PANEL ---------- */}
      {aboutOpen && (
        <Portal>
          <div
            onClick={() => setAboutOpen(false)}
            className="fixed inset-0 bg-black/50 z-[1100]"
            aria-hidden="true"
          />
          <aside
            className="fixed right-0 top-0 h-[100dvh] w-full sm:w-[640px] md:w-[800px] lg:w-[1024px] xl:w-[1200px] bg-white z-[1200] shadow-2xl border-l border-neutral-200 flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative h-[220px] sm:h-[280px] md:h-[320px]">
              {selected?.image && (
                <Image
                  src={selected.image}
                  alt={`${selected.title} hero`}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="text-2xl sm:text-3xl font-semibold text-white">
                  {selected?.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAboutOpen(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 inline-flex items-center justify-center rounded-full w-10 h-10 bg-white/90 text-neutral-700 hover:bg-white"
                aria-label="Close panel"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="px-6 pt-6 flex items-center gap-3">
                {selected?.flagImage ? (
                  <Image
                    src={selected.flagImage}
                    alt={`${selected.title} flag`}
                    width={32}
                    height={20}
                    className="w-8 h-5 object-contain border border-neutral-200"
                  />
                ) : null}
                {selected?.tags?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.slice(0, 6).map((t, i) => (
                      <span
                        key={`${t}-${i}`}
                        className="text-xs rounded-full border border-neutral-200 px-2 py-1 text-neutral-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              {(selected?.didYouKnowImage || selected?.didYouKnowText) && (
                <section className="px-6 mt-6">
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-4 items-start">
                    {selected.didYouKnowImage && (
                      <Image
                        src={selected.didYouKnowImage}
                        alt="Did you know"
                        width={128}
                        height={96}
                        className="w-32 h-24 object-cover rounded-lg border border-yellow-100"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-1">
                        Did You Know?
                      </h4>
                      <p className="text-yellow-900/90 text-sm">
                        {selected?.didYouKnowText}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {selected?.travelInfo && (
                <section className="px-6 mt-8">
                  <h4 className="text-lg font-semibold mb-2 text-neutral-900">
                    Travel Information
                  </h4>
                  <div className="prose prose-neutral max-w-none">
                    <PortableText
                      value={selected.travelInfo}
                      components={portableTextComponents}
                    />
                  </div>
                </section>
              )}

              {selected?.highlights && (
                <section className="px-6 mt-8">
                  <h4 className="text-lg font-semibold mb-2 text-neutral-900">
                    Highlights
                  </h4>
                  <div className="prose prose-neutral max-w-none">
                    <PortableText
                      value={selected.highlights}
                      components={portableTextComponents}
                    />
                  </div>
                </section>
              )}

              {selected?.practicalStuff?.length ? (
                <section className="px-6 mt-8">
                  <h4 className="text-lg font-semibold mb-4 text-neutral-900">
                    Practical Info
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selected.practicalStuff.map((sec, idx) => (
                      <div
                        key={`${sec.title ?? "section"}-${idx}`}
                        className="border border-neutral-200 rounded-lg p-4"
                      >
                        {sec.title ? (
                          <h5 className="font-semibold text-neutral-900 mb-2">
                            {sec.title}
                          </h5>
                        ) : null}
                        {sec.content ? (
                          <div className="prose prose-neutral max-w-none">
                            <PortableText
                              value={sec.content}
                              components={portableTextComponents}
                            />
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {selected?.mapLocation && (
                <section className="px-6 mt-8 mb-10">
                  <h4 className="text-lg font-semibold mb-2 text-neutral-900">
                    Map
                  </h4>
                  <div className="rounded-lg border border-neutral-200 overflow-hidden">
                    <iframe
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        selected.mapLocation,
                      )}&output=embed`}
                      width="100%"
                      height="380"
                      allowFullScreen
                      loading="lazy"
                      title={`${selected.title} map`}
                    />
                  </div>
                </section>
              )}
            </div>
          </aside>
        </Portal>
      )}

      {/* ---------- DISCOVERY CALL ---------- */}
      {bookingOpen && (
        <Portal>
          <div
            className="fixed inset-0 z-[1100] bg-black/50"
            onClick={() => setBookingOpen(false)}
          />
          <div
            className="fixed top-0 right-0 h-full w-full sm:w-[90vw] md:w-[85vw] lg:w-[75vw] bg-white shadow-2xl z-[1200]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b bg-[#f2e7db]">
              <div className="flex items-center gap-3">
                <Image
                  src="/logos/logo-top.png"
                  alt="Fair Trade Safaris"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
                <span className="text-sm font-semibold text-gray-800">
                  Start Planning
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBookingOpen(false)}
                className="text-2xl leading-none font-bold text-gray-800 hover:text-black"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <iframe
              src="https://bookings.fairtradesafaris.com/portal-embed#/fairtradesafaris"
              className="w-full h-[calc(100%-56px)]"
              style={{ border: "none" }}
              allowFullScreen
              loading="lazy"
              title="Fair Trade Safaris Booking"
            />
          </div>
        </Portal>
      )}
    </main>
  );
}

// ---- Hook definition (needed for the call above) ----
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}
