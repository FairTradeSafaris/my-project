import { client } from "@/lib/sanity";
import { notFound } from "next/navigation";
import Image from "next/image";
import BlogContent from "@/components/BlogContent"; // custom modular block renderer

type BlogPostPageProps = {
  params: { slug: string };
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await client.fetch(
    `*[_type == "blog" && slug.current == $slug][0]{
      title,
      summary,
      publishedAt,
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
        <header className="space-y-4">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <p className="text-gray-600 text-sm">
            {new Date(post.publishedAt).toLocaleDateString()}
          </p>
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt={post.alt || post.title}
              width={1200}
              height={600}
              className="w-full rounded-md object-cover"
            />
          )}
          {post.summary && <p className="text-lg">{post.summary}</p>}
        </header>

        {/* Render modular content */}
        <BlogContent blocks={post.content} />
      </article>
    </main>
  );
}
