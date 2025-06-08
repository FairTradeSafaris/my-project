// blog.tsx
"use client";

import { useState, useEffect } from "react";
import sanityClient from "../../../lib/sanity";

// 🧠 Types
interface Blog {
  title: string;
  slug: { current: string };
  summary?: string;
  content?: string;
  author?: string;
  publishedAt?: string;
  categories?: string[];
  coverImage?: {
    asset: { url: string };
    alt?: string;
  };
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "blog"]{
          title,
          slug,
          summary,
          content,
          author,
          publishedAt,
          categories,
          coverImage { asset->{ url }, alt }
        }`
      )
      .then((data: Blog[]) => {
        setBlogs(data);
      })
      .catch((err) => {
        console.error("❌ Blog fetch error:", err);
      });
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">Our Blog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((post) => (
          <div
            key={post.slug.current}
            className="border rounded-xl shadow-md overflow-hidden"
          >
            {post.coverImage?.asset.url && (
              <img
                src={post.coverImage.asset.url}
                alt={post.coverImage.alt || post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                By {post.author || "Unknown"} —{" "}
                {new Date(post.publishedAt || "").toDateString()}
              </p>
              <p className="text-gray-700 mb-4">{post.summary}</p>
              <a
                href={`/blog/${post.slug.current}`}
                className="text-blue-600 font-medium hover:underline"
              >
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
