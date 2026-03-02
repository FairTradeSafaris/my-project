// /lib/getPaginatedPosts.ts
import { client } from "@/lib/sanity";
import groq from "groq";

const POSTS_PER_PAGE = 9;

export async function getPaginatedPosts(page: number) {
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  // Get total count
  const totalPosts = await client.fetch<number>(
    groq`count(*[_type == "blog" && (!defined(isFeatured) || isFeatured == false)])`
  );

  // Get posts for this page
  const posts = await client.fetch(
    groq`*[_type == "blog" && (!defined(isFeatured) || isFeatured == false)]
          | order(publishedAt desc)
          [${start}...${end}] {
            _id, title, summary, publishedAt, "slug": slug,
            "coverImage": coverImage.asset->url, "alt": coverImage.alt,
            "author": author->{name}, tags, likes
          }`
  );

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return {
    posts,
    totalPages,
  };
}
