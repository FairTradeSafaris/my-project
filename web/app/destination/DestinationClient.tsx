// app/destination/DestinationClient.tsx
"use client";

import { useEffect, useState } from "react";
import { Binoculars, PhoneCall, Info, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dancing_Script } from "next/font/google";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const dancingScript = Dancing_Script({ subsets: ["latin"], weight: ["700"] });

type PTBlock = PortableTextBlock;

type PracticalSection = {
  title?: string;
  content?: PTBlock;
};

type Destination = {
  slug?: { current?: string };
  title: string;
  image?: string; // hero image URL
  subtitle?: string;
  description?: string;
  // optional (not in schema, but harmless if provided later)
  price?: string;
  bestTime?: string;
  highSeason?: string;
  rating?: number;
  reviews?: number;
  // real fields
  flagImage?: string;
  region?: string;
  tags?: string[];
  ranking?: number;
  featured?: boolean;
  mapLocation?: string; // used for map embed
  gallery?: string[];
  // about panel fields
  travelInfo?: PTBlock;
  highlights?: PTBlock;
  practicalStuff?: PracticalSection[];
  didYouKnowImage?: string;
  didYouKnowText?: string;
};

export default function DestinationClient({
  initialDestinations = [],
}: {
  initialDestinations?: Destination[];
}) {
  const destinations: Destination[] = Array.isArray(initialDestinations)
    ? initialDestinations
    : [];

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // existing journey drawer (URL-driven)
  const isOpen = searchParams.get("open") === "true";
  const journeyQuery = searchParams.get("q") || "";

  // new: About panel state
  const [aboutOpen, setAboutOpen] = useState(false);

  const [selected, setSelected] = useState<Destination | null>(
    destinations[0] ?? null
  );
  const [formattedReviews, setFormattedReviews] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (!selected && destinations.length > 0) {
      setSelected(destinations[0]);
    }
  }, [destinations, selected]);

  useEffect(() => {
    if (selected?.reviews)
      setFormattedReviews(selected.reviews.toLocaleString());
    else setFormattedReviews("");
  }, [selected]);

  const openPanel = (q: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", q);
    params.set("open", "true");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closePanel = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("open");
    const next = params.toString();
    const href = next ? `${pathname}?${next}` : pathname;
    router.push(href, { scroll: false });
  };

  if (destinations.length === 0) {
    return (
      <main className="min-h-screen grid place-items-center bg-[var(--background)] text-[var(--foreground)] p-10">
        <div className="text-center max-w-lg">
          <h1 className="text-2xl font-semibold mb-2">No destinations yet</h1>
          <p className="text-sm opacity-80">
            Please add destinations in the CMS or ensure this page is receiving
            the <code>initialDestinations</code> prop.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-0 min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/sunset-safari.webp')` }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight drop-shadow-xl font-bold">
            Safari. Reimagined.
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-xl">
            Travel with purpose. Explore Africa with heart.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[calc(100vh-400px)]">
        {/* Sidebar */}
        <nav className="w-full md:w-72 bg-[var(--surface-dark)] border-b md:border-b-0 md:border-r border-[var(--border)]">
          <h2 className="text-xl font-semibold p-4 sm:p-6 border-b border-[var(--border)]">
            Top-rated Safari Countries
          </h2>
          <ul className="overflow-x-auto flex md:block whitespace-nowrap md:whitespace-normal no-scrollbar">
            {destinations.map((dest, i) => (
              <li
                key={dest.slug?.current ?? `${dest.title}-${i}`}
                onClick={() => {
                  setSelected(dest);
                  setAboutOpen(false); // close About when switching
                }}
                className={`cursor-pointer px-4 sm:px-6 py-3 border-b border-[var(--border)] flex items-center select-none transition-all duration-200 ${
                  selected?.slug?.current === dest.slug?.current
                    ? "bg-[var(--accent)] text-[var(--background)] font-semibold"
                    : "text-[var(--onSurface-light)] hover:bg-[var(--accent)] hover:text-[var(--background)]"
                }`}
              >
                <span className="mr-2 text-[var(--background)]">#{i + 1}</span>
                {dest.flagImage && (
                  <img
                    src={dest.flagImage}
                    alt={`${dest.title} flag`}
                    className="w-6 h-auto mr-2 object-contain inline-block"
                  />
                )}
                {dest.title}
              </li>
            ))}
          </ul>
        </nav>

        {/* Detail Content */}
        <section className="relative flex-1 p-6 md:p-10 text-white min-h-[calc(100vh-400px)] flex flex-col">
          {/* Background image */}
          <div className="absolute inset-0 w-full h-full">
            {selected?.image && (
              <Image
                src={selected.image}
                alt={`${selected.title} background`}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Foreground */}
          <div className="relative z-10 flex flex-col h-full min-h-[450px]">
            <div className="flex-1 space-y-6">
              {/* Country Name & Badge */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2
                  className={`text-5xl leading-tight drop-shadow-md ${dancingScript.className}`}
                >
                  {selected?.title}
                </h2>
                <div className="bg-black/50 p-2 rounded-xl w-fit">
                  <Image
                    src="/badges/fair-trade-paw.png"
                    alt="Fair Trade Approved"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Subtitle / Description */}
              {selected?.subtitle && (
                <p className="italic text-lg text-white/80">
                  {selected.subtitle}
                </p>
              )}

              {selected?.description && (
                <p className="text-white leading-relaxed">
                  {selected.description}
                </p>
              )}

              {/* Info Grid (optional fields) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mt-6 text-white/90">
                {selected?.bestTime && (
                  <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                    <strong className="block text-white mb-1">
                      Best Time to Go
                    </strong>
                    {selected.bestTime}
                  </div>
                )}
                {selected?.highSeason && (
                  <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                    <strong className="block text-white mb-1">
                      High Season
                    </strong>
                    {selected.highSeason}
                  </div>
                )}
              </div>

              {/* Rating (optional) */}
              {typeof selected?.rating === "number" && (
                <div className="flex items-center space-x-2 text-yellow-300 mt-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={
                        i < Math.floor(selected?.rating ?? 0)
                          ? "currentColor"
                          : "#4b5563"
                      }
                      stroke="currentColor"
                    />
                  ))}
                  <span>{selected?.rating?.toFixed(1)}/5</span>
                  {selected?.reviews && (
                    <span className="ml-2 text-white/80">
                      {formattedReviews} reviews
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Gallery + Buttons */}
            <div>
              {selected?.gallery?.length ? (
                <section className="mt-14">
                  <div className="mb-4">
                    <span className="text-2xl">📸</span>
                    <h3 className="text-xl font-semibold inline-block ml-2 align-middle">
                      Photo Highlights
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {selected.gallery.map((img, i) => (
                      <div
                        key={`${img}-${i}`}
                        className="overflow-hidden rounded-lg border border-white/5 shadow-sm"
                      >
                        <Image
                          src={img}
                          alt={`Gallery image ${i + 1}`}
                          width={200}
                          height={150}
                          className="w-full h-[100px] sm:h-[120px] object-cover transition-transform hover:scale-105 rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Explore journeys (URL-driven drawer) */}
                <Button
                  onClick={() => selected && openPanel(selected.title)}
                  className="bg-[#E5D5B8] hover:bg-[#d4c3a3] text-black font-semibold text-base px-6 py-3 flex items-center gap-2"
                  disabled={!selected}
                >
                  <Binoculars size={18} />
                  Explore {selected?.title ?? "Country"} Itineraries
                </Button>

                {/* More About (module/panel) */}
                <Button
                  variant="outline"
                  className="border-[#E5D5B8] text-[#E5D5B8] hover:bg-[#E5D5B8] hover:text-black font-semibold text-base px-6 py-3 flex items-center gap-2"
                  onClick={() => setAboutOpen(true)}
                  disabled={!selected}
                >
                  <Info size={18} />
                  More About {selected?.title ?? "Country"}
                </Button>

                {/* Discovery Call */}
                <Button
                  variant="ghost"
                  className="text-white hover:underline text-base px-6 py-3 flex items-center gap-2"
                  onClick={() => setBookingOpen(true)}
                >
                  <PhoneCall size={18} />
                  Book a Discovery Call
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ---------- ABOUT PANEL (wider, hero + map) ---------- */}
      {aboutOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setAboutOpen(false)}
            className="fixed inset-0 bg-black/50 z-[1100] transition-opacity"
            aria-hidden="true"
          />
          {/* Panel */}
          <aside
            className="
              fixed right-0 top-0 h-screen
              w-full
              sm:w-[640px]
              md:w-[800px]
              lg:w-[1024px]
              xl:w-[1200px]
              2xl:w-[1400px]
              bg-white z-[1200] shadow-2xl border-l border-neutral-200
              flex flex-col
            "
            role="dialog"
            aria-modal="true"
          >
            {/* HERO inside panel */}
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
                {selected?.region && (
                  <p className="text-white/80 text-sm mt-1">
                    {selected.region}
                  </p>
                )}
              </div>
              {/* Close button overlays hero */}
              <button
                type="button"
                onClick={() => setAboutOpen(false)}
                className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full w-10 h-10 bg-white/90 text-neutral-700 hover:bg-white"
                aria-label="Close panel"
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Flag / meta row */}
              <div className="px-6 pt-6 flex items-center gap-3">
                {selected?.flagImage ? (
                  <img
                    src={selected.flagImage}
                    alt={`${selected.title} flag`}
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

              {/* Did You Know */}
              {(selected?.didYouKnowImage || selected?.didYouKnowText) && (
                <section className="px-6 mt-6">
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-4 items-start">
                    {selected.didYouKnowImage && (
                      <img
                        src={selected.didYouKnowImage}
                        alt="Did you know"
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

              {/* Travel Info */}
              {selected?.travelInfo && (
                <section className="px-6 mt-8">
                  <h4 className="text-lg font-semibold mb-2 text-neutral-900">
                    Travel Information
                  </h4>
                  <div className="prose prose-neutral max-w-none">
                    <PortableText value={selected.travelInfo} />
                  </div>
                </section>
              )}

              {/* Highlights */}
              {selected?.highlights && (
                <section className="px-6 mt-8">
                  <h4 className="text-lg font-semibold mb-2 text-neutral-900">
                    Highlights
                  </h4>
                  <div className="prose prose-neutral max-w-none">
                    <PortableText value={selected.highlights} />
                  </div>
                </section>
              )}

              {/* Practical Info */}
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
                            <PortableText value={sec.content} />
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Map (NEW in panel) */}
              {selected?.mapLocation && (
                <section className="px-6 mt-8 mb-10">
                  <h4 className="text-lg font-semibold mb-2 text-neutral-900">
                    Map
                  </h4>
                  <div className="rounded-lg border border-neutral-200 overflow-hidden">
                    <iframe
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        selected.mapLocation
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
        </>
      )}

      {/* ---------- JOURNEY PANEL (existing) ---------- */}
      {isOpen && (
        <>
          <div
            onClick={closePanel}
            className="fixed inset-0 bg-black/50 z-[1100] transition-opacity"
            aria-hidden="true"
          />
          <aside
            className="fixed right-0 top-0 h-screen w-full sm:w-[560px] md:w-[720px] lg:w-[840px] xl:w-[960px] bg-white z-[1200] shadow-2xl border-l border-neutral-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Journey
                </p>
                <h3
                  className="truncate font-semibold text-lg text-neutral-900"
                  title={journeyQuery}
                >
                  {journeyQuery || "Selected Itinerary"}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={{
                    pathname: "/journey",
                    query: { q: journeyQuery, open: "true" },
                  }}
                  className="text-sm underline text-neutral-600 hover:text-neutral-900"
                >
                  Open full page
                </Link>

                <button
                  type="button"
                  onClick={closePanel}
                  className="ml-2 inline-flex items-center justify-center rounded-full w-9 h-9 border border-neutral-200 hover:bg-neutral-50"
                  aria-label="Close panel"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="h-[calc(100vh-57px)]">
              <iframe
                key={journeyQuery}
                src={`/journey?q=${encodeURIComponent(journeyQuery)}&open=true`}
                className="w-full h-full"
                title="Journey"
              />
            </div>
          </aside>
        </>
      )}

      {/* ---------- DISCOVERY CALL SHEET ---------- */}
      {bookingOpen && (
        <>
          <div
            className="fixed inset-0 z-[1300] bg-black/50"
            onClick={() => setBookingOpen(false)}
          />
          <div
            className="fixed top-0 right-0 h-full w-full sm:w-[90vw] md:w-[85vw] lg:w-[75vw] bg-white shadow-2xl z-[1400]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-[#f2e7db]">
              <div className="flex items-center gap-3">
                <img
                  src="/logos/logo-top.png"
                  alt="Fair Trade Safaris"
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

            {/* Iframe */}
            <iframe
              src="https://bookings.fairtradesafaris.com/portal-embed#/fairtradesafaris"
              className="w-full h-[calc(100%-56px)]"
              style={{ border: "none" }}
              allowFullScreen
              loading="lazy"
              title="Fair Trade Safaris Booking"
            />
          </div>
        </>
      )}
    </main>
  );
}
