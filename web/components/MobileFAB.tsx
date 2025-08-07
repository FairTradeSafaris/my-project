"use client";

import FABContainer from "./FabContainer";
import LeadMagnet from "./LeadMagnet";
import { useFAB } from "./FABProvider";

export default function MobileFABs() {
  const { fab } = useFAB();
  return (
    <FABContainer position="bottom-right">
      <LeadMagnet />
      {fab}
    </FABContainer>
  );
}
