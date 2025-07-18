// app/destination/[slug]/page.tsx

import Image from "next/image";
import { notFound } from "next/navigation";

const destinations: Record<
  string,
  {
    title: string;
    heroImage: string;
    description: string;
    highlights: string[];
  }
> = {
  "south-africa": {
    title: "South Africa",
    heroImage: "/images/south-africa.jpg",
    description:
      "South Africa is a top safari destination known for Kruger National Park, the Big Five, and diverse landscapes from savannah to coastline.",
    highlights: [
      "Kruger National Park",
      "Table Mountain",
      "Cape Winelands",
      "Garden Route",
    ],
  },
  tanzania: {
    title: "Tanzania",
    heroImage: "/images/tanzania.jpg",
    description:
      "Tanzania offers legendary safaris through the Serengeti and Ngorongoro Crater, with Mount Kilimanjaro towering above.",
    highlights: [
      "Serengeti National Park",
      "Ngorongoro Crater",
      "Mount Kilimanjaro",
      "Zanzibar beaches",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(destinations).map((slug) => ({ slug }));
}

export default function DestinationPage({
  params,
}: {
  params: { slug: string };
}) {
  const destination = destinations[params.slug];
  if (!destination) return notFound();

  return (
    <main className="bg-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Image
          src={destination.heroImage}
          alt={destination.title}
          width={1200}
          height={600}
          className="w-full h-72 object-cover rounded-xl mb-6"
        />

        <h1 className="text-4xl font-bold mb-2">{destination.title}</h1>

        <p className="text-gray-700 text-lg mb-4">{destination.description}</p>

        {destination.highlights.length > 0 && (
          <ul className="mt-6 space-y-2">
            {destination.highlights.map((point, i) => (
              <li key={i} className="text-sm text-gray-600">
                • {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
