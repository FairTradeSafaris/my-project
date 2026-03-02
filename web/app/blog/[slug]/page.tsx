// app/blog/[slug]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import groq from "groq";
import { client } from "@/lib/sanity";
import CommentFormWrapper from "@/components/CommentFormWrapper";
import { LikeButton } from "@/components/LikeButton";
import BlogContent from "@/components/BlogContent";
import ShareButtons from "@/components/ShareButtons";
import Link from "next/link";
import { generateArticleSchema } from "@/lib/generateArticleSchema";
import type { Metadata } from "next";
import type { Block } from "@/types/block";
export const revalidate = 0;

type RelatedJourney = {
  _id: string;
  title: string;
  slug: string;
  heroImage?: string;
};
type RelatedBlog = {
  _id: string;
  title: string;
  slug: string;
  coverImage?: string;
  alt?: string;
};
type BlogPost = {
  _id: string;
  title: string;
  summary: string;
  publishedAt: string;
  updatedAt?: string;
  canonicalUrl?: string;
  structuredData?: string;
  coverImage?: { url: string; alt?: string };
  heroImage?: {
    image?: { url: string; alt?: string };
    text?: string;
    alignment?: string;
  };
  heroGalleryImage?: { imageUrl?: string; alt?: string; imageId?: string };
  content: Block[];
  likes?: number;
  author?: {
    name: string;
    image?: string;
    bio?: string;
    slug?: string;
  };
  tags?: {
    _id: string;
    title: string;
    slug: string;
  }[];
  relatedDestinations?: {
    _id: string;
    title: string;
    slug: string;
  }[];
};

type Comment = {
  _id: string;
  name: string;
  comment: string;
  _createdAt: string;
};

export async function generateStaticParams() {
  const slugs = await client.fetch(
    groq`*[_type == "blog" && defined(slug.current)]{ "slug": slug.current }`,
  );
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}
async function getPost(
  slug: string,
): Promise<(Omit<BlogPost, "content"> & { content: Block[] }) | null> {
  const query = groq`*[_type == "blog" && slug.current == $slug][0]{
    seoTitle,
    _id,
    title,
    summary,
    publishedAt,
    updatedAt,
    canonicalUrl,
    structuredData,
   "coverImage": {
  "url": coverImage.asset->url,
  "alt": coverImage.alt
},
heroImage {
  text,
  alignment,
  "image": {
    "url": image.asset->url,
    "alt": image.alt
  }
},
author->{
  name,
  bio,
  "image": image.asset->url,
  "slug": slug.current
},
content[] {
  ...,
  _type == "heroBlock" => {
    ...,
    text,
    alignment,
    "image": {
      "url": image.asset->url,
      "alt": image.alt
    }
  },
  _type == "textImage" => {
    ...,
    "image": {
      "url": image.asset->url,
      "alt": image.alt
    }
  },
  _type == "galleryBlock" => {
    ...,
    "images": images[]{
      "url": asset->url,
      "alt": alt
    }
  },
  _type == "smartCarousel" => {
    ...,
    "slides": slides[]{
      ...,
      "image": {
        "url": image.asset->url,
        "alt": image.alt
      }
    }
  }
},

likes,

tags[]->{
  _id,
  title,
  "slug": slug.current
},

relatedDestinations[]->{
  _id,
  title,
  "slug": slug.current
}


  }`;

  return await client.fetch(query, { slug });
}

async function getApprovedComments(postId: string): Promise<Comment[]> {
  return await client.fetch(
    groq`*[_type == "comment" && post._ref == $postId && approved == true] | order(_createdAt desc) {
      _id, name, comment, _createdAt
    }`,
    { postId },
    { cache: "no-store" },
  );
}
async function getRelatedJourneys(
  destinationId: string,
): Promise<RelatedJourney[]> {
  return await client.fetch(
    groq`*[_type == "journey" && references($destinationId)] 
      | order(publishedAt desc)[0...10]{
        _id,
        title,
        "slug": slug.current,
        "heroImage": heroImage.asset->url
      }`,
    { destinationId },
  );
}

