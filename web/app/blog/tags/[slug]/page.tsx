import { getPostsByTagSlug, getTagBySlug, getAllTags } from "@/sanity/queries";
import BlogGrid from "../../BlogGrid";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_OG_IMAGE, ogImageUrl } from "@/lib/seoDefaults";
import {
  sanityDimensions,
  sanitySized,
  sanitySrcSet,
} from "@/lib/sanityImageLoader";

type Props = {
  params: Promise<{ slug: string }>;
};
type Tag = {
  _id: string;
  title: string;
  slug: string;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  // Unknown tag -> real 404 (was HTTP 200 + "Tag not found").
  if (!tag) notFound();

  // collapse stray spaces from Sanity ("Lion Safari " gave a double space)
  const title = `${(tag.title || "").replace(/\s+/g, " ").trim()} Articles | Fair Trade Safaris`;
  const description =
    tag.description ||
    `Explore articles about ${tag.title} and ethical African travel.`;
  const url = `https://www.fairtradesafaris.com/blog/tags/${slug}/`;
  // og:image = tag hero image, else the site default
  const image: string = tag.heroImage
    ? ogImageUrl(tag.heroImage)
    : DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: { title, description, url, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;

  const posts = await getPostsByTagSlug(slug);
  const tag = await getTagBySlug(slug);
  const allTags = await getAllTags();

  if (!tag) notFound();

  const filteredTags = (allTags as Tag[]).filter((t) => t.slug !== slug);

  const currentIndex = (allTags as Tag[]).findIndex((t) => t.slug === slug);

  // Number of tags to display per page
  const TAG_LIMIT = 12;

  let distributedTags: Tag[] = [];

  if (currentIndex !== -1) {
    const start = currentIndex % filteredTags.length;

    distributedTags = [
      ...filteredTags.slice(start, start + TAG_LIMIT),
      ...filteredTags.slice(
        0,
        Math.max(0, start + TAG_LIMIT - filteredTags.length),
      ),
    ];
  }

  return (
    <div className="space-y-20">
      {/* === TAG HEADER === */}
      {/* === TAG HEADER === */}
      <section className="relative">
        {tag.heroImage ? (
          <div className="relative h-[50vh] min-h-[420px] w-full">
            <img
              src={sanitySized(tag.heroImage, 1920)}
              srcSet={sanitySrcSet(tag.heroImage)}
              sizes="100vw"
              fetchPriority="high"
              width={sanityDimensions(tag.heroImage)?.width}
              height={sanityDimensions(tag.heroImage)?.height}
              alt={tag.alt || tag.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative z-10 flex items-center h-full">
              <div className="max-w-4xl mx-auto px-6 text-white">
                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
                  {tag.title}
                </h1>

                <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl">
                  {tag.description ||
                    `Explore our latest insights and stories about ${tag.title}.`}
                </p>

                <p className="mt-6 text-sm text-white/70">
                  {posts.length} {posts.length === 1 ? "Article" : "Articles"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-6 pt-20 pb-10">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              {tag.title}
            </h1>

            <p className="mt-6 text-lg text-neutral-600 max-w-2xl">
              {tag.description ||
                `Explore our latest insights and stories about ${tag.title}.`}
            </p>

            <p className="mt-6 text-sm text-neutral-500">
              {posts.length} {posts.length === 1 ? "Article" : "Articles"}
            </p>
          </div>
        )}
      </section>

      {/* === BLOG GRID === */}
      <BlogGrid posts={posts} heading="" enableSearch={false} />

      {/* === OTHER TAGS === */}
      {distributedTags?.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="text-2xl font-semibold mb-8">Explore More Topics</h2>

          <div className="flex flex-wrap gap-3">
            {distributedTags.map((t: Tag) => (
              <Link
                key={t._id}
                href={`/blog/tags/${t.slug}`}
                className="px-4 py-2 border border-neutral-300 rounded-full text-sm hover:bg-neutral-100 transition"
              >
                {t.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
