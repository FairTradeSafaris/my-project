import sanity from "../../lib/sanity";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import HeroWithSearch from "@/components/HeroWithSearch";

type HeroContent = {
  headline: string;
  subheadline: string;
  backgroundImage: {
    asset: {
      url: string;
    };
  };
  primaryCTA: string;
  secondaryCTA: string;
};

type WhyChooseBlock = {
  sectionTitle: string;
  reasons: {
    icon: string;
    title: string;
    description: string;
  }[];
};

type Journey = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  summary: string;
  duration: string;
  heroImage: {
    asset: {
      url: string;
    };
  };
  alt: string;
  ctaText: string;
};

export default async function Home() {
  const hero: HeroContent | null = await sanity.fetch(
    `*[_type == "hero"][0]{
      headline,
      subheadline,
      backgroundImage {
        asset->{url}
      },
      primaryCTA,
      secondaryCTA
    }`
  );

  const whyChoose: WhyChooseBlock | null = await sanity.fetch(
    `*[_type == "whyChoose"][0]{
      sectionTitle,
      reasons[] {
        icon,
        title,
        description
      }
    }`
  );

  const journeys: Journey[] = await sanity.fetch(
    `*[_type == "featuredJourney"]{
    _id,
    title,
    slug,
    summary,
    duration,
    heroImage {
      asset->{url}
    },
    alt,
    ctaText
  }`
  );

  if (!hero) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center text-red-600">
        <p>
          ⚠️ Hero content not found. Please add and publish it in Sanity Studio.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen font-poppins bg-white text-black">
      {/* Hero Section */}
      <HeroWithSearch />

      {/* Why Travel With Us Section */}
      {whyChoose && (
        <section className="py-20 bg-white text-black">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-12">
              {whyChoose.sectionTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
              {whyChoose.reasons.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#fefcf9] rounded-2xl shadow-md p-6 flex flex-col items-start"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2 min-h-[3rem]">
                    {item.title}
                  </h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* As Seen On */}
      <section className="bg-[#f9f9f9] py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8">
            As Seen On
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 opacity-80">
            <img
              src="/logos/CBS_logo.svg"
              alt="CBS"
              className="h-10 object-contain"
            />
            <img
              src="/logos/usa-today.svg"
              alt="USA Today"
              className="h-10 object-contain"
            />
            <img
              src="/logos/fox.svg"
              alt="Fox"
              className="h-10 object-contain"
            />
            <img
              src="/logos/nbc.svg"
              alt="NBC"
              className="h-10 object-contain"
            />
          </div>
        </div>
      </section>

      {/* Featured Journeys */}
      {journeys.length > 0 && (
        <section className="py-20 bg-[#f9f9f9] text-black">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-12">Featured Journeys</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
              {journeys.map((j) => (
                <div
                  key={j._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  {j.heroImage?.asset?.url && (
                    <img
                      src={j.heroImage.asset.url}
                      alt={j.alt || "Journey image"}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-2">{j.title}</h3>
                    <p className="text-sm text-gray-500 mb-1">{j.duration}</p>
                    <p className="text-gray-700 mb-4">{j.summary}</p>
                    {j.slug?.current && (
                      <Link href={`/journeys/${j.slug.current}`}>
                        <span className="inline-block bg-black text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-800 transition">
                          {j.ctaText}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/journeys"
              className="mt-10 inline-block text-black border border-black px-5 py-2 rounded-full font-semibold hover:bg-black hover:text-white transition"
            >
              See All Itineraries →
            </Link>
          </div>
        </section>
      )}
      <section className="relative w-full bg-[#d8c3a5] py-20 flex items-center justify-center overflow-hidden">
        {/* Left Illustration (Lion + Tree) */}
        <img
          src="/icons/lion-left.svg"
          className="absolute bottom-6 left-[1%] md:left-[20%] h-[110px] md:h-[250px] object-contain z-0 opacity-80 pointer-events-none"
        />

        {/* Right Illustration (Safari Jeep) */}
        <img
          src="/icons/safari-jeep-right.svg"
          className="absolute bottom-0 right-[0%] md:right-[20%] h-[115px] md:h-[250px] object-contain z-0 opacity-80 pointer-events-none"
        />

        {/* CTA Text */}
        <div className="relative z-10 text-center px-6 max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Plan Your Dream Safari?
          </h2>
          <p className="text-md md:text-lg mb-6">
            Talk to our local experts and start customizing your perfect trip to
            Africa today.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
          >
            Start Planning
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">What Our Guests Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <p className="text-lg italic mb-4">
                “The most unforgettable experience of my life.”
              </p>
              <h4 className="font-semibold text-gray-800">— Jamie P.</h4>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <p className="text-lg italic mb-4">
                “I felt safe, inspired, and completely at ease the entire time.”
              </p>
              <h4 className="font-semibold text-gray-800">— Maria N.</h4>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <p className="text-lg italic mb-4">
                “Every detail was perfect — you’ve gained a lifelong customer.”
              </p>
              <h4 className="font-semibold text-gray-800">— Kevin R.</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}

      {/* 🔥 Chat Widget added here */}
      <ChatWidget />
    </main>
  );
}
