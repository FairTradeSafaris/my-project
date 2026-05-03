import { getAllBlogPosts, getAllTags } from "@/sanity/queries";
import BlogGrid from "./BlogGrid";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import type { Metadata } from "next";
import TagList from "@/components/TagList";
import HeroController from "@/components/HeroController";
import { client as sanity } from "@/lib/sanity";
// =============================
// SEO + STRUCTURED DATA
// =============================

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("blog");

  const canonicalUrl = "https://www.fairtradesafaris.com/blog/";

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: metadata.title,
    description: metadata.description,
    inLanguage: "en",
    isPartOf: {
      "@id": "https://www.fairtradesafaris.com/#website",
    },
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${canonicalUrl}#blog`,
    name: "Fair Trade Safaris Blog",
    url: canonicalUrl,
    publisher: {
      "@id": "https://www.fairtradesafaris.com/#organization",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.fairtradesafaris.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: canonicalUrl,
      },
    ],
  };

  const schemas = [webPageSchema, blogSchema, breadcrumbSchema];

  return {
    ...metadata,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      ...metadata.openGraph,
      url: canonicalUrl,
    },
    twitter: {
      ...metadata.twitter,
    },
    other: {
      "script:ld+json": JSON.stringify(schemas),
    },
  };
}
const heroData = await sanity.fetch(`
  *[_type == "hero" && scope == "blog"][0]{
    headline,
    subheadline,
    primaryCTA,
    secondaryCTA,
    action,
    primaryLink { href, label },
    backgroundImages[]{
      alt,
      desktopImage { asset-> },
      mobileImage { asset-> }
    }
  }
`);

// =============================
// PAGE
// =============================

export default async function BlogPage() {
  const [allPosts, allTags] = await Promise.all([
    getAllBlogPosts(),
    getAllTags(),
  ]);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <HeroController heroData={heroData} breadcrumbs={breadcrumbs} />

      <main className="min-h-screen bg-[#fdf8f3] text-black px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-6 text-center">
            Fair Trade Safaris Blog
          </h1>

          <p className="text-center text-gray-700 max-w-3xl mx-auto mb-10">
            Expert safari planning guides, African destination insights,
            wildlife travel advice, ethical tourism knowledge, and in-depth
            safari itineraries from the Fair Trade Safaris team.
          </p>

          <div className="mb-10">
            <TagList tags={allTags} visibleCount={10} />
          </div>

          <BlogGrid posts={allPosts} enableSearch={true} />
        </div>
      </main>
    </>
  );
}
