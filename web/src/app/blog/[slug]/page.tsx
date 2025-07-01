import groq from "groq";
import { client } from "../../../../lib/sanity";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;

  const query = groq`*[_type == "blog" && slug.current == $slug][0] {
    title,
    publishedAt,
    "coverImage": coverImage.asset->url,
    summary,
    body
  }`;

  const post = await client.fetch(query, { slug });

  if (!post) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-600 mb-6">
        {new Date(post.publishedAt).toDateString()}
      </p>
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-auto rounded-lg mb-6"
        />
      )}
      <p className="mb-4 text-lg">{post.summary}</p>
      <div>{/* TODO: render body with PortableText */}</div>
    </main>
  );
}
