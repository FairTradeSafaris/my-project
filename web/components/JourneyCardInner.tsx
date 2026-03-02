"use client";

import { useEffect, useState } from "react";
import JourneyCardPublic from "./JourneyCardPublic";
import JourneyCardWithAuth from "./JourneyCardWithAuth";
import type { JourneyCardProps } from "@/types/journey";

export default function JourneyCardInner(props: JourneyCardProps) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    setHasConsent(consent === "accepted");
  }, []);

  if (!hasConsent) return <JourneyCardPublic {...props} />;

  return <JourneyCardWithAuth {...props} />;
}
