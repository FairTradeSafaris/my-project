"use client";

import { useEffect, useState } from "react";
import LeadMagnetWrapper from "@/components/LeadMagnetWrapper";

export default function LeadMagnetGate() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent === "accepted") {
      setAllowed(true);
    }
  }, []);

  if (!allowed) return null;

  return <LeadMagnetWrapper />;
}
