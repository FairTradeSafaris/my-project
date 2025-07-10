import { client } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";

export default async function FoundersPromisePage() {
  const data = await client.fetch(`*[_type == "foundersPromise"][0]{
    title,
    content
  }`);

  return (
    <main className="min-h-screen text-black bg-[#fdf8f3] scroll-smooth">
      {/* Hero Section */}
      <section
        className="relative h-[350px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/founder-hero.webp')` }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-10">
          <h1 className="text-4xl md:text-5xl font-bold max-w-2xl">
            The Founder&amp;s Promise
          </h1>
          <p className="text-lg mt-2 max-w-xl">
            What S.A.F.E. Means — and Why It Matters
          </p>
        </div>
      </section>

      {/* Navigation Anchor Buttons */}
      <section className="max-w-4xl mx-auto px-6 py-10 flex flex-wrap gap-4 justify-center">
        <a href="#safe" className="px-4 py-2 bg-[#e0d7ce] rounded-full">
          S.A.F.E.
        </a>
        <a
          href="#sustainability"
          className="px-4 py-2 bg-[#e0d7ce] rounded-full"
        >
          Sustainability
        </a>
        <a href="#wildlife" className="px-4 py-2 bg-[#e0d7ce] rounded-full">
          Wildlife
        </a>
        <a href="#community" className="px-4 py-2 bg-[#e0d7ce] rounded-full">
          Community
        </a>
        <a href="#involvement" className="px-4 py-2 bg-[#e0d7ce] rounded-full">
          Guest Involvement
        </a>
      </section>

      {/* S.A.F.E. Section */}
      <section id="safe" className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6">What is S.A.F.E.?</h2>
        <div className="prose prose-lg text-gray-700">
          <PortableText
            value={data.safeContent}
            components={portableTextComponents}
          />
        </div>
      </section>

      {/* Sustainability Section */}
      <section id="sustainability" className="bg-white py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Sustainable Tourism at Fair Trade Safaris
          </h2>
          <div className="prose prose-lg text-gray-700">
            <PortableText
              value={data.sustainabilityContent}
              components={portableTextComponents}
            />
          </div>
        </div>
      </section>

      {/* Wildlife Conservation */}
      <section id="wildlife" className="bg-[#fdf8f3] py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Wildlife Conservation</h2>
          <div className="prose prose-lg text-gray-700">
            <PortableText
              value={data.wildlifeContent}
              components={portableTextComponents}
            />
          </div>
        </div>
      </section>

      {/* Community Empowerment */}
      <section id="community" className="bg-white py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Community Empowerment</h2>
          <div className="prose prose-lg text-gray-700">
            <PortableText
              value={data.communityContent}
              components={portableTextComponents}
            />
          </div>
        </div>
      </section>

      {/* Guest Involvement */}
      <section id="involvement" className="bg-[#fdf8f3] py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Guest Involvement</h2>
          <div className="prose prose-lg text-gray-700">
            <PortableText
              value={data.involvementContent}
              components={portableTextComponents}
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-[#e0d7ce] py-12 px-6">
        <h2 className="text-3xl font-bold mb-4">
          ✨ Ready to Travel With Purpose?
        </h2>
        <p className="mb-6 text-lg">
          Start planning a safari that changes lives — yours included.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/plan"
            className="px-6 py-3 bg-black text-white rounded-full"
          >
            Plan Your Impact Safari →
          </a>
          <a
            href="/partners"
            className="px-6 py-3 border border-black text-black rounded-full"
          >
            Meet Our Partners →
          </a>
        </div>
      </section>
    </main>
  );
}
