import { notFound } from "next/navigation";
import groq from "groq";
import { client } from "@/lib/sanity";
import CommentFormWrapper from "@/components/CommentFormWrapper";
import { LikeButton } from "@/components/LikeButton";
import BlogContent from "@/components/BlogContent";
import ShareButtons from "@/components/ShareButtons";
import type { Block } from "../../../types/block";

type BlogPost = {
  _id: string;
  title: string;
  summary: string;
  publishedAt: string;
  coverImage?: string;
  content: Block[];
  likes?: number;
  author?: {
    name: string;
    image?: string;
    bio?: string;
  };
  tags?: string[];
};

type Comment = {
  _id: string;
  name: string;
  comment: string;
  _createdAt: string;
};

export async function generateStaticParams() {
  const slugs = await client.fetch(
    groq`*[_type == "blog" && defined(slug.current)]{ "slug": slug.current }`
  );
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}

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
    likes,
    author-> {
      name,
      "image": image.asset->url,
      bio
    },
    tags
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
  return await client.fetch(query, { postId });
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string }; // ✅ CORRECT type (NOT a Promise)
}) {
  const { slug } = params;

  if (!slug) return notFound();

  const post = await getPost(slug);
  if (!post) return notFound();

  const comments = await getApprovedComments(post._id);

  return (
    <main className="bg-[#fdf8f3] text-black min-h-screen px-0">
      {post.coverImage && (
        <div
          className="relative w-full h-[400px] flex items-center"
          style={{
            backgroundImage: `url(${post.coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0" />
          <div className="relative z-10 px-6 md:px-12 max-w-screen-xl mx-auto w-full">
            <div className="max-w-2xl">
              <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">
                {post.title}
              </h1>
              {post.summary && (
                <p className="text-white text-lg">{post.summary}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12 mt-10">
        <div className="lg:col-span-3">
          <BlogContent blocks={post.content} />

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <LikeButton postId={post._id} initialLikes={post.likes || 0} />
            <ShareButtons title={post.title} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {post.author?.image && (
            <img
              src={post.author.image}
              alt={post.author.name}
              className="w-24 h-24 rounded-full object-cover border mx-auto"
            />
          )}
          <h2 className="text-center text-lg font-semibold mt-4">
            {post.author?.name || "Unknown Author"}
          </h2>
          {post.author?.bio && (
            <p className="text-sm text-gray-600 text-center mt-2">
              {post.author.bio}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2 text-gray-800">Tags</h3>
              <ul className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* Comments Section */}
      <div className="max-w-3xl mx-auto px-6 mt-16">
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
