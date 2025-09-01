"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type BlogPost = {
  _id: string;
  title: string;
  summary: string;
  publishedAt: string;
  slug: { current: string };
  coverImage?: string;
  alt?: string;
};

type Author = {
  name: string;
};

export default function AuthorBlogList({
  blogs,
  author,
}: {
  blogs: BlogPost[];
  author: Author;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const totalPages = Math.ceil(blogs.length / postsPerPage);
  const currentBlogs = blogs.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <section className="bg-white py-20 px-4">
      <h3 className="text-3xl font-bold mb-10 text-center">
        Stories by {author.name}
      </h3>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {currentBlogs.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug.current}`}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            {post.coverImage && (
              <div className="relative w-full">
                <Image
                  src={post.coverImage}
                  alt={post.alt || post.title}
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-1">
                {new Date(post.publishedAt).toLocaleDateString()}
              </p>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {post.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-3">
                {post.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-12 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
