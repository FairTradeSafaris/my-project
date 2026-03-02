import { getSanityMetadata } from "@/lib/getSanityMetadata";
import type { Metadata } from "next";
import EthicalSustainableSafarisPage from "./ClientPage";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("ethicalsustainablesafaris");

  if (metadata?.other && "ld-json" in metadata.other) {
    delete metadata.other["ld-json"];
  }

  return metadata;
}

export default function Page() {
  return <EthicalSustainableSafarisPage />;
}
