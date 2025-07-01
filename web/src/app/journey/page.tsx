import { Suspense } from "react";
import JourneyFinderClient from "../../components/JourneyFinderClient";

export default function JourneyPage() {
  return (
    <Suspense fallback={<div>Loading journeys...</div>}>
      <JourneyFinderClient />
    </Suspense>
  );
}
