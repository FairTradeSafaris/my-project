"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BlogSearchBar from "@/components/BlogSearchBar";
import type { BlogPostPreview } from "@/types/blog";

/* ---------------------------------------------
   Local Tag Type (fixes slug / _id / title errors)
--------------------------------------------- */
type Tag =
  | string
  | {
      _id?: string;
      title: string;
      slug?: {
        current: string;
      };
    };

type Props = {
  posts: BlogPostPreview[];
  enableSearch?: boolean;
  heading?: string;
};

const POSTS_PER_PAGE = 6;

export default function BlogGrid({
  posts,
  enableSearch = true,
  heading,
}: Props) {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()),
  );

  const featuredPost = filteredPosts[0];

  const otherPosts = enableSearch
    ? filteredPosts.slice(1, visibleCount + 1)
    : filteredPosts.slice(1);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Heading */}
      {heading && (
        <h2 className="text-3xl font-extrabold mb-6 text-center">{heading}</h2>
      )}

      {/* Search */}
      {enableSearch && (
        <div className="mb-10">
          <BlogSearchBar value={search} onSearch={setSearch} />
        </div>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-12">
          <p className="text-sm font-semibold text-orange-600 uppercase mb-2">
            ⭐ Featured Post
          </p>

          <Link
            href={`/blog/${featuredPost.slug}`}
            className="flex flex-col lg:flex-row bg-white rounded-lg shadow overflow-hidden group hover:shadow-lg transition"
          >
            <div className="relative w-full lg:w-1/2 aspect-square">
              <Image
                src={featuredPost.coverImage || "/fallback.jpg"}
                alt={featuredPost.alt || featuredPost.title}
                fill
                className="object-cover rounded-t-lg lg:rounded-t-none lg:rounded-l-lg"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="lg:w-2/3 w-full p-6 flex flex-col space-y-2">
              <p className="text-xs text-orange-600 font-bold">
                {new Date(featuredPost.publishedAt).toLocaleDateString("en-US")}{" "}
                • {featuredPost.author?.name || "Fair Trade Team"}
              </p>

              {/* Tags */}
              {featuredPost.tags && featuredPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-1">
                  {(featuredPost.tags as Tag[]).map((tag) => {
                    const isObject = typeof tag === "object" && tag !== null;

                    const label = isObject
                      ? tag.title || tag.slug?.current || "tag"
                      : tag;

                    const key = isObject
                      ? tag._id || tag.slug?.current || label
                      : tag;

                    return (
                      <span
                        key={key}
                        className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full"
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-800">
                {featuredPost.title}
              </h2>

              <p className="text-lg text-gray-700 leading-relaxed line-clamp-20">
                {featuredPost.extendedDescription || featuredPost.summary}
              </p>

              {featuredPost.readTime && (
                <div className="text-sm text-gray-500">
                  {featuredPost.readTime} min read
                </div>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {otherPosts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug}`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
          >
            {post.coverImage && (
              <div className="relative w-full aspect-square">
                <Image
                  src={post.coverImage}
                  alt={post.alt || post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}

            <div className="p-4 flex flex-col flex-grow">
              <p className="text-xs text-orange-600 font-bold mb-1">
                {new Date(post.publishedAt).toLocaleDateString("en-US")} •{" "}
                {post.author?.name || "Fair Trade Team"}
              </p>

              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {post.title}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-3">
                {post.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More */}
      {enableSearch && visibleCount < filteredPosts.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-white border rounded hover:bg-orange-100 transition text-sm font-medium"
          >
            Load More Articles
          </button>
        </div>
      )}
    </div>
  );
}
