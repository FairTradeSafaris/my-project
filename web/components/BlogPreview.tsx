import Link from "next/link";
import { draftMode } from "next/headers";
import { client as sanity } from "@/lib/sanity";

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage?: {
    asset: { url: string };
    alt?: string;
  };
};

export default async function BlogPreview() {
  const { isEnabled } = await draftMode();

  const posts: BlogPost[] = await sanity.fetch(
    `*[
      _type == "blog" &&
      defined(slug.current) &&
      coalesce(noIndex, false) == false
    ]
    | order(publishedAt desc)[0..2]{
      _id,
      title,
      "slug": slug.current,
      summary,
      coverImage {
        asset->{url},
        alt
      }
    }`,
    {},
    {
      perspective: isEnabled ? "previewDrafts" : "published",
    },
  );

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* LEFT: Strong Editorial Anchor */}
          <div className="lg:col-span-1 relative pl-6">
            {/* Accent rule */}
            <div className="absolute left-0 top-1 h-20 w-[3px] bg-black" />

            <span className="block text-xs uppercase tracking-[0.25em] text-gray-500 mb-3">
              Journal
            </span>

            <h3 className="text-4xl font-bold leading-tight tracking-tight">
              Safari
              <br />
              Insights
            </h3>

            <p className="text-sm text-gray-600 mt-4 max-w-[16rem]">
              Stories, travel tips, and on-the-ground perspectives from Africa.
            </p>

            <Link
              href="/blog/"
              className="inline-block mt-5 text-sm font-semibold underline underline-offset-4"
            >
              Visit the Journal →
            </Link>
          </div>

          {/* RIGHT: Blog cards */}
          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {posts.map((post) => (
              <li key={post._id}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  {post.coverImage?.asset?.url && (
                    <img
                      src={post.coverImage.asset.url}
                      alt={post.coverImage.alt || post.title}
                      className="mb-2 rounded-md aspect-[4/3] object-cover"
                    />
                  )}

                  <h4 className="text-sm font-medium leading-snug group-hover:underline">
                    {post.title}
                  </h4>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
