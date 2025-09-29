"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
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
    originalFilename?: string;
    file: {
      asset: {
        url: string;
        mimeType: string;
        originalFilename?: string;
      };
    };
  }[];
  passportUploads?: {
    asset: {
      _ref?: string;
      url: string;
      originalFilename?: string;
      mimeType: string;
    };
  }[];
  flightTicketUploads?: {
    asset: {
      _ref?: string;
      url: string;
      originalFilename?: string;
      mimeType: string;
    };
  }[];
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
    []
  );
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // ✅ Input refs mapped by trip ID
  const passportInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const flightInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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

    fetch(`/api/trips?email=${encodeURIComponent(email)}&ts=${Date.now()}`)
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
    <div className="px-4 sm:px-8 lg:px-16 py-10 max-w-7xl mx-auto space-y-10">
      <SignedIn>
        <div className="mb-10 p-6 bg-white rounded-xl shadow-md flex items-center justify-between flex-col sm:flex-row gap-6">
          <div>
            <h2 className="text-2xl font-bold text-amber-800 mb-1">
              Welcome{user?.firstName ? `, ${user.firstName}` : ""}!
            </h2>
            <p className="text-gray-700 text-sm">{email}</p>
          </div>

          <a
            href="/books"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
          >
            📘 Download Your Free Book Now
          </a>
        </div>

        {isOffline && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-center text-sm font-medium shadow-md">
            You’re offline. Showing cached trip data.
          </div>
        )}

        {/* TRIPS SECTION */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Your Trips</h2>
          {trips.length === 0 ? (
            <p>No trips found.</p>
          ) : (
            <ul className="flex flex-col gap-8">
              {trips.map((trip) => (
                <li
                  key={trip._id}
                  className="border rounded-lg p-6 shadow bg-white"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* LEFT SIDE */}
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {trip.title}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {trip.startDate &&
                          new Date(trip.startDate).toLocaleDateString()}{" "}
                        →{" "}
                        {trip.endDate &&
                          new Date(trip.endDate).toLocaleDateString()}
                      </p>
                      {trip.destination?.name && (
                        <p className="text-sm text-gray-600 mt-1">
                          📍 {trip.destination.name}
                        </p>
                      )}
                      {Array.isArray(trip.documents) &&
                      trip.documents.length > 0 ? (
                        <div className="mt-4">
                          <p className="font-medium text-sm mb-2">
                            Uploaded Files:
                          </p>
                          <ul className="list-disc list-inside text-sm">
                            {trip.documents.map((doc) => (
                              <li key={doc._key}>
                                <a
                                  href={doc.file.asset.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  {doc.originalFilename ||
                                    doc.file?.asset?.originalFilename ||
                                    doc.label ||
                                    "Unnamed File"}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mt-2">
                          No CRM documents found.
                        </p>
                      )}
                    </div>

                    {/* RIGHT SIDE — Upload Inputs */}
                    <div>
                      <p className="text-sm font-semibold mb-3">
                        Upload Your Documents
                      </p>

                      {/* Passport Upload */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Passport
                        </label>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const uploaded = await sanityClient.assets.upload(
                              "file",
                              file,
                              {
                                filename: file.name,
                              }
                            );

                            const newRef = {
                              asset: {
                                _type: "reference",
                                _ref: uploaded._id,
                              },
                            };

                            await sanityClient
                              .patch(trip._id)
                              .setIfMissing({ passportUploads: [] })
                              .append("passportUploads", [newRef])
                              .commit();

                            alert(
                              "Passport uploaded. It will now appear below."
                            );
                            e.target.value = ""; // reset input

                            // Re-fetch the trips to update UI
                            fetch(
                              `/api/trips?email=${encodeURIComponent(email)}&ts=${Date.now()}`
                            )
                              .then((res) => res.json())
                              .then((data) => {
                                const fresh = Array.isArray(data.trips)
                                  ? data.trips
                                  : data;
                                if (Array.isArray(fresh)) {
                                  setTrips(fresh);
                                  localStorage.setItem(
                                    `trips_${email}`,
                                    JSON.stringify(fresh)
                                  );
                                }
                              });
                          }}
                          className="block w-full border border-gray-300 rounded p-2 text-sm"
                        />

                        {/* Uploaded passports visual list */}
                        {trip.passportUploads &&
                          trip.passportUploads.length > 0 && (
                            <ul className="mt-3 space-y-1 text-sm text-blue-700 underline">
                              {trip.passportUploads.map((item, idx) => (
                                <li key={idx}>
                                  <a
                                    href={item.asset.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item.asset.originalFilename ||
                                      `Passport File ${idx + 1}`}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>

                      {/* Flight Ticket Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Flight Ticket
                        </label>
                        <input
                          ref={(el) => {
                            flightInputRefs.current[trip._id] = el;
                          }}
                          type="file"
                          accept=".pdf,image/*"
                          multiple
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            if (!files.length) return;

                            const uploaded = await Promise.all(
                              files.map((file) =>
                                sanityClient.assets.upload("file", file, {
                                  filename: file.name,
                                })
                              )
                            );

                            const newRefs = uploaded.map((asset) => ({
                              asset: {
                                _type: "reference",
                                _ref: asset._id,
                              },
                            }));

                            await sanityClient
                              .patch(trip._id)
                              .setIfMissing({ flightTicketUploads: [] })
                              .append("flightTicketUploads", newRefs)
                              .commit();

                            alert(
                              "Flight tickets uploaded. Please refresh to see changes."
                            );

                            if (flightInputRefs.current[trip._id]) {
                              flightInputRefs.current[trip._id]!.value = "";
                            }
                          }}
                          className="block w-full border border-gray-300 rounded p-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* WISHLIST */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
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
                  country={journey.country?.title}
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
