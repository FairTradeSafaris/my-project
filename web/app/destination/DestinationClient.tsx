"use client";

import { useEffect, useRef, useState } from "react";
import { Binoculars, PhoneCall, Info, Star, Images } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dancing_Script } from "next/font/google";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import CountryTabs from "@/components/CountryTabs";

const dancingScript = Dancing_Script({ subsets: ["latin"], weight: ["700"] });

type PTBlock = PortableTextBlock;

type PracticalSection = { title?: string; content?: PTBlock };

type Destination = {
  slug?: { current?: string };
  title: string;
  image?: string;
  subtitle?: string;
  description?: string;
  bestTime?: string;
  highSeason?: string;
  rating?: number;
  reviews?: number;
  flagImage?: string;
  region?: string;
  tags?: string[];
  mapLocation?: string;
  gallery?: string[];
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

  // Journey drawer (URL-driven)
  const isOpen = searchParams.get("open") === "true";
  const journeyQuery = searchParams.get("q") || "";

  // panels / sheets
  const [aboutOpen, setAboutOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  // selection
  const [selected, setSelected] = useState<Destination | null>(
    destinations[0] ?? null
  );
  const [formattedReviews, setFormattedReviews] = useState("");

  // cross-fade support
  const [prevBg, setPrevBg] = useState<string | null>(null);
  const [fade, setFade] = useState(false);

  // autoplay control
  const AUTOPLAY_MS = 10000;
  const [userPausedUntil, setUserPausedUntil] = useState<number>(0);

  // dock positioning (avoid covering CTAs)
  const ctaRef = useRef<HTMLDivElement>(null);
  const [dockBottom, setDockBottom] = useState(24); // px from bottom

  // init selected
  useEffect(() => {
    if (!selected && destinations.length > 0) setSelected(destinations[0]);
  }, [destinations, selected]);

  // format reviews
  useEffect(() => {
    setFormattedReviews(
      selected?.reviews ? selected.reviews.toLocaleString() : ""
    );
  }, [selected]);

  // smooth background fade when country changes
  useEffect(() => {
    if (!selected?.image) return;
    setFade(true);
    const t = setTimeout(() => {
      setPrevBg(selected.image || null);
      setFade(false);
    }, 450);
    return () => clearTimeout(t);
  }, [selected?.image]);

  // measure CTA block; keep dock just above it
  useEffect(() => {
    if (!ctaRef.current) return;
    const ro = new ResizeObserver(() => {
      const h = ctaRef.current?.offsetHeight ?? 0;
      setDockBottom(h + 24); // 24px gutter
    });
    ro.observe(ctaRef.current);
    // initial
    setDockBottom((ctaRef.current?.offsetHeight ?? 0) + 24);
    return () => ro.disconnect();
  }, []);

  // autoplay loop (pauses while any panel/gallery is open or when user paused)
  const canAutoplay =
    !aboutOpen &&
    !isOpen &&
    !bookingOpen &&
    !galleryOpen &&
    Date.now() > userPausedUntil;

  useEffect(() => {
    if (!destinations.length || !canAutoplay) return;
    const id = setInterval(() => {
      setSelected((prev) => {
        const cur = prev
          ? destinations.findIndex(
              (d) => d.slug?.current === prev.slug?.current
            )
          : 0;
        const next = (cur + 1) % destinations.length;
        return destinations[next];
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [destinations, canAutoplay]);

  // manual select pauses autoplay for 30s
  const handleSelect = (d: Destination) => {
    setSelected(d);
    setAboutOpen(false);
    setUserPausedUntil(Date.now() + 30_000);
  };

  // URL panel helpers
  const openPanel = (q: string) => {
    setUserPausedUntil(Date.now() + 60_000); // pause while panel is likely being used
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
    router.push(next ? `${pathname}?${next}` : pathname, { scroll: false });
    // resume after a short grace period
    setUserPausedUntil(Date.now() + 3_000);
  };

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
    <main className="relative z-0 min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}

      {/* Mobile sticky chips */}
      <div className="md:hidden sticky top-0 z-20 bg-[var(--surface-dark)] border-b border-[var(--border)]">
        <h2 className="text-base font-semibold px-4 py-3">
          Top-rated Safari Countries
        </h2>
        <CountryTabs
          items={destinations}
          selectedSlug={selected?.slug?.current}
          onSelect={(d) => handleSelect(d)}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[calc(100vh-320px)]">
        {/* Sidebar (md+) */}
        <nav className="hidden md:block md:w-72 bg-[var(--surface-dark)] border-r border-[var(--border)]">
          <h2 className="text-xl font-semibold p-6 border-b border-[var(--border)]">
            Top-rated Safari Countries
          </h2>
          <ul className="max-h-[calc(100vh-380px)] overflow-y-auto">
            {destinations.map((dest, i) => (
              <li key={dest.slug?.current ?? `${dest.title}-${i}`}>
                <button
                  onClick={() => handleSelect(dest)}
                  className={`w-full text-left px-6 py-3 border-b border-[var(--border)] flex items-center gap-2
                    ${
                      selected?.slug?.current === dest.slug?.current
                        ? "bg-[var(--accent)] text-[var(--background)] font-semibold"
                        : "text-[var(--onSurface-light)] hover:bg-[var(--accent)] hover:text-[var(--background)]"
                    }`}
                >
                  <span className="text-[var(--background)]">#{i + 1}</span>
                  {dest.flagImage && (
                    <img
                      src={dest.flagImage}
                      alt=""
                      className="w-6 h-4 object-cover rounded-[2px]"
                    />
                  )}
                  <span className="truncate">{dest.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Detail */}
        <section className="relative flex-1 p-4 sm:p-6 md:p-10 text-white min-h-[calc(100vh-320px)] flex flex-col">
          {/* Background with cross-fade */}
          <div className="absolute inset-0 w-full h-full">
            {prevBg && (
              <Image
                key={`prev-${prevBg}`}
                src={prevBg}
                alt=""
                fill
                priority
                sizes="100vw"
                className={`object-cover transition-opacity duration-500 ${
                  fade ? "opacity-0" : "opacity-100"
                }`}
              />
            )}
            {selected?.image && (
              <Image
                key={`cur-${selected.image}`}
                src={selected.image}
                alt={`${selected.title} background`}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-100"
              />
            )}
            <div className="absolute inset-0 bg-black/45 md:bg-black/40" />
          </div>

          {/* Foreground */}
          <div className="relative z-10 flex flex-col h-full min-h-[450px]">
            <div className="flex-1 space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2
                  className={`text-4xl sm:text-5xl leading-tight drop-shadow-md ${dancingScript.className}`}
                >
                  {selected?.title}
                </h2>
                <div className="bg-black/50 p-1 sm:p-2 rounded-lg w-fit">
                  <Image
                    src="/badges/fair-trade-paw.png"
                    alt="Fair Trade Approved"
                    width={90}
                    height={90}
                    className="object-contain sm:w-[120px] sm:h-[120px]"
                  />
                </div>
              </div>

              {selected?.subtitle && (
                <p className="italic text-base sm:text-lg text-white/80">
                  {selected.subtitle}
                </p>
              )}
              {selected?.description && (
                <p className="text-white/90 leading-relaxed">
                  {selected.description}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mt-4 text-white/90">
                {selected?.bestTime && (
                  <div className="bg-white/10 p-3 sm:p-4 rounded-lg border border-white/10">
                    <strong className="block text-white mb-1">
                      Best Time to Go
                    </strong>
                    {selected.bestTime}
                  </div>
                )}
                {selected?.highSeason && (
                  <div className="bg-white/10 p-3 sm:p-4 rounded-lg border border-white/10">
                    <strong className="block text-white mb-1">
                      High Season
                    </strong>
                    {selected.highSeason}
                  </div>
                )}
              </div>

              {typeof selected?.rating === "number" && (
                <div className="flex items-center space-x-2 text-yellow-300 mt-2">
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

            {/* ---- GALLERY: floating dock (md+) + mobile button ---- */}
            {selected?.gallery?.length ? (
              <>
                {/* Dock (md+): floats above CTAs, auto offset */}
                <div className="hidden md:block pointer-events-none">
                  <div
                    className="absolute left-6 right-6 transition-all"
                    style={{ bottom: dockBottom }}
                  >
                    <div
                      className="pointer-events-auto backdrop-blur-sm bg-black/30 border border-white/10 rounded-2xl px-3 py-2"
                      onMouseEnter={() =>
                        setUserPausedUntil(Date.now() + 15_000)
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-xl">📸</span>
                          <span className="font-semibold">
                            Photo Highlights
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setGalleryOpen(true);
                            setUserPausedUntil(Date.now() + 60_000);
                          }}
                          className="text-sm underline hover:no-underline"
                        >
                          Open gallery
                        </button>
                      </div>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {selected.gallery.slice(0, 10).map((img, i) => (
                          <button
                            key={`${img}-${i}`}
                            className="shrink-0 w-28 h-20 overflow-hidden rounded-md border border-white/10"
                            onClick={() => {
                              setGalleryOpen(true);
                              setUserPausedUntil(Date.now() + 60_000);
                            }}
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

                {/* Mobile: compact button */}
                <div className="md:hidden mt-6">
                  <Button
                    onClick={() => {
                      setGalleryOpen(true);
                      setUserPausedUntil(Date.now() + 60_000);
                    }}
                    className="w-full bg-white/15 hover:bg-white/20 text-white border border-white/20"
                    variant="ghost"
                  >
                    <Images size={18} className="mr-2" /> Photo Highlights
                  </Button>
                </div>
              </>
            ) : null}

            {/* CTAs (we measure this for dock placement) */}
            <div
              ref={ctaRef}
              className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <Button
                onClick={() => selected && openPanel(selected.title)}
                className="w-full bg-[#E5D5B8] hover:bg-[#d4c3a3] text-black font-semibold text-base px-6 py-3 flex items-center gap-2"
                disabled={!selected}
              >
                <Binoculars size={18} />
                Explore {selected?.title ?? "Country"} Itineraries
              </Button>

              <Button
                variant="outline"
                className="w-full border-[#E5D5B8] text-[#E5D5B8] hover:bg-[#E5D5B8] hover:text-black font-semibold text-base px-6 py-3 flex items-center gap-2"
                onClick={() => {
                  setAboutOpen(true);
                  setUserPausedUntil(Date.now() + 60_000);
                }}
                disabled={!selected}
              >
                <Info size={18} />
                More About {selected?.title ?? "Country"}
              </Button>

              <Button
                variant="ghost"
                className="w-full sm:w-auto justify-center sm:justify-start text-white hover:underline text-base px-6 py-3 flex items-center gap-2"
                onClick={() => {
                  setBookingOpen(true);
                  setUserPausedUntil(Date.now() + 60_000);
                }}
              >
                <PhoneCall size={18} />
                Book a Discovery Call
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* ---------- GALLERY MODAL ---------- */}
      {galleryOpen && selected?.gallery?.length ? (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-[1400]"
            onClick={() => setGalleryOpen(false)}
          />
          <div className="fixed inset-0 z-[1410] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-white">
                <Images size={18} />
                <span className="font-semibold">
                  Photo Highlights — {selected.title}
                </span>
              </div>
              <button
                onClick={() => setGalleryOpen(false)}
                className="w-9 h-9 grid place-items-center rounded-full bg-white/90 text-neutral-800 hover:bg-white"
                aria-label="Close gallery"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div className="h-full w-max flex gap-4 p-4 snap-x snap-mandatory">
                {selected.gallery.map((img, i) => (
                  <div
                    key={`${img}-${i}`}
                    className="snap-center w-[calc(100vw-3rem)] md:w-[80vw] max-w-6xl"
                  >
                    {/* Landscape frame: 4:3 on small phones, 16:9 on sm+ */}
                    <div className="relative mx-auto aspect-[4/3] sm:aspect-[16/9] max-h-[70vh] sm:max-h-[80vh] rounded-xl overflow-hidden bg-black">
                      {/* (optional bg blur behind, uncomment if you like the cinematic look)
          <Image
            src={img}
            alt=""
            fill
            className="object-cover blur-xl scale-110 opacity-60"
            sizes="100vw"
          />
          */}
                      <Image
                        src={img}
                        alt={`Gallery image ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority={i === 0}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* ---------- ABOUT PANEL ---------- */}
      {aboutOpen && (
        <>
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
                {selected?.region && (
                  <p className="text-white/80 text-sm mt-1">
                    {selected.region}
                  </p>
                )}
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

      {/* ---------- JOURNEY PANEL ---------- */}
      {isOpen && (
        <>
          <div
            onClick={closePanel}
            className="fixed inset-0 bg-black/50 z-[1100]"
            aria-hidden="true"
          />
          <aside
            className="fixed right-0 top-0 h-[100dvh] w-full sm:w-[560px] md:w-[720px] lg:w-[840px] xl:w-[960px] bg-white z-[1200] shadow-2xl border-l border-neutral-200"
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

            <div className="h-[calc(100dvh-57px)]">
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

      {/* ---------- DISCOVERY CALL ---------- */}
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
