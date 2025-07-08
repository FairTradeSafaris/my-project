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
      {/* Hero Section */}
      <section
        className="relative h-[350px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/sunset-safari.webp')` }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-10">
          <h1 className="text-4xl md:text-5xl font-bold max-w-2xl">
            {data.title}
          </h1>
        </div>
      </section>

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
