"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";

import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/client";
import { groq } from "next-sanity";
import { useWishlist } from "@/hooks/useWishlist";
import JourneyCard from "@/components/JourneyCard";

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

type Trip = {
  _id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  tripType?: string;
  status?: string;
  createdAt?: string;
  destination?: {
    name: string;
    slug: string;
  };
  documents?: {
    _key: string;
    label: string;
    file: {
      asset: {
        url: string;
        originalFilename: string;
        mimeType: string;
      };
    };
  }[];
  passportUploads?: {
    asset: {
      _ref?: string;
      url: string;
      originalFilename: string;
      mimeType: string;
    };
  }[];
  flightTicketUploads?: {
    asset: {
      _ref?: string;
      url: string;
      originalFilename: string;
      mimeType: string;
    };
  }[];
};
type WishlistJourney = {
  _id: string;
  title: string;
  slug?: { current: string };
  summary?: string;
  heroUrl?: string; // ✅ ADD THIS
  price?: number;
  duration?: string;
  region?: {
    title?: string;
  };
  country?: {
    title?: string;
  };
  starRating?: number;
  isFeatured?: boolean;
};

export default function ClientHomeContent() {
  const { user } = useUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const { wishlistIds } = useWishlist(); // ✅ NEW
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [wishlistJourneys, setWishlistJourneys] = useState<WishlistJourney[]>(
    []
  );
  // ✅ NEW

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
    if (!wishlistIds.length) return;

    fetchWishlistJourneys(wishlistIds).then((data) => {
      setWishlistJourneys(data);
    });
  }, [wishlistIds]);

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

    fetch(`/api/trips?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        const fresh = data.trips;
        setTrips(fresh);
        localStorage.setItem(cacheKey, JSON.stringify(fresh));
      })
      .catch((err) => {
        console.warn("Failed to fetch trips (offline or error)", err);
      });
  }, [email]);

  return (
    <div className="px-4 sm:px-8 lg:px-16 py-10 text-base sm:text-lg lg:text-xl max-w-7xl mx-auto space-y-10">
      <SignedIn>
        {/* User info, trips UI... */}

        {isOffline && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-center text-sm font-medium shadow-md">
            You’re offline. Showing cached trip data.
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Your Trips</h2>
          {trips.length === 0 ? (
            <p>No trips found.</p>
          ) : (
            <ul className="flex flex-col gap-8">
              {trips.map((trip) => (
                <li key={trip._id}>{/* Trip card here */}</li>
              ))}
            </ul>
          )}
        </div>

        {/* ✅ NEW — WISHLIST SECTION */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
          {wishlistJourneys.length === 0 ? (
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
                      : (journey.price ?? "") // fallback
                  }
                  duration={journey.duration}
                  region={journey.region?.title}
                  country={journey.country?.title}
                  star={journey.starRating}
                  isFeatured={journey.isFeatured ?? false}
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
