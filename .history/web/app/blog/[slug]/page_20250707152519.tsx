import { notFound } from "next/navigation";
import groq from "groq";
import { client } from "@/lib/sanity";
import CommentFormWrapper from "@/components/CommentFormWrapper";
import { LikeButton } from "@/components/LikeButton";
import BlogContent from "@/components/BlogContent";
import type { Block } from "../../../types/"; // adjust path as needed

type BlogPost = {
  _id: string;
  title: string;
  summary: string;
  publishedAt: string;
  coverImage?: string;
  content: Block[];
  likes?: number;
};

type Comment = {
  _id: string;
  name: string;
  comment: string;
  _createdAt: string;
};

// Generate static paths for blog posts
export async function generateStaticParams() {
  const slugs = await client.fetch(
    groq`*[_type == "blog" && defined(slug.current)]{ "slug": slug.current }`
  );
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}

// Fetch individual blog post
async function getPost(slug: string): Promise<BlogPost | null> {
  const query = groq`*[_type == "blog" && slug.current == $slug][0] {
    _id,
    title,
    publishedAt,
    "coverImage": coverImage.asset->url,
    summary,
    content[] {
      ...,
      image { ..., asset-> },
      images[] { ..., asset-> }
    },
    likes
  }`;
  return await client.fetch(query, { slug });
}

// Fetch approved comments
async function getApprovedComments(postId: string): Promise<Comment[]> {
  const query = groq`*[_type == "comment" && post._ref == $postId && approved == true] 
    | order(_createdAt desc) {
      _id,
      name,
      comment,
      _createdAt
    }`;
  return await client.fetch(query, { postId });
}

// Blog post page component
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) return notFound();

  const post = await getPost(slug);
  if (!post) return notFound();

  const comments = await getApprovedComments(post._id);

  return (
    <main className="bg-[#fdf8f3] text-black min-h-screen max-w-3xl mx-auto p-6">
      <span className="text-xs uppercase tracking-widest text-amber-700 mb-2 inline-block">
        Impact Story
      </span>

      <h1 className="text-4xl font-serif font-bold mb-3 leading-snug">
        {post.title}
      </h1>

      <p className="text-sm text-gray-600 mb-6">
        {new Date(post.publishedAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-auto rounded-2xl shadow-md mb-6 object-cover"
        />
      )}

      <p className="mb-6 text-lg font-light text-gray-800 leading-relaxed">
        {post.summary}
      </p>

      <LikeButton postId={post._id} initialLikes={post.likes || 0} />

      {/* Modular content rendering */}
      <BlogContent blocks={post.content} />

      <hr className="my-12 border-gray-300" />

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
    </main>
  );
}
