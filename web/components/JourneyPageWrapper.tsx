"use client";

import dynamic from "next/dynamic";

const JourneyFinderClient = dynamic(() => import("./JourneyFinderClient"), {
  ssr: false,
  loading: () => <div>Loading journeys...</div>,
});

export default function JourneyPageWrapper() {
  return <JourneyFinderClient />;
}
