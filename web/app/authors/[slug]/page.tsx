// app/authors/[slug]/page.tsx

import { groq } from "next-sanity";
import { client, urlFor } from "@/lib/sanity";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import AuthorBlogList from "@/components/AuthorBlogList";
import { type ReactElement } from "react";

// ----------------------
// Types
// ----------------------

interface PageProps {
  params: { slug: string }; // keep as-is
}

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
  _id: string;
  name: string;
  bio?: string;
  image?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  favoriteWildlifeEncounter?: string;
  inspiringDestination?: string;
  whyTellStories?: string;
};

// ----------------------
// Metadata
// ----------------------

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const author = await getAuthor(params.slug);
  if (!author) return {};
  return {
    title: `${author.name} | Fair Trade Safaris`,
    description: author.bio?.slice(0, 155),
    openGraph: {
      title: `${author.name} | Fair Trade Safaris`,
      description: author.bio?.slice(0, 155),
      images: author.image ? [urlFor(author.image).url()] : [],
    },
  };
}

// ----------------------
// Data Fetching Helpers
// ----------------------

const getAuthor = async (slug: string): Promise<Author | null> => {
  const query = groq`*[_type == "author" && slug.current == $slug][0]{
    _id,
    name,
    bio,
    image,
    favoriteWildlifeEncounter,
    inspiringDestination,
    whyTellStories,
    "slug": slug.current
  }`;
  return await client.fetch(query, { slug });
};

const getBlogsByAuthor = async (authorId: string): Promise<BlogPost[]> => {
  const query = groq`*[_type == "blog" && author._ref == $authorId] | order(publishedAt desc){
    _id,
    title,
    summary,
    publishedAt,
    "slug": slug,
    "coverImage": coverImage.asset->url,
    "alt": coverImage.alt
  }`;
  return await client.fetch(query, { authorId });
};

// ----------------------
// Page Component
// ----------------------

const AuthorPage: (props: PageProps) => Promise<ReactElement> = async ({
  params,
}) => {
  const author = await getAuthor(params.slug);
  if (!author) return notFound();

  const blogs = await getBlogsByAuthor(author._id);

  return (
    <main className="bg-[#fdf8f3] text-black min-h-screen px-4 sm:px-6 pt-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Main Section */}
        <section className="lg:col-span-3 space-y-10">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Meet {author.name}
            </h1>
            <p className="text-lg leading-relaxed text-gray-700">
              {author.bio}
            </p>

            <div className="grid md:grid-cols-2 gap-8 text-base text-gray-800">
              {author.favoriteWildlifeEncounter && (
                <div>
                  <h3 className="text-sm font-semibold uppercase text-gray-500 mb-1">
                    Favorite Wildlife Encounter
                  </h3>
                  <p>{author.favoriteWildlifeEncounter}</p>
                </div>
              )}
              {author.inspiringDestination && (
                <div>
                  <h3 className="text-sm font-semibold uppercase text-gray-500 mb-1">
                    Most Inspiring Destination
                  </h3>
                  <p>{author.inspiringDestination}</p>
                </div>
              )}
              {author.whyTellStories && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold uppercase text-gray-500 mb-1">
                    Why I Tell Safari Stories
                  </h3>
                  <p>{author.whyTellStories}</p>
                </div>
              )}
            </div>
          </div>

          {blogs.length > 0 && (
            <div className="pt-12">
              <h2 className="text-2xl font-bold mb-6">
                Stories by {author.name}
              </h2>
              <AuthorBlogList blogs={blogs} author={author} />
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            {author.image && (
              <div className="flex justify-center mb-4">
                <Image
                  src={urlFor(author.image).width(300).height(300).url()}
                  alt={author.name}
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-amber-600 shadow"
                />
              </div>
            )}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {author.name}
            </h3>
            <p className="text-sm text-gray-600">
              {author.bio?.slice(0, 120)}...
            </p>
          </div>

          <div className="bg-[#fff9f1] p-4 rounded-lg shadow border border-amber-300 text-sm">
            <h4 className="font-bold text-amber-700 mb-2">
              Fair Trade Philosophy
            </h4>
            <p className="text-gray-700">
              Every safari story shared here reflects our mission — to travel
              with heart, honor the land, and uplift local communities.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default AuthorPage;
