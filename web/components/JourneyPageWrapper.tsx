"use client";

// Batch 16: no longer client-only. The finder is rendered on the server with
// the journeys the page fetched, so the HTML contains the full trip list
// (it used to show only "Loading journeys..." until JavaScript ran). Filters
// still work in the browser exactly as before.
import JourneyFinderClient from "./JourneyFinderClient";
import type { Journey } from "./journey-finder/types";

export default function JourneyPageWrapper({
  initialJourneys,
}: {
  initialJourneys?: Journey[];
}) {
  return <JourneyFinderClient initialJourneys={initialJourneys} />;
}
