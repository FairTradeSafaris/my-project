import { client } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import BlogContent from "@/components/BlogContent"; // You'll build this
import Image from "next/image";

type BlogPageProps = {
  params: { slug: string };
};

export default async function BlogPostPage({ params }: BlogPageProps) {
  const post = await client.fetch(
    `*[_type == "blog" && slug.current == $slug][0]{
      title,
      publishedAt,
      summary,
      author,
      "coverImage": coverImage.asset->url,
      "alt": coverImage.alt,
      content[]{..., image{..., asset->}, images[]{..., asset->}}
    }`,
    { slug: params.slug }
  );

  if (!post) return notFound();

  return (
    <main className="bg-[#fdf8f3] text-black min-h-screen">
      <article className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <p className="text-gray-600 text-sm">
            Published on {new Date(post.publishedAt).toLocaleDateString()}
          </p>
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt={post.alt || post.title}
              width={1200}
              height={600}
              className="rounded-lg w-full object-cover"
            />
          )}
          {post.summary && <p className="text-lg">{post.summary}</p>}
        </header>

        {/* Modular Content Rendering */}
        <BlogContent blocks={post.content} />
      </article>
    </main>
  );
}