async function getRelatedBlogs(destinationId: string): Promise<RelatedBlog[]> {
  return await client.fetch(
    groq`*[_type == "blog" && references($destinationId)] 
      | order(publishedAt desc)[0...3]{
        _id,
        title,
        "slug": slug.current,
        "coverImage": coverImage.asset->url,
        "alt": coverImage.alt
      }`,
    { destinationId },
  );
}
type Props = {
  params: { slug: string };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = props.params;

  const seo = await client.fetch(
    groq`*[_type == "blog" && slug.current == $slug][0]{
    title,
    seoTitle,
    summary,
    metaDescription,
    extendedDescription,
    canonicalUrl,
    noIndex,
    "ogImageUrl": ogImage.asset->url,
    "ogImageAlt": ogImage.alt
  }`,
    { slug },
  );

  const rawTitle =
    seo?.seoTitle ||
    seo?.title ||
    "Fair Trade Safaris – Ethical Luxury Safari Travel";

  // ✅ Remove any leading/trailing straight or curly quotes
  const cleanTitle = rawTitle.replace(/^["“”]+|["“”]+$/g, "").trim();
  console.log(
    "FINAL CLEAN TITLE:",
    cleanTitle,
    "|",
    JSON.stringify(cleanTitle),
  );
  const description =
    seo?.metaDescription ||
    seo?.summary ||
    seo?.extendedDescription ||
    "Explore ethical African safaris with heart, luxury, and purpose.";

  const canonical =
    seo?.canonicalUrl ?? `https://www.fairtradesafaris.com/blog/${slug}/`;

  const ogImage =
    seo?.ogImageUrl ?? "https://www.fairtradesafaris.com/images/default-og.jpg";

  return {
    title: cleanTitle,
    description,
    metadataBase: new URL("https://www.fairtradesafaris.com"),
    alternates: {
      canonical,
    },
    openGraph: {
      title: cleanTitle,
      description,
      url: canonical,
      siteName: "Fair Trade Safaris",
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seo?.ogImageAlt ?? cleanTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: seo?.noIndex !== true,
      follow: true,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (!slug) return notFound();

  const post = await getPost(slug);
  if (!post) return notFound();

  const relatedDestinations = post.relatedDestinations || [];

  // Fetch journeys + blogs for ALL destinations
  const journeysByDest = await Promise.all(
    relatedDestinations.map((d) => getRelatedJourneys(d._id)),
  );

  const blogsByDest = await Promise.all(
    relatedDestinations.map((d) => getRelatedBlogs(d._id)),
  );

  // Flatten + dedupe (by _id)
  const relatedJourneys = [
    ...new Map(journeysByDest.flat().map((j) => [j._id, j])).values(),
  ];

  const relatedBlogs = [
    ...new Map(blogsByDest.flat().map((b) => [b._id, b])).values(),
  ].filter((b) => b.slug !== slug); // don’t recommend the current post

  const comments = await getApprovedComments(post._id);

  const articleSchema = generateArticleSchema({
    slug: { current: slug },
    title: post.title,
    summary: post.summary,
    metaDescription: post.summary,
    seoKeywords: post.tags?.map((tag) => tag.title),

    coverImage: post.coverImage
      ? {
          asset: { url: post.coverImage.url },
          alt: post.coverImage.alt,
        }
      : undefined,

    authorName: post.author?.name,
    authorUrl: post.author?.slug
      ? `https://www.fairtradesafaris.com/authors/${post.author.slug}/`
      : undefined,
    authorImage: post.author?.image,

    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,

    canonicalUrl: `https://www.fairtradesafaris.com/blog/${slug}/`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <main className="bg-[#fdf8f3] text-black min-h-screen px-0">
        {/* Top Hero Banner */}
        {post.heroImage?.image?.url && (
          <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] overflow-hidden">
            <Image
              src={post.heroImage.image.url}
              alt={post.heroImage.image.alt || post.title}
              fill
              className="object-cover"
              priority
            />

            {post.heroImage.text && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-4">
                <h1 className="text-white text-3xl sm:text-5xl font-bold text-center max-w-4xl">
                  {post.heroImage.text}
                </h1>
              </div>
            )}
          </div>
        )}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-4 gap-10 mt-0">
          <div className="lg:col-span-3">
            {/* Top Hero Row */}
            <div className="flex flex-col lg:flex-row gap-6 items-start pt-6 mb-6">
              {post.coverImage?.url && (
                <div className="w-full lg:w-2/5 xl:w-1/3">
                  <Image
                    src={post.coverImage.url}
                    alt={post.coverImage.alt || post.title}
                    width={1600}
                    height={1000}
                    className="w-full h-auto rounded-lg shadow-md object-cover"
                    priority
                  />
                </div>
              )}

              <div className="w-full lg:w-3/5 xl:w-2/3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
                  {post.title}
                </h1>

                <p className="mt-4 text-gray-600 text-base sm:text-lg">
                  {post.summary}
                </p>
              </div>
            </div>

            <BlogContent blocks={post.content} />

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <LikeButton postId={post._id} initialLikes={post.likes || 0} />
              <ShareButtons title={post.title} />
            </div>

            {/* Comments Section */}
            <div className="mt-16">
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                  Ready to share your thoughts?
                </h2>
                <p className="mb-4 text-gray-600 text-sm">
                  We love hearing from mindful travelers. Leave a comment below.
                </p>
                <CommentFormWrapper postId={post._id} />
                {comments.length > 0 && (
                  <div className="mt-8 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Comments
                    </h3>
                    {comments.map((c) => (
                      <div
                        key={c._id}
                        className="border rounded p-4 bg-gray-50"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {c.name}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {c.comment}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(c._createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
          <aside className="lg:col-span-1 space-y-6 pt-4 pb-6 px-6">
            {relatedDestinations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">
                {/* Destination Pills */}
                <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-100">
                  <span className="w-full text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                    Related destinations
                  </span>

                  {relatedDestinations.map((d) => (
                    <Link
                      key={d._id}
                      href={`/destination/${d.slug}`}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition"
                    >
                      {d.title}
                    </Link>
                  ))}
                </div>

                {/* Related Journeys */}
                {relatedJourneys.length > 0 && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">
                      Related Journeys
                    </h3>

                    <ul className="space-y-4">
                      {relatedJourneys.map((j) => (
                        <li key={j._id}>
                          <Link
                            href={`/africansafariitineraries?q=${encodeURIComponent(j.title)}&open=true`}
                            className="flex items-center gap-3 group"
                          >
                            {j.heroImage && (
                              <div className="relative w-16 aspect-square flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                  src={j.heroImage}
                                  alt={j.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-800 group-hover:text-amber-700 transition">
                              {j.title}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Related Blogs */}
                {relatedBlogs.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">
                      Related Articles
                    </h3>

                    <ul className="space-y-4">
                      {relatedBlogs.map((b) => (
                        <li key={b._id}>
                          <Link
                            href={`/blog/${b.slug}`}
                            className="flex items-center gap-3 group"
                          >
                            {b.coverImage && (
                              <div className="relative w-16 aspect-square flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                  src={b.coverImage}
                                  alt={b.alt || b.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition"
                                />
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-800 group-hover:text-amber-700 transition">
                              {b.title}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Author Block */}
            {post.author?.slug && (
              <Link
                href={`/authors/${post.author.slug}`}
                className="block text-center bg-white p-4 rounded-lg shadow"
              >
                {post.author.image && (
                  <div className="flex justify-center">
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      width={112}
                      height={112}
                      className="rounded-full object-cover shadow-md border-2 border-amber-600"
                      unoptimized
                    />
                  </div>
                )}
                <div className="mt-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {post.author.name}
                  </h2>
                  {post.author.bio && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                      {post.author.bio}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-amber-700 font-medium hover:underline">
                    View profile →
                  </p>
                </div>
              </Link>
            )}

            {/* Tags */}
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="bg-white shadow p-4 rounded-lg">
                <h3 className="text-sm font-semibold mb-2 text-gray-800">
                  Tags
                </h3>

                <ul className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li key={tag._id}>
                      <Link
                        href={`/blog/tags/${tag.slug}`}
                        className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full hover:bg-amber-700 transition"
                      >
                        {tag.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
