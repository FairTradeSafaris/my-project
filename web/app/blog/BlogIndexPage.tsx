"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/lib/sanity";
import groq from "groq";
import { useSearchParams, useRouter } from "next/navigation";

// Types
type BlogPostPreview = {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  publishedAt: string;
  coverImage?: string;
  alt?: string;
  author?: { name: string };
  tags?: string[];
  featured?: boolean;
  likes?: number;
};

type Journey = {
  _id: string;
  title: string;
  slug: { current: string };
  summary?: string;
  price?: string;
  duration?: string;
  region?: { title: string };
  heroImage?: {
    asset: { url: string };
    alt?: string;
  };
};

export default function BlogIndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPostPreview | null>(
    null
  );
  const [featuredJourneys, setFeaturedJourneys] = useState<Journey[]>([]);
  const [mostLikedBlogs, setMostLikedBlogs] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBlogSearch, setShowBlogSearch] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tagFromURL = searchParams.get("tag") || "";
    setSelectedTag(tagFromURL);
    const qFromURL = searchParams.get("q") || "";
    setSearchQuery(qFromURL);
  }, [searchParams]);

  const filteredPosts = posts.filter((post) => {
    const title = (post.title || "").toLowerCase();
    const summary = (post.summary || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = title.includes(q) || summary.includes(q);
    const matchesTag =
      selectedTag === "" || (post.tags || []).includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsData, featuredData, journeysData, likedData] =
          await Promise.all([
            client.fetch(groq`*[_type == "blog" && (!defined(isFeatured) || isFeatured == false)] | order(publishedAt desc){
              _id, title, summary, publishedAt, "slug": slug,
              "coverImage": coverImage.asset->url, "alt": coverImage.alt,
              "author": author->{name}, tags, likes
            }`),
            client.fetch(groq`*[_type == "blog" && isFeatured == true][0]{
              _id, title, summary, publishedAt, "slug": slug,
              "coverImage": coverImage.asset->url, "alt": coverImage.alt,
              "author": author->{name}, tags, likes
            }`),
            client.fetch(groq`*[_type == "journey" && featuredOnHome == true][0...3]{
              _id, title, "slug": slug, summary, price, duration,
              region->{title}, heroImage { asset->{url}, alt }
            }`),
            client.fetch(groq`*[_type == "blog"] | order(likes desc, publishedAt desc)[0...3]{
              _id, title, "slug": slug, "coverImage": coverImage.asset->url,
              "alt": coverImage.alt, likes
            }`),
          ]);

        setPosts(postsData);
        setAllTags([
          ...new Set(
            (postsData as BlogPostPreview[]).flatMap((p) =>
              Array.isArray(p.tags) ? p.tags : []
            )
          ),
        ]);

        setFeaturedPost(featuredData);
        setFeaturedJourneys(journeysData);
        setMostLikedBlogs(likedData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load blog content.");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <main className="min-h-screen bg-[#fdf8f3] text-black">
      {/* Mobile Search Modal */}
      {showBlogSearch && (
        <div className="fixed inset-0 bg-white z-50 p-6 overflow-y-auto">
          <button
            onClick={() => setShowBlogSearch(false)}
            className="text-black text-xl mb-6"
          >
            ✕ Close
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const params = new URLSearchParams(searchParams.toString());

              if (searchQuery) params.set("q", searchQuery);
              else params.delete("q");

              if (selectedTag) params.set("tag", selectedTag);
              else params.delete("tag");

              router.push(`?${params.toString()}`);
              setShowBlogSearch(false);
            }}
          >
            <input
              type="text"
              placeholder="Search blog posts..."
              className="w-full border border-gray-300 px-4 py-2 mb-4 rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="w-full border border-gray-300 px-4 py-2 mb-4 rounded"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">All tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Header Section */}

      {/* Sticky Mobile Search Button */}
      <div className="fixed bottom-4 inset-x-0 flex justify-center z-40 lg:hidden">
        <button
          onClick={() => setShowBlogSearch(true)}
          className="bg-[#ead8c0] text-black shadow-md rounded-full px-6 py-3 flex items-center gap-2"
        >
          <span className="text-xl">🔍</span>
          <span className="font-medium">Search Blogs</span>
        </button>
      </div>

      <section className="flex flex-col lg:flex-row px-8 py-12 w-full max-w-[1600px] mx-auto gap-16">
        <div className="flex-[2] min-w-0">
          {/* Filters */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const params = new URLSearchParams(searchParams.toString());

              if (searchQuery) params.set("q", searchQuery);
              else params.delete("q");

              if (selectedTag) params.set("tag", selectedTag);
              else params.delete("tag");

              router.push(`?${params.toString()}`);
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <input
              type="text"
              placeholder="Search blog posts..."
              className="border border-gray-300 px-4 py-2 rounded w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="border border-gray-300 px-4 py-2 rounded w-full"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">All tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            {/* Button only shows on mobile */}
            <button
              type="submit"
              className="block md:hidden bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition"
            >
              Search
            </button>
          </form>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-4">🌟 Featured Post</h2>
              <Link
                href={`/blog/${featuredPost.slug.current}`}
                className="flex flex-col md:flex-row w-full bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg"
              >
                {/* Image Side */}
                {featuredPost.coverImage && (
                  <div className="relative w-full lg:w-[40%] h-auto">
                    <Image
                      src={featuredPost.coverImage!}
                      alt={featuredPost.alt || featuredPost.title}
                      width={400}
                      height={300}
                      className="w-full h-auto object-cover rounded-l-md"
                    />
                  </div>
                )}

                {/* Content Side */}
                <div className="p-6 md:w-[60%] flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-semibold mb-1">
                      {new Date(featuredPost.publishedAt).toLocaleDateString()}{" "}
                      • {featuredPost.author?.name || "Fair Trade Team"}
                    </p>
                    <h3 className="text-2xl font-bold mb-3">
                      {featuredPost.title}
                    </h3>
                    <p className="text-gray-700 text-s mb-4 line-clamp-20">
                      {featuredPost.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {featuredPost.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-sm text-gray-800 px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* All Posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="bg-white rounded-md shadow-md overflow-hidden"
              >
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.alt || post.title}
                    width={256}
                    height={256}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-4">
                  <p className="text-xs text-orange-600 font-bold mb-1">
                    {new Date(post.publishedAt).toLocaleDateString()} •{" "}
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
        </div>

        <aside className="w-80 hidden lg:block">
          <div className="sticky top-24 space-y-8">
            {/* Newsletter Signup */}
            <div className="bg-white shadow p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">📬 Subscribe</h4>
              <p className="text-sm text-gray-600 mb-3">
                Get the latest safari stories and tips in your inbox.
              </p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full mb-2 px-3 py-2 border rounded"
              />
              <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
                Sign Up
              </button>
            </div>

            {/* Featured Journeys */}
            <div className="bg-[#f5f3ef] p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-3">
                🌟 Featured Journeys
              </h4>
              {featuredJourneys.length > 0 ? (
                <ul className="space-y-4">
                  {featuredJourneys.map((j) => (
                    <li
                      key={j._id}
                      className="bg-white p-2 rounded shadow flex gap-3 items-center"
                    >
                      {j.heroImage?.asset?.url && (
                        <Image
                          src={j.heroImage.asset.url}
                          alt={j.heroImage.alt || j.title}
                          width={60}
                          height={60}
                          className="rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex flex-col">
                        <Link href={`/journey?q=${j.title}&open=true`}>
                          <h5 className="text-sm font-bold text-gray-800 hover:underline">
                            {j.title}
                          </h5>
                        </Link>
                        {j.region?.title && (
                          <p className="text-xs text-orange-600">
                            {j.region.title}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No journeys available.</p>
              )}
            </div>

            {/* Most Liked Blogs */}
            <div className="bg-[#f5f3ef] p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-3">
                🔥 Most Liked Blogs
              </h4>
              {mostLikedBlogs.length > 0 ? (
                <ul className="space-y-4">
                  {mostLikedBlogs.map((post) => (
                    <li
                      key={post._id}
                      className="bg-white p-2 rounded shadow flex gap-3 items-center"
                    >
                      {post.coverImage && (
                        <Image
                          src={post.coverImage}
                          alt={post.alt || post.title}
                          width={60}
                          height={60}
                          className="rounded object-cover flex-shrink-0"
                        />
                      )}
                      <Link href={`/blog/${post.slug.current}`}>
                        <h5 className="text-sm font-bold text-gray-800 hover:underline">
                          {post.title}
                        </h5>
                        <p className="text-xs text-gray-500 mt-1">
                          {post.likes ?? 0} likes
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No popular blogs yet. Be the first to like one!
                </p>
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
