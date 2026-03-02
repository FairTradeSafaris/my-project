import type { Metadata } from "next";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import ClientHomeWrapper from "./ClientHomeWrapper";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("client-home");

  if (metadata?.other && "ld-json" in metadata.other) {
    delete metadata.other["ld-json"];
  }

  return metadata;
}

export default function ClientHomePage() {
  return <ClientHomeWrapper />;
}
