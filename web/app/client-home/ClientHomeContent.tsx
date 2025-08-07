"use client";

import {
  SignedIn,
  SignedOut,
  UserButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { sanityClient } from "@/lib/client";
//import { v4 as uuidv4 } from "uuid";
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
  const { user } = useUser(); // <-- ADD THIS LINE RIGHT HERE!
  const [trips, setTrips] = useState<Trip[]>([]);
  const email = user?.emailAddresses?.[0]?.emailAddress;

  useEffect(() => {
    if (!email) return;
    fetch(`/api/trips?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => setTrips(data.trips));
  }, [email]);
  return (
    <>
      <section
        className="relative h-[400px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/sunset-safari.webp')` }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-xl">
            Welcome to your personal travel portal.
          </h1>
          <p className="text-lg max-w-lg">
            View your upcoming trips and manage your safari documents below.
          </p>
        </div>
      </section>

      <div className="p-8 text-xl">
        <SignedIn>
          <div className="mt-8">
            <div className="flex items-center gap-6 p-6 rounded-2xl shadow-lg bg-white/90 max-w-lg">
              {/* Avatar */}
              <div className="shrink-0">
                <UserButton afterSignOutUrl="/" />
              </div>
              {/* Personalized welcome */}
              <div className="flex-1">
                <p className="text-lg font-semibold text-amber-900 mb-1">
                  Welcome{user?.firstName ? `, ${user.firstName}` : "!"}
                </p>
                <p className="text-sm text-gray-700">
                  {user?.emailAddresses?.[0]?.emailAddress &&
                    `Logged in as: ${user.emailAddresses[0].emailAddress}`}
                </p>
                {user?.emailAddresses?.[0]?.emailAddress && (
                  <p className="text-xs text-red-700 mt-1">
                    Email:{" "}
                    <span className="font-mono">
                      {user.emailAddresses[0].emailAddress}
                    </span>
                  </p>
                )}
              </div>
              {/* Sign Out Button */}
              <div className="shrink-0">
                <SignOutButton>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold shadow-sm transition">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Your Trips</h2>
            {trips.length === 0 ? (
              <p>No trips found.</p>
            ) : (
              <ul className="space-y-4">
                {trips.map((trip) => (
                  <li
                    key={trip._id}
                    className="border rounded p-6 bg-white text-black shadow-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold">{trip.title}</h3>
                      <span className="text-sm bg-gray-200 rounded px-2 py-1 text-gray-700">
                        {trip.status ?? "Upcoming"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-1">
                      {trip.startDate?.slice(0, 10)} —{" "}
                      {trip.endDate?.slice(0, 10)}
                    </p>

                    {trip.destination?.name && (
                      <p className="text-sm text-gray-700 mb-1">
                        Destination: <strong>{trip.destination.name}</strong>
                      </p>
                    )}

                    {trip.tripType && (
                      <p className="text-sm text-gray-700 mb-1">
                        Type: <span className="italic">{trip.tripType}</span>
                      </p>
                    )}

                    {trip.createdAt && (
                      <p className="text-sm text-gray-500">
                        Booked on: {trip.createdAt.slice(0, 10)}
                      </p>
                    )}

                    {trip.documents?.length ? (
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-2">Documents:</p>
                        <ul className="space-y-2">
                          {trip.documents.map((doc) => {
                            const asset = doc.file?.asset;
                            if (!asset?.url) return null;

                            return (
                              <li
                                key={doc._key}
                                className="flex items-center justify-between bg-gray-100 p-3 rounded"
                              >
                                <div>
                                  <p className="font-medium text-sm text-gray-900">
                                    {asset.originalFilename ??
                                      "Untitled Document"}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {asset.mimeType ?? "Unknown file type"}
                                  </p>
                                  <p className="text-xs italic text-gray-500">
                                    Type:{" "}
                                    {doc.label
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(/^./, (str) =>
                                        str.toUpperCase()
                                      )}
                                  </p>
                                </div>
                                <a
                                  href={asset.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 text-sm font-medium underline hover:text-blue-800"
                                >
                                  View
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2">
                        No documents uploaded yet.
                      </p>
                    )}

                    <div className="mt-4">
                      <p className="text-sm font-semibold mb-2">
                        Upload Travel Documents:
                      </p>
                      <div className="space-y-3">
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
                              const fileAsset =
                                await sanityClient.assets.upload("file", file, {
                                  filename: file.name,
                                });
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
                              alert(
                                "Passport uploaded successfully. Refresh to see it."
                              );
                            }}
                            className="block w-full border border-gray-300 rounded p-2 text-sm"
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
                              const fileAsset =
                                await sanityClient.assets.upload("file", file, {
                                  filename: file.name,
                                });
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
                              alert(
                                "Flight ticket uploaded successfully. Refresh to see it."
                              );
                            }}
                            className="block w-full border border-gray-300 rounded p-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {(trip.passportUploads?.length ||
                      trip.flightTicketUploads?.length) && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-2">
                          Uploaded Documents:
                        </p>
                        <ul className="space-y-2">
                          {trip.passportUploads?.map((file, index) => (
                            <li
                              key={`passport-${index}`}
                              className="flex items-center justify-between bg-gray-100 p-3 rounded"
                            >
                              <div>
                                <p className="font-medium text-sm text-gray-900">
                                  {file.asset?.originalFilename ??
                                    "Untitled Passport File"}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {file.asset?.mimeType}
                                </p>
                                <p className="text-xs italic text-gray-500">
                                  Type: Passport Upload
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <a
                                  href={file.asset?.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 text-sm font-medium underline hover:text-blue-800"
                                >
                                  View
                                </a>
                                <button
                                  className="text-red-600 text-xs hover:underline"
                                  onClick={async () => {
                                    const confirmed = window.confirm(
                                      `Are you sure you want to delete this passport?\n\nAsset Ref: ${file.asset?._ref}`
                                    );
                                    if (!confirmed || !file.asset?._ref) return;
                                    const res = await fetch(
                                      "/api/delete-upload",
                                      {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          tripId: trip._id,
                                          field: "passportUploads",
                                          assetRef: file.asset._ref,
                                        }),
                                      }
                                    );
                                    const data = await res.json();
                                    if (res.ok) {
                                      alert(
                                        "Passport removed. Refresh to see changes."
                                      );
                                    } else {
                                      alert(`Failed to remove: ${data.error}`);
                                    }
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            </li>
                          ))}

                          {trip.flightTicketUploads?.map((file, index) => (
                            <li
                              key={`ticket-${index}`}
                              className="flex items-center justify-between bg-gray-100 p-3 rounded"
                            >
                              <div>
                                <p className="font-medium text-sm text-gray-900">
                                  {file.asset?.originalFilename ??
                                    "Untitled Ticket File"}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {file.asset?.mimeType}
                                </p>
                                <p className="text-xs italic text-gray-500">
                                  Type: Flight Ticket
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <a
                                  href={file.asset?.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 text-sm font-medium underline hover:text-blue-800"
                                >
                                  View
                                </a>
                                <button
                                  className="text-red-600 text-xs hover:underline"
                                  onClick={async () => {
                                    const confirmed = window.confirm(
                                      `Are you sure you want to delete this ticket?\n\nAsset Ref: ${file.asset?._ref}`
                                    );
                                    if (!confirmed || !file.asset?._ref) return;
                                    const res = await fetch(
                                      "/api/delete-upload",
                                      {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          tripId: trip._id,
                                          field: "flightTicketUploads",
                                          assetRef: file.asset._ref,
                                        }),
                                      }
                                    );
                                    const data = await res.json();
                                    if (res.ok) {
                                      alert(
                                        "Ticket removed. Refresh to see changes."
                                      );
                                    } else {
                                      alert(`Failed to remove: ${data.error}`);
                                    }
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
