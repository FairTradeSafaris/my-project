import { client } from "@/lib/sanity";

import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";

export default async function PrivacyPolicyPage() {
  const data = await client.fetch(`*[_type == "privacyPolicy"][0]{
    title,
    content
  }`);

  if (!data) {
    return <div className="p-8 text-red-500">Privacy policy not found.</div>;
  }

  return (
    <main className="min-h-screen text-black bg-[#fdf8f3]">
      {/* Policy Content */}
      <section className="max-w-3xl mx-auto px-6 py-12">
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
