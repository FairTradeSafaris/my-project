import { getSanityMetadata } from "@/lib/getSanityMetadata";
import { client } from "@/lib/sanity";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";

/* ===========================
   ✅ Metadata from Sanity
=========================== */
export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("privacy");

  if (metadata?.other && "ld-json" in metadata.other) {
    delete metadata.other["ld-json"];
  }

  return metadata;
}

/* ===========================
   ✅ Page Component
=========================== */
export default async function PrivacyPolicyPage() {
  const data = await client.fetch(`*[_type == "privacyPolicy"][0]{
    pageHeading,
    content
  }`);

  if (!data) {
    return <div className="p-8 text-red-500">Privacy policy not found.</div>;
  }

  return (
    <main className="min-h-screen text-black bg-[#fdf8f3]">
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">
          {data.pageHeading || "Privacy Policy"}
        </h1>
        <div className="prose prose-lg text-gray-700">
          <PortableText
            value={data.content}
            components={portableTextComponents}
          />
        </div>
      </section>
    </main>
  );
}
