"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import PortalTripCard, { type PortalTrip as Trip } from "./PortalTripCard";
import { sanityClient } from "@/lib/client";
import { groq } from "next-sanity";
import { useWishlist } from "@/hooks/useWishlist";
import JourneyCard from "@/components/JourneyCard";
import Link from "next/link";
import { authFetch } from "@/lib/authFetch";

const fetchWishlistJourneys = async (ids: string[]) => {
  if (!ids.length) return [];

  const query = groq`*[_type == "journey" && _id in $ids]{
    _id,
    title,
    slug,
    summary,
    "heroUrl": heroImage.asset->url,
    price,
    duration,
    region,
    country,
    starRating,
    isFeatured
  }`;

  return await sanityClient.fetch(query, { ids });
};


type WishlistJourney = {
  _id: string;
  title: string;
  slug?: { current: string };
  summary?: string;
  heroUrl?: string;
  price?: number;
  duration?: string;
  region?: { title?: string };
  country?: { title?: string };
  starRating?: number;
  isFeatured?: boolean;
};

export default function ClientHomeContent() {
  const { user } = useUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const { wishlistIds } = useWishlist();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [wishlistJourneys, setWishlistJourneys] = useState<WishlistJourney[]>(
    [],
  );
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const refreshTrips = useCallback(async () => {
    if (!email) return;
    try {
      const res = await authFetch(
        `/api/trips?email=${encodeURIComponent(email)}&ts=${Date.now()}`,
      );
      const data = await res.json();
      if (Array.isArray(data.trips)) {
        setTrips(data.trips);
        localStorage.setItem(`trips_${email}`, JSON.stringify(data.trips));
      }
    } catch (err) {
      console.warn("Failed to refresh trips", err);
    }
  }, [email]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!user?.id || !wishlistIds.length) return;

    const cacheKey = `wishlist_${user.id}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setWishlistJourneys(parsed);
        }
      } catch (err) {
        console.error("Failed to parse cached wishlist", err);
      }
    }

    setWishlistLoading(true);
    fetchWishlistJourneys(wishlistIds)
      .then((data) => {
        setWishlistJourneys(data);
        localStorage.setItem(cacheKey, JSON.stringify(data));
      })
      .finally(() => setWishlistLoading(false));
  }, [user?.id, wishlistIds]);

  useEffect(() => {
    if (!email) return;

    const cacheKey = `trips_${email}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setTrips(parsed);
        }
      } catch (err) {
        console.error("Failed to parse cached trips", err);
      }
    }

    authFetch(`/api/trips?email=${encodeURIComponent(email)}&ts=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const fresh = Array.isArray(data.trips) ? data.trips : data;
        if (Array.isArray(fresh)) {
          setTrips(fresh);
          localStorage.setItem(cacheKey, JSON.stringify(fresh));
        } else {
          console.warn("Unexpected trips response:", data);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch trips (offline or error)", err);
      });
  }, [email]);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-8">
      <SignedIn>
        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#fffaf3] p-6 ring-1 ring-border/60 sm:flex-row sm:items-center sm:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a7766]">Client portal</p>
            <h2 className="mt-1 text-2xl font-semibold text-accent sm:text-3xl">
              Welcome{user?.firstName ? `, ${user.firstName}` : ""}
            </h2>
            <p className="mt-1 text-sm text-[#6b5647]">{email}</p>
          </div>
          <Link
            href="/books/"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4a3229]"
          >
            Download your free book
          </Link>
        </div>

        {isOffline && (
          <div className="rounded-xl bg-[#efe5d6] px-4 py-2 text-center text-sm font-medium text-accent">
            You’re offline. Showing your saved trip details.
          </div>
        )}

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-[#3e2a20]">Your trips</h2>
          {trips.length === 0 ? (
            <p className="rounded-2xl bg-[#fffaf3] p-6 text-sm text-[#6b5647] ring-1 ring-border/60">
              No trips yet. Once your booking is confirmed, your trip and documents will appear here.
            </p>
          ) : (
            <ul className="flex flex-col gap-8">
              {trips.map((trip) => (
                <PortalTripCard key={trip._id} trip={trip} onChanged={refreshTrips} />
              ))}
            </ul>
          )}
        </section>
        {/* WISHLIST */}
        <div className="mt-14">
          <h2 className="mb-4 text-2xl font-semibold text-[#3e2a20]">Your wishlist</h2>
          {wishlistLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-100 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : wishlistJourneys.length === 0 ? (
            <p>You haven&apos;t saved any journeys yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistJourneys.map((journey) => (
                <JourneyCard
                  key={journey._id}
                  journeyId={journey._id}
                  slug={journey.slug?.current || ""}
                  title={journey.title}
                  summary={journey.summary}
                  imageUrl={journey.heroUrl}
                  alt={journey.title}
                  price={
                    typeof journey.price === "string"
                      ? journey.price
                      : (journey.price ?? "")
                  }
                  duration={journey.duration}
                  region={journey.region?.title}
                  destinations={
                    journey.country?.title ? [journey.country.title] : []
                  }
                  star={journey.starRating}
                  isFeatured={journey.isFeatured ?? false}
                  isWishlisted={wishlistIds.includes(journey._id)}
                />
              ))}
            </div>
          )}
        </div>
      </SignedIn>

      <SignedOut>
        <p>You must be signed in to access this page.</p>
      </SignedOut>
    </div>
  );
}
