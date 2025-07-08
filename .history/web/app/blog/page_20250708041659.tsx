import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/sanity";
import groq from "groq";

type BlogPostPreview = {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  publishedAt: string;
  coverImage?: string;
  alt?: string;
};

export default async function BlogIndexPage() {
  const posts: BlogPostPreview[] = await client.fetch(
    groq`*[_type == "blog"] | order(publishedAt desc) {
      _id,
      title,
      summary,
      publishedAt,
      "slug": slug,
      "coverImage": coverImage.asset->url,
      "alt": coverImage.alt
    }`
  );

  return (
    <main className="bg-[#fdf8f3] text-black min-h-screen py-12">
      <section className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Our Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              {post.coverImage && (
                <Image
                  src={post.coverImage}
                  alt={post.alt || post.title}
                  width={600}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 text-sm">{post.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
