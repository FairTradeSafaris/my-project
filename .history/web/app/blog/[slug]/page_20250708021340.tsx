import { notFound } from "next/navigation";
import groq from "groq";
import { client } from "@/lib/sanity";
import CommentFormWrapper from "@/components/CommentFormWrapper";
import { LikeButton } from "@/components/LikeButton";
import BlogContent from "@/components/BlogContent";
import type { Block } from "../../../types/block"; // adjust path as needed
import ShareButtons from "@/components/ShareButtons";

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
    image?: {
      asset?: {
        url?: string;
      };
    };
  };
  tags?: string[];
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
    likes,
    author-> {
      name,
      image
    },
    tags
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
    <main className="bg-[#fdf8f3] text-black min-h-screen px-0">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-[400px] object-cover"
        />
      )}

      <<div className="max-w-3xl mx-auto px-6 mb-4">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    {/* Author Info */}
    <div className="flex items-center gap-4">
      {post.author?.image && (
        <img
          src={post.author.image}
          alt={post.author.name || "Author"}
          className="w-12 h-12 rounded-full object-cover border border-gray-300"
        />
      )}
      <div>
        <p className="text-sm text-gray-600">
          By{" "}
          <span className="font-semibold text-black">
            {post.author?.name || "Unknown Author"}
          </span>
        </p>
        <p className="text-sm text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>

    {/* Tags */}
    {post.tags && post.tags.length > 0 && (
      <div className="sm:mt-0">
        <ul className="flex flex-wrap gap-2 text-xs text-white">
          {post.tags.map((tag: string) => (
            <li
              key={tag}
              className="bg-amber-600 px-2 py-1 rounded-full whitespace-nowrap"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>


      <BlogContent blocks={post.content} />
      <div className="max-w-3xl mx-auto px-6 mt-6 flex flex-wrap items-center gap-4">
        <LikeButton postId={post._id} initialLikes={post.likes || 0} />
        <ShareButtons title={post.title} />
      </div>

      <hr className="my-12 border-gray-300" />

      <div className="max-w-3xl mx-auto px-6">
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
