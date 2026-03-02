"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { sanityClient } from "@/lib/client";
import { groq } from "next-sanity";
import { useWishlist } from "@/hooks/useWishlist";
import JourneyCard from "@/components/JourneyCard";
import Link from "next/link";

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
    _key: string; // ✅ Sanity array items always have a _key
    asset: {
      _ref?: string; // when not expanded
      _id?: string; // when expanded with asset-> in GROQ
      url: string;
      originalFilename?: string;
      mimeType: string;
    };
  }[];
  flightTicketUploads?: {
    _key: string; // ✅ add key here too
    asset: {
      _ref?: string; // when not expanded
      _id?: string; // when expanded with asset-> in GROQ
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
    [],
  );
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // 🔁 Added for upload feedback UI
  // 🔁 Separate upload states for passport and flight
  const [passportUploading, setPassportUploading] = useState(false);
  const [flightUploading, setFlightUploading] = useState(false);

  // ✅ Input refs mapped by trip ID
  // const passportInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
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

          <Link
            href="/books/"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
          >
            📘 Download Your Free Book Now
          </Link>
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
                            {trip.documents.map((doc, index) => (
                              <li key={`${doc._key}-${index}`}>
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
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Passport Upload
                        </label>

                        <div className="relative group border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white hover:border-amber-600 transition">
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file || !trip._id) return;
                              setPassportUploading(true);

                              try {
                                const formData = new FormData();
                                formData.append("file", file);
                                formData.append("tripId", trip._id);
                                formData.append("field", "passportUploads");

                                const response = await fetch("/api/upload", {
                                  method: "POST",
                                  body: formData,
                                });

                                const result = await response.json();
                                console.log("Passport upload result:", result);

                                // 🔁 Refresh trips after upload
                                const refreshed = await fetch(
                                  `/api/trips?email=${encodeURIComponent(email || "")}&ts=${Date.now()}`,
                                );

                                const data = await refreshed.json();
                                if (Array.isArray(data.trips)) {
                                  setTrips(data.trips);
                                  localStorage.setItem(
                                    `trips_${email}`,
                                    JSON.stringify(data.trips),
                                  );
                                }
                              } catch (err) {
                                console.error("Passport upload failed", err);
                              } finally {
                                setPassportUploading(false);
                                e.target.value = "";
                              }
                            }}
                          />
                          <div className="text-center text-gray-500 z-0 relative">
                            {passportUploading ? (
                              <span className="text-amber-700 font-medium">
                                Uploading...
                              </span>
                            ) : (
                              <>
                                <p className="text-sm">
                                  Click or drag file to upload
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  PDF or image files only
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Uploaded Files */}
                        {Array.isArray(trip.passportUploads) &&
                          trip.passportUploads.length > 0 && (
                            <ul className="mt-4 space-y-2 text-sm">
                              {trip.passportUploads.map((item, idx) => (
                                <li
                                  key={item._key || idx}
                                  className="flex items-center justify-between"
                                >
                                  <a
                                    href={item.asset.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    {item.asset.originalFilename ||
                                      `Passport File ${idx + 1}`}
                                  </a>
                                  <button
                                    onClick={async () => {
                                      const confirmDelete = window.confirm(
                                        "Are you sure you want to delete this file? This cannot be undone.",
                                      );
                                      if (!confirmDelete) return;

                                      // 🟢 Debug log before calling API
                                      console.log(
                                        "Deleting file with values:",
                                        {
                                          tripId: trip._id,
                                          field: "passportUploads",
                                          originalFilename:
                                            item.asset?.originalFilename,
                                        },
                                      );

                                      await fetch("/api/delete-upload", {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          tripId: trip._id,
                                          field: "passportUploads",
                                          originalFilename:
                                            item.asset?.originalFilename, // ✅ simplified
                                        }),
                                      });

                                      // 🔁 Refresh trips after delete
                                      const refreshed = await fetch(
                                        `/api/trips?email=${encodeURIComponent(email || "")}&ts=${Date.now()}`,
                                      );
                                      const data = await refreshed.json();
                                      if (Array.isArray(data.trips)) {
                                        setTrips(data.trips);
                                        localStorage.setItem(
                                          `trips_${email}`,
                                          JSON.stringify(data.trips),
                                        );
                                      }
                                    }}
                                    className="ml-3 text-red-600 hover:underline text-sm"
                                  >
                                    Delete
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>

                      {/* Flight Ticket Upload */}
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Flight Ticket Upload
                        </label>

                        <div className="relative group border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white hover:border-amber-600 transition">
                          <input
                            ref={(el) => {
                              flightInputRefs.current[trip._id] = el;
                            }}
                            type="file"
                            accept=".pdf,image/*"
                            multiple
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              if (!files.length || !trip._id) return;

                              setFlightUploading(true);

                              try {
                                for (const file of files) {
                                  const formData = new FormData();
                                  formData.append("file", file);
                                  formData.append("tripId", trip._id);
                                  formData.append(
                                    "field",
                                    "flightTicketUploads",
                                  );

                                  const response = await fetch("/api/upload", {
                                    method: "POST",
                                    body: formData,
                                  });

                                  const result = await response.json();
                                  console.log(
                                    "Flight ticket upload result:",
                                    result,
                                  );

                                  // 🔁 Refresh trips after upload
                                  const refreshed = await fetch(
                                    `/api/trips?email=${encodeURIComponent(email || "")}&ts=${Date.now()}`,
                                  );
                                  const data = await refreshed.json();
                                  if (Array.isArray(data.trips)) {
                                    setTrips(data.trips);
                                    localStorage.setItem(
                                      `trips_${email}`,
                                      JSON.stringify(data.trips),
                                    );
                                  }
                                }
                              } catch (err) {
                                console.error(
                                  "Flight ticket upload failed",
                                  err,
                                );
                              } finally {
                                setFlightUploading(false);
                                if (flightInputRefs.current[trip._id]) {
                                  flightInputRefs.current[trip._id]!.value = "";
                                }
                              }
                            }}
                          />
                          <div className="text-center text-gray-500 z-0 relative">
                            {flightUploading ? (
                              <span className="text-amber-700 font-medium">
                                Uploading...
                              </span>
                            ) : (
                              <>
                                <p className="text-sm">
                                  Click or drag file to upload
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  PDF or image files only
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Uploaded Files */}
                        {Array.isArray(trip.flightTicketUploads) &&
                          trip.flightTicketUploads.length > 0 && (
                            <ul className="mt-4 space-y-2 text-sm">
                              {trip.flightTicketUploads.map((item, idx) => (
                                <li
                                  key={item._key || idx}
                                  className="flex items-center justify-between"
                                >
                                  <a
                                    href={item.asset.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    {item.asset.originalFilename ||
                                      `Flight Ticket ${idx + 1}`}
                                  </a>
                                  <button
                                    onClick={async () => {
                                      const confirmDelete = window.confirm(
                                        "Are you sure you want to delete this file? This cannot be undone.",
                                      );
                                      if (!confirmDelete) return;

                                      // 🟢 Debug log before calling API
                                      console.log(
                                        "Deleting file with values:",
                                        {
                                          tripId: trip._id,
                                          field: "flightTicketUploads",
                                          assetId:
                                            item?.asset?._ref ||
                                            item?.asset?._id ||
                                            "MISSING",
                                          key: item?._key || "MISSING",
                                        },
                                      );

                                      await fetch("/api/delete-upload", {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          tripId: trip._id,
                                          field: "flightTicketUploads",
                                          originalFilename:
                                            item.asset?.originalFilename, // ✅ simplified
                                        }),
                                      });

                                      // 🔁 Refresh trips after delete
                                      const refreshed = await fetch(
                                        `/api/trips?email=${encodeURIComponent(email || "")}&ts=${Date.now()}`,
                                      );
                                      const data = await refreshed.json();
                                      if (Array.isArray(data.trips)) {
                                        setTrips(data.trips);
                                        localStorage.setItem(
                                          `trips_${email}`,
                                          JSON.stringify(data.trips),
                                        );
                                      }
                                    }}
                                    className="ml-3 text-red-600 hover:underline text-sm"
                                  >
                                    Delete
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
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
