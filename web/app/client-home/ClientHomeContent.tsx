"use client";

import {
  SignedIn,
  SignedOut,
  UserButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { sanityClient } from "@/lib/client";
import { useEffect, useState } from "react";

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

export default function ClientHomeContent() {
  const { user } = useUser();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  const email = user?.emailAddresses?.[0]?.emailAddress;

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
    <>
      <div className="px-4 sm:px-8 lg:px-16 py-10 text-base sm:text-lg lg:text-xl max-w-7xl mx-auto space-y-10">
        <SignedIn>
          <div className="mt-8">
            {/* User Info Block */}
            <div className="mt-8">
              {/* User Info Card */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-6 rounded-2xl shadow-lg bg-white/90 max-w-lg">
                <div className="shrink-0">
                  <UserButton afterSignOutUrl="/" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-amber-900 mb-1">
                    Welcome{user?.firstName ? `, ${user.firstName}` : "!"}
                  </p>
                  <p className="text-sm text-gray-700">Logged in as: {email}</p>
                </div>
                <div className="shrink-0">
                  <SignOutButton>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold text-sm shadow-sm transition w-full sm:w-auto">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              </div>

              {/* Guide Button - right aligned below */}
              <div className="mt-2 flex justify-end max-w-lg">
                <a
                  href="/books"
                  className="inline-block bg-amber-600 text-white px-4 py-2 rounded-md font-semibold text-sm shadow-sm hover:bg-amber-700 transition"
                >
                  Our Selection of Guides →
                </a>
              </div>
            </div>
          </div>

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
                  <li
                    key={trip._id}
                    className="flex flex-col md:flex-row gap-6"
                  >
                    {/* LEFT COLUMN */}
                    <div className="bg-white w-full md:w-1/2 rounded-2xl shadow-md border border-gray-200 p-5 space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {trip.title}
                        </h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {trip.status ?? "Upcoming"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {trip.startDate?.slice(0, 10)} —{" "}
                        {trip.endDate?.slice(0, 10)}
                      </p>
                      {trip.destination?.name && (
                        <p className="text-sm text-gray-700">
                          Destination: <strong>{trip.destination.name}</strong>
                        </p>
                      )}
                      {trip.tripType && (
                        <p className="text-sm text-gray-700">
                          Type: <span className="italic">{trip.tripType}</span>
                        </p>
                      )}
                      {trip.createdAt && (
                        <p className="text-sm text-gray-400">
                          Booked: {trip.createdAt.slice(0, 10)}
                        </p>
                      )}
                      <div className="mt-3">
                        <p className="text-sm font-semibold mb-2">Documents:</p>
                        {trip.documents?.length ? (
                          <ul className="space-y-2">
                            {trip.documents.map((doc) => {
                              const asset = doc.file?.asset;
                              if (!asset?.url) return null;
                              return (
                                <li
                                  key={doc._key}
                                  className="bg-gray-50 p-3 rounded text-sm"
                                >
                                  <p className="font-medium text-gray-900 break-words">
                                    {asset.originalFilename}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {asset.mimeType}
                                  </p>
                                  <p className="text-xs italic text-gray-500 mb-1">
                                    Type:{" "}
                                    {doc.label
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(/^./, (str) =>
                                        str.toUpperCase()
                                      )}
                                  </p>
                                  <div className="flex gap-4">
                                    <a
                                      href={asset.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 text-sm font-medium underline hover:text-blue-800"
                                    >
                                      View
                                    </a>
                                    <a
                                      href={asset.url}
                                      download={asset.originalFilename}
                                      className="text-gray-600 text-sm font-medium underline hover:text-gray-800"
                                    >
                                      Download
                                    </a>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-400">
                            No documents uploaded yet.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* RIGHT COLUMN - Upload + Your Uploads */}
                    <div className="bg-white w-full md:w-1/2 rounded-2xl shadow-md border border-gray-200 p-5 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Passport Upload
                        </label>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const fileAsset = await sanityClient.assets.upload(
                              "file",
                              file,
                              { filename: file.name }
                            );
                            await sanityClient
                              .patch(trip._id)
                              .setIfMissing({ passportUploads: [] })
                              .append("passportUploads", [
                                {
                                  asset: {
                                    _type: "reference",
                                    _ref: fileAsset._id,
                                  },
                                },
                              ])
                              .commit();
                            const res = await fetch(
                              `/api/trips?email=${encodeURIComponent(email || "")}`
                            );
                            const data = await res.json();
                            setTrips(data.trips);
                            localStorage.setItem(
                              `trips_${email}`,
                              JSON.stringify(data.trips)
                            );
                          }}
                          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-amber-700 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Flight Ticket Upload
                        </label>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const fileAsset = await sanityClient.assets.upload(
                              "file",
                              file,
                              { filename: file.name }
                            );
                            await sanityClient
                              .patch(trip._id)
                              .setIfMissing({ flightTicketUploads: [] })
                              .append("flightTicketUploads", [
                                {
                                  asset: {
                                    _type: "reference",
                                    _ref: fileAsset._id,
                                  },
                                },
                              ])
                              .commit();
                            const res = await fetch(
                              `/api/trips?email=${encodeURIComponent(email || "")}`
                            );
                            const data = await res.json();
                            setTrips(data.trips);
                            localStorage.setItem(
                              `trips_${email}`,
                              JSON.stringify(data.trips)
                            );
                          }}
                          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-amber-700 transition"
                        />
                      </div>

                      {/* Show Uploaded Files */}
                      {(trip.passportUploads?.length ||
                        trip.flightTicketUploads?.length) && (
                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-sm font-semibold mb-2">
                            Your Uploads:
                          </p>
                          <ul className="space-y-2">
                            {[
                              ...(trip.passportUploads || []),
                              ...(trip.flightTicketUploads || []),
                            ].map((file, index) => {
                              const isPassport = trip.passportUploads?.some(
                                (f) => f.asset?._ref === file.asset?._ref
                              );
                              const label = isPassport
                                ? "Passport Upload"
                                : "Flight Ticket";
                              return (
                                <li
                                  key={`${label}-${index}`}
                                  className="bg-gray-50 p-3 rounded text-sm"
                                >
                                  <p className="font-medium text-gray-900 break-words">
                                    {file.asset?.originalFilename ??
                                      "Untitled File"}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {file.asset?.mimeType}
                                  </p>
                                  <p className="text-xs italic text-gray-500">
                                    Type: {label}
                                  </p>
                                  <div className="flex gap-4 mt-1">
                                    <a
                                      href={file.asset?.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 text-sm font-medium underline hover:text-blue-800"
                                    >
                                      View
                                    </a>
                                    <button
                                      className="text-red-600 text-sm font-medium underline hover:text-red-800"
                                      onClick={async () => {
                                        const confirmed = window.confirm(
                                          `Are you sure you want to delete this file?\n\nAsset Ref: ${file.asset?._ref}`
                                        );
                                        if (!confirmed || !file.asset?._ref)
                                          return;
                                        const res = await fetch(
                                          "/api/delete-upload",
                                          {
                                            method: "POST",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            body: JSON.stringify({
                                              tripId: trip._id,
                                              field: isPassport
                                                ? "passportUploads"
                                                : "flightTicketUploads",
                                              assetRef: file.asset._ref,
                                            }),
                                          }
                                        );
                                        const data = await res.json();
                                        if (res.ok) {
                                          alert(
                                            "File removed. Refresh to see changes."
                                          );
                                        } else {
                                          alert(
                                            `Failed to remove: ${data.error}`
                                          );
                                        }
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SignedIn>

        <SignedOut>
          <p>You must be signed in to access this page.</p>
        </SignedOut>
      </div>
    </>
  );
}
