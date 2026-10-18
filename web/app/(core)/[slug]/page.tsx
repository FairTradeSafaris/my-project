import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import PillarContent from "@/components/PillarContent";
import SafariLoader from "@/components/SafariLoader";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { preload } from "react-dom";
import { DEFAULT_OG_IMAGE } from "@/lib/seoDefaults";
import {
  homeContainer,
  homeH2,
  homeTextLink,
} from "@/components/home/homeStyles";

export const revalidate = 0;

type PortableTextChild = {
  text: string;
};

type PortableTextBlock = {
  children?: PortableTextChild[];
};

type FAQItem = {
  question: string;
  answer: PortableTextBlock[];
};

const query = groq`
*[_type == "pillarPage" && slug.current == $slug][0]{
  title,
  slug,
  seoTitle,
  metaDescription,
  aiSummary,
  seoKeywords,
  canonicalUrl,
  noIndex,

  ogImage{
    asset->{url}
  },

  heroVideo{
    asset->{url}
  },

  heroPoster{
    asset->{url},
    alt
  },

  heroHeadline,
heroSubheadline,

heroCTA {
  text,
  link
},

  faq[]->{
    question,
    answer
  },

  content[]{
    ...,

    _type == "heroBlock" => {
      ...,
      "image": {
        "url": image.asset->url,
        "alt": image.alt,
        "caption": image.caption,
        "credit": image.credit
      }
    },

    _type == "textImage" => {
      ...,
      "image": {
        "url": image.asset->url,
        "alt": image.alt,
        "caption": image.caption,
        "credit": image.credit,
        "width": image.asset->metadata.dimensions.width,
        "height": image.asset->metadata.dimensions.height
      }
    },

    _type == "galleryBlock" => {
      ...,
      "images": images[]{
        "url": asset->url,
        "alt": alt,
        "caption": caption,
        "credit": credit,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height
      }
    },

    // ✅ THIS IS THE IMPORTANT PART
    _type == "bestTimeBlock" => {
      ...,
      section->{
        title,
        intro,
        note,
        regions[]{
          region->{
            title
          },
          periods[]{
            startMonth,
            endMonth,
            label,
            description,
            seasonType,
            priority,
            highlight
          }
        }
      }
    }
  }
}
`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await client.fetch(
    groq`
*[_type == "pillarPage" && slug.current == $slug][0]{
  title,
  seoTitle,
  metaDescription,
  canonicalUrl,
  noIndex,
  seoKeywords,
  ogImage{
    asset->{url}
  }
}
`,
    { slug },
  );

  // Unknown slug -> real 404 (this used to return 200 + "Page Not Found").
  if (!data) notFound();

  const canonical =
    data.canonicalUrl || `https://www.fairtradesafaris.com/${slug}/`;

  const title = data.seoTitle || data.title;
  const description = data.metaDescription;
  const image = data?.ogImage?.asset?.url;

  return {
    title,
    description,
    keywords: data.seoKeywords,

    robots: data.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },

    openGraph: {
      title,
      description,
      url: canonical,
      // og:image falls back to the site default when Sanity has no ogImage
      images: [{ url: image || DEFAULT_OG_IMAGE }],
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image || DEFAULT_OG_IMAGE],
    },

    alternates: {
      canonical,
    },
  };
}

export default async function CorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await client.fetch(query, { slug });

  if (!data) return notFound();

  const videoUrl = data?.heroVideo?.asset?.url;
  // Batch 3a: poster for the hero video (heroPoster, else the page's ogImage),
  // resized by Sanity's CDN. It is preloaded with high priority so it paints
  // first and becomes the LCP element instead of the multi-MB MP4.
  const posterRaw: string | undefined =
    data?.heroPoster?.asset?.url || data?.ogImage?.asset?.url;
  const posterUrl =
    posterRaw && posterRaw.includes("cdn.sanity.io") && !posterRaw.includes("?")
      ? `${posterRaw}?w=1920&q=70&auto=format&fit=max`
      : posterRaw;
  if (videoUrl && posterUrl) {
    preload(posterUrl, { as: "image", fetchPriority: "high" });
  }
  const headline = data?.heroHeadline || data?.title;
  const subheadline = data?.heroSubheadline;

  const faqs: FAQItem[] = data.faq || [];

  return (
    <SafariLoader>
      <main className="bg-white text-[#24170f] min-h-screen relative">
        {/* AI Article Schema (server-rendered; next/script beforeInteractive
            only injected it client-side). FAQPage is already emitted as a real
            <script> by (core)/[slug]/layout.tsx, so the duplicate here was removed. */}
        {data.aiSummary && (
          <JsonLd
            id="article-schema"
            data={{
              "@context": "https://schema.org",
              "@type": "Article",
              headline: headline,
              description: data.aiSummary,
              publisher: {
                "@type": "Organization",
                name: "Fair Trade Safaris",
              },
            }}
          />
        )}

        {/* HERO */}
        <section className="relative w-full h-[90vh] min-h-[600px] max-h-[1000px] overflow-hidden bg-black">
          {!videoUrl && posterUrl && (
            // No video in Sanity: show the poster/share image instead of a black box
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={posterUrl}
              alt={data?.heroPoster?.alt || headline || ""}
              className="absolute inset-0 w-full h-full object-cover animate-heroZoom"
              fetchPriority="high"
            />
          )}
          {videoUrl && (
            <video
              className="absolute inset-0 w-full h-full object-cover animate-heroZoom"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={posterUrl}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          )}

          {/* Batch 22 v2: homepage-style hero text (display only) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a100a] via-[#1a100a]/50 to-[#1a100a]/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a100a]/60 via-transparent to-transparent" />

          <div className="relative z-10 h-full flex items-end animate-fadeInSlow">
            <div className={`${homeContainer} pb-14 sm:pb-16`}>
              <h1 className="max-w-4xl text-[#fbf6ef] text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                {headline}
              </h1>

              {subheadline && (
                <p className="mt-5 max-w-2xl text-[#efe4d6] text-lg sm:text-xl leading-relaxed">
                  {subheadline}
                </p>
              )}

              {data?.heroCTA?.text && data?.heroCTA?.link && (
                <a
                  href={data.heroCTA.link}
                  className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-[#fbf6ef] px-7 text-[15px] font-semibold text-[#24170f] transition hover:bg-white"
                >
                  {data.heroCTA.text}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* PAGE CONTENT */}
        <PillarContent blocks={data.content} />

        {/* FAQ SECTION */}
        {faqs.length > 0 && (
          // Batch 22 v2: homepage-style FAQ (display only; same text/order/tags)
          <section className="bg-[#f7f3ec] py-12 md:py-16">
          <div className={homeContainer}>
          <div className="mx-auto max-w-[900px]">
            <h2 className={`${homeH2} text-center mb-8`}>
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#ebe1d3] bg-white px-6 py-5 shadow-[0_1px_2px_rgba(36,23,15,0.04),0_14px_32px_-22px_rgba(36,23,15,0.30)] md:px-7"
                >
                  <h3 className="text-[18px] font-semibold leading-snug text-[#24170f] mb-2">
                    {item.question}
                  </h3>

                  <div className="text-[16px] leading-7 text-[#5c4a3d] space-y-2">
                    {item.answer?.map((block, index) => (
                      <p key={index}>
                        {block.children?.map((child) => child.text).join("")}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* MORE FAQ LINK */}
            <div className="text-center mt-8">
              <Link
                href="/faq"
                className={homeTextLink}
              >
                Explore More African Safari FAQs →
              </Link>
            </div>
          </div>
          </div>
          </section>
        )}
      </main>
    </SafariLoader>
  );
}
