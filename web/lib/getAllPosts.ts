import { client } from "@/lib/sanity";
import groq from "groq";
import type { BlogPostPreview } from "@/types/blog";

export async function getAllPosts(): Promise<BlogPostPreview[]> {
  return await client.fetch(
    groq`*[_type == "blog" && (!defined(isFeatured) || isFeatured == false)]
      | order(publishedAt desc) {
        _id,
        title,
        summary,
        publishedAt,
        "slug": slug,
        "coverImage": coverImage.asset->url,
        "alt": coverImage.alt,
        "author": author->{name},

        // ✅ FIX TAGS: dereference them
    "tags": tags[]->{
  _id,
  title
}

        likes
      }`
  );
}
