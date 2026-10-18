import { groq } from "next-sanity";
import { client } from "@/lib/sanity";
import Image from "@/components/SanityImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JourneyCard from "@/components/JourneyCard";
import { DEFAULT_OG_IMAGE, ogImageUrl } from "@/lib/seoDefaults";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// SEO: this page used to inherit the parent destination's title, description
// and canonical (13 duplicate title/description pairs, sitemap listing
// non-canonical URLs). It lists itineraries, so give it its own metadata and a
// self-referencing canonical.
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  // heroUrl (metadata-only field) = destination hero image or its gallery
  // image, used for og:image; falls back to the site default.
  const d: { title?: string; heroUrl?: string } | null = await client.fetch(
    groq`*[_type == "destination" && slug.current == $slug][0]{
      title,
      "heroUrl": coalesce(heroImage.image.asset->url, heroImage.galleryImage->image.asset->url)
    }`,
    { slug },
  );
  if (!d?.title) notFound();

  const url = `https://www.fairtradesafaris.com/destination/${slug}/safaris/`;
  // Batch 16: shorter templates (titles <= 60, descriptions <= 155)
  const title = `${d.title} Safari Itineraries | Fair Trade Safaris`;
  const description = clip(
    `Browse handcrafted ${d.title} safari itineraries: private, conservation-focused journeys with local guides and hand-picked lodges.`,
  );
  const image = d.heroUrl ? ogImageUrl(d.heroUrl) : DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
// Cut text to <= max characters on a whole word.
function clip(text: string, max = 155): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const end = cut.lastIndexOf(" ");
  return `${(end > 0 ? cut.slice(0, end) : cut).replace(/[\s,;:.\-–—]+$/, "")}…`;
}

// Batch 16: intro paragraph per country (keyed by destination slug), written
// from facts already on each country page. Countries not listed here keep the
// general text. Kept in code because adding a field would change the
// destination schema.
const SAFARIS_INTROS: Record<string, string> = {
  botswana:
    "Botswana offers one of Africa’s most exclusive and untouched safari experiences. Glide through the Okavango Delta by mokoro canoe, track elephants in Chobe and enjoy abundant wildlife in vast, crowd-free reserves. Our 6-day Chobe and Okavango Delta journeys come in two styles, a classic safari escape or a luxury safari, both with local guides and eco-luxe lodges. Every journey supports local communities and conservation, blending luxury with purpose.",
  madagascar:
    "Madagascar is a living museum of biodiversity, home to thousands of species found nowhere else on Earth. Watch playful lemurs in lush rainforest, stand beneath towering baobabs and explore the limestone pinnacles of Tsingy. Add pristine beaches and vibrant local culture and you have a dream destination for eco-travelers and wildlife lovers. Browse our Madagascar journey below, or talk to us about tailoring a longer stay around the experiences that matter most to you.",
  "mount-kilimanjaro":
    "Mount Kilimanjaro, the Roof of Africa, rises to 5,895 meters and is a bucket-list climb for adventurers. The trek passes through remarkably varied ecosystems, from rainforest to alpine desert, before rewarding you with breathtaking summit views. Our Climb Kilimanjaro journey (8 days / 7 nights) follows the Lemosho Route. Prefer to stay on the plains? Kilimanjaro’s snow-capped peak also makes a stunning backdrop to safaris in Amboseli and northern Tanzania.",
  mozambique:
    "Mozambique offers a unique blend of barefoot luxury, vibrant culture and ecological richness. Relax on the coral-fringed islands of Bazaruto, wander the historic streets of Ilha de Moçambique and enjoy secluded beaches, world-class diving and meaningful marine conservation. Choose Bazaruto Bliss, a 7-day luxury island retreat, or Beneath African Skies, an 8-day Mozambique experience. Both make a perfect beach finale to a safari elsewhere in Southern Africa.",
  namibia:
    "Namibia captivates with stark beauty and a sense of vast, untouched wilderness. Climb the iconic red dunes of Sossusvlei, explore the eerie Skeleton Coast and watch wildlife gather in Etosha National Park, where every corner is a photographer’s dream. Our 9-day journeys take you from the desert to Etosha, either as a classic safari journey or a luxury safari, perfect for travelers seeking solitude, adventure and dramatic landscapes.",
  rwanda:
    "Rwanda, the Land of a Thousand Hills, is one of Africa’s most inspiring destinations. In Volcanoes National Park you trek through misty, emerald forests to spend time with wild mountain gorillas, a truly life-changing encounter. Beyond the forest, Kigali’s modern art scene and Rwanda’s powerful story of renewal add depth to every visit. Our Gorilla Trekking Escape (4 days / 3 nights) is a focused introduction, and every trip supports conservation and local communities.",
  seychelles:
    "The Indian Ocean Islands bring serene beauty and rich culture together. Wander the spice-scented streets of Zanzibar, swim in the crystal lagoons of Mauritius or relax among the granite boulders of the Seychelles. Dive coral reefs, unwind in private beachfront villas and soak up local traditions. Perfect for sun-seekers, honeymooners and explorers alike, these islands are an idyllic place for barefoot luxury after time in the bush.",
  uganda:
    "Uganda, the Pearl of Africa, is where dense rainforest, rare wildlife and raw adventure meet. Trek mountain gorillas in Bwindi Impenetrable Forest, track chimpanzees in Kibale and enjoy savannah safaris in Queen Elizabeth National Park, with boat cruises along the Nile. The dry seasons offer the best gorilla trekking, though rainforest adventures are possible all year. Our 4-day gorilla treks from Kigali reach Bwindi or Mgahinga, in classic or luxury style.",
  zambia:
    "Zambia is Africa at its most raw and thrilling. Known as the birthplace of the walking safari, it offers rare closeness to nature in South Luangwa and Lower Zambezi National Parks. Add the thunder of Victoria Falls and exceptional river-based game viewing, and Zambia rewards adventurous travelers looking for authentic, conservation-driven journeys. Browse our Zambia itineraries below, and know that every journey supports local communities and conservation.",
  zimbabwe:
    "Zimbabwe is a land of dramatic landscapes, rich history and thrilling safari experiences. Feel the thundering majesty of Victoria Falls, explore the wildlife-rich plains of Hwange National Park and discover the ancient mystery of the Great Zimbabwe ruins. It is ideal for explorers seeking authentic, off-the-beaten-path luxury. Our 3-day Victoria Falls add-ons, in 4-star or luxury style, are an easy way to add the Falls to a wider safari.",
};

