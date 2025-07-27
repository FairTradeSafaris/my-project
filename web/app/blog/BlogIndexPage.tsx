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

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tagFromURL = searchParams.get("tag") || "";
    setSelectedTag(tagFromURL);
  }, [searchParams]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
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
      <section
        className="relative h-[400px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/sunset-safari.webp')` }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-xl">
            Discover stories from the wild.
          </h1>
        </div>
      </section>

      <section className="flex px-6 py-12 max-w-7xl mx-auto gap-12">
        <div className="flex-1">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
              onChange={(e) => {
                const newTag = e.target.value;
                setSelectedTag(newTag);
                const params = new URLSearchParams(searchParams.toString());
                if (newTag) {
                  params.set("tag", newTag);
                } else {
                  params.delete("tag");
                }

                router.push(`?${params.toString()}`);
              }}
            >
              <option value="">All tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <Link
              href={`/blog/${featuredPost.slug.current}`}
              className="relative w-full block bg-white rounded-md shadow-md overflow-hidden mb-16"
            >
              <div className="flex flex-col lg:flex-row">
                {featuredPost.coverImage && (
                  <div className="lg:w-1/2 w-full h-80 lg:h-auto">
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.alt || featuredPost.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-between p-6 lg:w-1/2">
                  <div>
                    <p className="text-sm text-orange-600 font-bold mb-1">
                      {new Date(featuredPost.publishedAt).toLocaleDateString()}{" "}
                      • {featuredPost.author?.name || "Fair Trade Team"}
                    </p>
                    <h2 className="text-3xl font-bold mt-2 mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-700 mb-4 line-clamp-15">
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
              </div>
            </Link>
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
                    width={400}
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
      </section>
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
            <h4 className="text-lg font-semibold mb-3">🌟 Featured Journeys</h4>
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
            <h4 className="text-lg font-semibold mb-3">🔥 Most Liked Blogs</h4>
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
    </main>
  );
}
