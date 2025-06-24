"use client";

import { useEffect, useState } from "react";
import sanityClient from "../../../lib/sanity";

type BlogPost = {
  title: string;
  slug: { current: string };
  summary: string;
  publishedAt: string;
  isFeatured: boolean;
  coverImage: string;
  alt?: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "blog"] | order(publishedAt desc) {
          title,
          slug,
          summary,
          publishedAt,
          isFeatured,
          "coverImage": coverImage.asset->url,
          "alt": coverImage.alt
        }`
      )
      .then((data) => {
        setPosts(data);
      });
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const featuredPost =
    currentPage === 1 ? filteredPosts.find((post) => post.isFeatured) : null;

  const displayedPosts = filteredPosts
    .filter((post) => post !== featuredPost)
    .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  return (
    <main className="min-h-screen text-black bg-[#fdf8f3]">
      {/* Hero */}
      <section
        className="relative h-[400px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url('../sunset-safari.webp')` }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-xl">
            Discover Africa’s Stories 🐘
          </h1>
          <p className="text-lg mb-6 max-w-2xl">
            Explore stories, quirky facts, and travel inspiration from Africa’s
            most untamed corners.
          </p>
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl w-full max-w-2xl shadow-md">
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchTerm(e.target.value);
              }}
              className="w-full px-4 py-3 rounded border text-white placeholder-white bg-transparent"
            />
          </div>
        </div>
      </section>

      {/* Layout */}
      <section className="relative flex flex-col lg:flex-row max-w-7xl mx-auto px-6 py-12 gap-10">
        <div className="flex-1">
          {featuredPost && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={featuredPost.coverImage}
                alt={featuredPost.alt || featuredPost.title}
                className="w-full h-80 object-cover"
              />
              <div className="p-6 bg-white">
                <h2 className="text-2xl font-bold mb-2 line-clamp-1">
                  {featuredPost.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {featuredPost.summary}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayedPosts.map((post) => (
              <div
                key={post.slug?.current || post.title}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <img
                  src={post.coverImage}
                  alt={post.alt || post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1 line-clamp-1">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {post.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-xl">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center disabled:opacity-30"
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm ${
                    currentPage === i + 1
                      ? "bg-black text-white font-bold"
                      : "text-gray-700 border-gray-400"
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
                className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center disabled:opacity-30"
              >
                &gt;
              </button>
            </div>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>

        <aside className="lg:w-80 flex-shrink-0 space-y-6">
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="font-bold mb-2">About Fair Trade Safaris</h3>
            <p className="text-sm text-gray-700">
              Fair Trade Safaris is the conscious traveler’s gateway to Africa.
              We connect you to ethical journeys and wild places.
            </p>
          </div>

          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="font-bold mb-2">Subscribe to Our Newsletter</h3>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 border rounded mb-3"
            />
            <button className="w-full bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600">
              Subscribe
            </button>
          </div>

          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="font-bold mb-2">Most Popular Blog Posts</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              {posts.slice(0, 10).map((post) => (
                <li key={post.slug?.current || post.title}>
                  <a
                    href={`/blog/${post.slug?.current}`}
                    className="hover:underline"
                  >
                    {post.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
