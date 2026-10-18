import Link from "next/link";
import { draftMode } from "next/headers";
import { client as sanity } from "@/lib/sanity";
import { sanityDimensions } from "@/lib/sanityImageLoader";
import LineArt from "@/components/LineArt";
import {
  homeBody,
  homeCard,
  homeContainer,
  homeEyebrow,
  homeH2,
  homeSection,
  homeTextLink,
} from "@/components/home/homeStyles";

// Served size of a cover requested at w=600 (Sanity never upscales)
function coverSize(url: string) {
  const d = sanityDimensions(url);
  if (!d) return { width: 600, height: 450 };
  const width = Math.min(600, d.width);
  return { width, height: Math.round((width * d.height) / d.width) };
}

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

  // Batch 20: calm restyle (display only). Same posts, images, links and
  // words; headings are now h2 / h3 (were h3 / h4) and each card also shows
  // the post's summary from Sanity (two lines).
  return (
    <section className={`bg-white ${homeSection}`}>
      <div className={homeContainer}>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4 lg:gap-10">
          {/* Left: heading */}
          <div className="relative lg:col-span-1 lg:pt-2">
            <LineArt
              name="elephant-acacia"
              className="mb-4 w-[110px] text-[#a35c2d] opacity-40"
            />
            <span className={`block ${homeEyebrow}`}>Journal</span>
            <h2 className={`mt-2 ${homeH2}`}>
              Safari
              <br className="hidden lg:block" /> Insights
            </h2>
            <p className={`mt-3 max-w-[18rem] ${homeBody}`}>
              Stories, travel tips, and on-the-ground perspectives from Africa.
            </p>
            <Link href="/blog/" className={`mt-5 ${homeTextLink}`}>
              Visit the Journal <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Right: blog cards */}
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-3">
            {posts.map((post) => (
              <li key={post._id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className={`group flex h-full flex-row overflow-hidden sm:flex-col ${homeCard} transition-transform duration-300 hover:-translate-y-0.5`}
                >
                  {post.coverImage?.asset?.url && (
                    // Below the fold: lazy-load and ask Sanity's CDN for a
                    // 600px version of the original.
                    <img
                      src={
                        post.coverImage.asset.url.includes("cdn.sanity.io") &&
                        !post.coverImage.asset.url.includes("?")
                          ? `${post.coverImage.asset.url}?w=600&q=70&auto=format&fit=max`
                          : post.coverImage.asset.url
                      }
                      alt={post.coverImage.alt || post.title}
                      width={coverSize(post.coverImage.asset.url).width}
                      height={coverSize(post.coverImage.asset.url).height}
                      className="aspect-square w-[118px] shrink-0 object-cover sm:aspect-[4/3] sm:w-full"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                    <h3 className="text-[17px] font-semibold leading-snug text-[#24170f] group-hover:text-[#a35c2d]">
                      {post.title}
                    </h3>
                    {post.summary && (
                      <p className="mt-2 line-clamp-2 text-[15px] leading-6 text-[#5c4a3d]">
                        {post.summary}
                      </p>
                    )}
                    <span className="mt-auto hidden pt-4 text-[14px] font-semibold text-[#a35c2d] sm:block">
                      Read article <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
