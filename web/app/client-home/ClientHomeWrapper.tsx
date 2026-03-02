"use client";

import dynamic from "next/dynamic";

const ClientHomeContent = dynamic(() => import("./ClientHomeContent"), {
  ssr: false,
});

export default function ClientHomeWrapper() {
  return <ClientHomeContent />;
}
