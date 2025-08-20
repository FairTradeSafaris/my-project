// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import groq from "groq";
import { client } from "@/lib/sanity";
import CommentFormWrapper from "@/components/CommentFormWrapper";
import { LikeButton } from "@/components/LikeButton";
import BlogContent from "@/components/BlogContent";
import ShareButtons from "@/components/ShareButtons";
import type { Block } from "@/types/block";
import Link from "next/link";

export const revalidate = 0;

type BlogPost = {
  _id: string;
  title: string;
  summary: string;
  publishedAt: string;
  coverImage?: { url: string; alt?: string };
  heroImage?: {
    image?: { url: string; alt?: string };
    text?: string;
    alignment?: string;
  };
  heroGalleryImage?: { imageUrl?: string; alt?: string; imageId?: string };
  content: Block[];
  likes?: number;
  author?: { name: string; image?: string; bio?: string };
  tags?: string[];
};

type Comment = {
  _id: string;
  name: string;
  comment: string;
  _createdAt: string;
};

type Journey = {
  _id: string;
  title: string;
  slug: { current: string };
  region?: { title: string };
  heroImage?: { url: string; alt?: string };
};

type LikedBlog = {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: string;
  alt?: string;
  likes?: number;
};

export async function generateStaticParams() {
  const slugs = await client.fetch(
    groq`*[_type == "blog" && defined(slug.current)]{ "slug": slug.current }`
  );
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const query = groq`*[_type == "blog" && slug.current == $slug][0]{
    _id,
    title,
    summary,
    publishedAt,

    // cover image
    "coverImage": {
      "url": coverImage.asset->url,
      "alt": coverImage.alt
    },

    // top-level hero (may be removed later)
    heroImage {
      text,
      alignment,
      "image": {
        "url": image.asset->url,
        "alt": image.alt
      }
    },

    // optional hero gallery pointer
    "heroGalleryImage": heroGalleryImage->{
      alt,
      "imageUrl": image.asset->url,
      "imageId": image.asset->_id
    },

    // ✅ Pull author reference
    author->{
      name,
      bio,
      "image": image.asset->url
    },

    // ✅ CONTENT: normalize all images, including heroBlock
    content[] {
      ...,

      // ✅ heroBlock (top-of-page banner block)
      _type == "heroBlock" => {
        ...,
        text,
        alignment,
        "image": {
          "url": image.asset->url,
          "alt": image.alt
        },
        galleryImage->{
          alt,
          "imageUrl": image.asset->url,
          "imageId": image.asset->_id
        }
      },

      // simple image blocks
      image {
        "url": asset->url,
        "alt": alt
      },

      // text+image block
      _type == "textImage" => {
        ...,
        image {
          "url": asset->url,
          "alt": alt
        },
        galleryImage-> {
          alt,
          "imageUrl": image.asset->url,
          "imageId": image.asset->_id
        }
      },

      // gallery block: array of flat items
      _type == "galleryBlock" => {
        ...,
        "images": images[] {
          "url": asset->url,
          "alt": alt
        }
      },

      // smart carousel
      _type == "smartCarousel" => {
        ...,
        "slides": slides[] {
          ...,
          image {
            "url": asset->url,
            "alt": alt
          }
        }
      }
    }
  }`;

  return await client.fetch(query, { slug });
}

async function getApprovedComments(postId: string): Promise<Comment[]> {
  const query = groq`*[_type == "comment" && post._ref == $postId && approved == true] 
    | order(_createdAt desc) {
      _id,
      name,
      comment,
      _createdAt
    }`;
  return await client.fetch(query, { postId }, { cache: "no-store" });
}

async function getFeaturedJourneys(): Promise<Journey[]> {
  return await client.fetch(
    groq`*[_type == "journey" && featuredOnHome == true][0...3]{
      _id,
      title,
      "slug": slug,
      region->{ title },
      "heroImage": {
        "url": heroImage.asset->url,
        "alt": heroImage.alt
      }
    }`
  );
}

async function getMostLikedBlogs(): Promise<LikedBlog[]> {
  return await client.fetch(
    groq`*[_type == "blog"] | order(likes desc, publishedAt desc)[0...3]{
      _id,
      title,
      "slug": slug,
      "coverImage": coverImage.asset->url,
      "alt": coverImage.alt,
      likes
    }`
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    console.log("❌ No post found for slug:", slug);
    return { title: "Not Found" };
  }
  console.log("✅ HERO IMAGE DEBUG:", JSON.stringify(post.heroImage, null, 2));

  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.summary };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return notFound();

  const comments = await getApprovedComments(post._id);
  const featuredJourneys = await getFeaturedJourneys();
  const mostLikedBlogs = await getMostLikedBlogs();

  return (
    <main className="bg-[#fdf8f3] text-black min-h-screen px-0">
      {/* heroBlock now rendered inline via BlogContent */}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-4 gap-10 mt-10">
        <div className="lg:col-span-3">
          <BlogContent blocks={post.content} />
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <LikeButton postId={post._id} initialLikes={post.likes || 0} />
            <ShareButtons title={post.title} />
          </div>
        </div>

        <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center space-y-4">
          {post.author?.image && (
            <div className="flex justify-center">
              <img
                src={post.author.image}
                alt={post.author.name}
                className="w-28 h-28 rounded-full object-cover shadow-md border-2 border-amber-600"
              />
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {post.author?.name || "Unknown Author"}
            </h2>
            {post.author?.bio && (
              <p className="text-sm text-gray-600 mt-1">{post.author.bio}</p>
            )}
          </div>

          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="bg-white shadow p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-2 text-gray-800">Tags</h4>
              <ul className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full hover:bg-amber-700 transition"
                    >
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {featuredJourneys.length > 0 && (
            <div className="bg-[#f5f3ef] p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-3">
                🌍 Featured Journeys
              </h4>
              <ul className="space-y-4">
                {featuredJourneys.map((j) => (
                  <li key={j._id}>
                    <Link
                      href={`/journey?q=${j.title}&open=true`}
                      className="bg-white p-2 rounded shadow flex gap-3 items-center hover:bg-gray-50 transition"
                    >
                      {j.heroImage?.url && (
                        <img
                          src={j.heroImage.url}
                          alt={j.heroImage.alt || j.title}
                          width={60}
                          height={60}
                          className="rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div>
                        <h5 className="text-sm font-bold text-gray-800">
                          {j.title}
                        </h5>
                        {j.region?.title && (
                          <p className="text-xs text-orange-600">
                            {j.region.title}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mostLikedBlogs.length > 0 && (
            <div className="bg-[#f5f3ef] p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-3">
                🔥 Most Liked Blogs
              </h4>
              <ul className="space-y-4">
                {mostLikedBlogs.map((b) => (
                  <li key={b._id}>
                    <Link
                      href={`/blog/${b.slug.current}`}
                      className="bg-white p-2 rounded shadow flex gap-3 items-center hover:bg-gray-50 transition"
                    >
                      {b.coverImage && (
                        <img
                          src={b.coverImage}
                          alt={b.alt || b.title}
                          width={60}
                          height={60}
                          className="rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div>
                        <h5 className="text-sm font-bold text-gray-800">
                          {b.title}
                        </h5>
                        <p className="text-xs text-gray-500 mt-1">
                          {b.likes ?? 0} likes
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-16">
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
              <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
              {comments.map((c) => (
                <div key={c._id} className="border rounded p-4 bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">{c.name}</p>
                  <p className="text-sm text-gray-700 mt-1">{c.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(c._createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
