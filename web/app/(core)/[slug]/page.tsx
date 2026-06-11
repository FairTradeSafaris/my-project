import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import PillarContent from "@/components/PillarContent";
import SafariLoader from "@/components/SafariLoader";
import Link from "next/link";
import Script from "next/script";

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
  params: { slug: string };
}) {
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
    { slug: params.slug },
  );

  if (!data) {
    return { title: "Page Not Found" };
  }

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
      url:
        data.canonicalUrl || `https://www.fairtradesafaris.com/${params.slug}`,
      images: image ? [{ url: image }] : [],
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },

    alternates: {
      canonical:
        data.canonicalUrl || `https://www.fairtradesafaris.com/${params.slug}`,
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
  const headline = data?.heroHeadline || data?.title;
  const subheadline = data?.heroSubheadline;

  const faqs: FAQItem[] = data.faq || [];

  return (
    <SafariLoader>
      <main className="bg-white text-black min-h-screen relative">
        {/* AI Article Schema */}
        {data.aiSummary && (
          <Script
            id="article-schema"
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: headline,
                description: data.aiSummary,
                publisher: {
                  "@type": "Organization",
                  name: "Fair Trade Safaris",
                },
              }),
            }}
          />
        )}

        {/* FAQ Schema */}
        {faqs.length > 0 && (
          <Script
            id="faq-schema"
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map((item) => ({
                  "@type": "Question",
                  name: item.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.answer
                      ?.map((block) =>
                        block.children?.map((child) => child.text).join(""),
                      )
                      .join(" "),
                  },
                })),
              }),
            }}
          />
        )}

        {/* HERO */}
        <section className="relative w-full h-[90vh] min-h-[600px] max-h-[1000px] overflow-hidden bg-black">
          {videoUrl && (
            <video
              className="absolute inset-0 w-full h-full object-cover animate-heroZoom"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />

          <div className="relative z-10 h-full flex items-end animate-fadeInSlow">
            <div className="w-full max-w-6xl mx-auto px-6 pb-14">
              <h1 className="text-white text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]">
                {headline}
              </h1>

              {subheadline && (
                <p className="mt-5 max-w-2xl text-white/90 text-base sm:text-lg leading-relaxed">
                  {subheadline}
                </p>
              )}

              {data?.heroCTA?.text && data?.heroCTA?.link && (
                <a
                  href={data.heroCTA.link}
                  className="inline-block mt-8 bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition"
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
          <section className="max-w-3xl mx-auto px-6 py-5">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10 tracking-tight">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {faqs.map((item, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg px-5 py-4 bg-white/80 backdrop-blur-sm shadow-[0_6px_18px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_26px_rgba(0,0,0,0.08)] transition-all"
                >
                  <h3 className="text-[17px] font-semibold text-gray-900 mb-1">
                    {item.question}
                  </h3>

                  <div className="text-[15px] text-gray-600 leading-relaxed space-y-2">
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
            <div className="text-center mt-12">
              <Link
                href="/faq"
                className="text-sm font-medium text-gray-900 underline underline-offset-4 hover:text-gray-700"
              >
                Explore More African Safari FAQs →
              </Link>
            </div>
          </section>
        )}
      </main>
    </SafariLoader>
  );
}