type Journey = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  duration?: string;
  price?: number;
  imageUrl?: string;
  alt?: string;
  region?: {
    title?: string;
  };
};
const destinationQuery = groq`
*[_type == "destination" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  heroImage{
    image{asset->{url}, alt},
    galleryImage->{
      image{asset->{url}},
      alt
    }
  }
}
`;

const journeysQuery = groq`
*[
  _type == "journey" &&
  references($destinationId)
]{
  _id,
  title,
  "slug": slug.current,
  summary,
  duration,
  price,
  "imageUrl": heroImage.asset->url,
  alt,
  region->{ title }
}
`;

export default async function SafarisPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Get destination
  const destination = await client.fetch(destinationQuery, { slug });

  if (!destination) notFound();

  // 2. Get journeys for this destination
  const journeys = await client.fetch(journeysQuery, {
    destinationId: destination._id,
  });

  const heroUrl =
    destination?.heroImage?.image?.asset?.url ||
    destination?.heroImage?.galleryImage?.image?.asset?.url;

  return (
    <main className="bg-white text-gray-900">
      {/* HERO */}
      <section className="relative w-full h-[50vh] min-h-[400px]">
        {heroUrl && (
          <Image
            src={heroUrl}
            alt={destination.title}
            fill
            className="object-cover"
            priority
          />
        )}

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
          <h1 className="text-4xl text-white font-bold">
            {destination.title} Safaris & Itineraries
          </h1>
          <p className="text-white/80 mt-2 max-w-xl">
            Explore handcrafted safari journeys designed to immerse you in{" "}
            {destination.title}’s landscapes, wildlife, and culture.
          </p>
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-6 mt-6 text-sm text-gray-500">
        <Link href="/">Home</Link> /{" "}
        <Link href="/destination/">Destinations</Link> /{" "}
        <Link href={`/destination/${slug}/`}>{destination.title}</Link> / Safaris
      </div>

      {/* INTRO */}
      <section className="max-w-4xl mx-auto px-6 py-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Discover {destination.title}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {SAFARIS_INTROS[slug] ?? (
            <>
              From iconic wildlife encounters to immersive cultural experiences,
              browse our curated {destination.title} safari itineraries and
              find the journey that fits your travel style.
            </>
          )}
        </p>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {journeys.length === 0 ? (
          <p className="text-center text-gray-500">
            No itineraries available yet.
          </p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {journeys.map((j: Journey) => (
              <JourneyCard
                key={j._id}
                journeyId={j._id}
                slug={j.slug}
                title={j.title}
                summary={j.summary}
                imageUrl={j.imageUrl}
                alt={j.alt}
                price={j.price}
                duration={j.duration}
                region={j.region?.title}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
