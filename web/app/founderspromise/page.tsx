import { getSanityMetadata } from "@/lib/getSanityMetadata";
import type { Metadata } from "next";
import OurPromisePage from "./ClientPage"; // ✅ client component

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("founderspromise");

  if (metadata?.other && "ld-json" in metadata.other) {
    delete metadata.other["ld-json"];
  }

  return metadata;
}

export default function Page() {
  return <OurPromisePage />;
}
