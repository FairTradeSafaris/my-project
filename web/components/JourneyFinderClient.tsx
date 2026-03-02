"use client";

import { useEffect, useState } from "react";
import JourneyFinderClientNoAuth from "../components/JourneyFinderClientNoAuth";
import JourneyFinderClientWithAuth from "../components/JourneyFinderClientWithAuth";

export default function JourneyFinderClient() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    setHasConsent(consent === "accepted");
  }, []);

  if (!hasConsent) return <JourneyFinderClientNoAuth />;
  return <JourneyFinderClientWithAuth />;
}
