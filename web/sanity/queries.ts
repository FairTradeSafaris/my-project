import { client } from "@lib/sanity";

// Get all blog posts
// Get all blog posts
export async function getAllBlogPosts() {
  const query = `*[_type == "blog" && defined(slug.current)] 
    | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      summary,
      extendedDescription,
      isFeatured,
      "coverImage": coverImage.asset->url,
      "alt": coverImage.alt,
      "author": author->{ name },
      "category": category->{
        _id,
        title,
        "slug": slug.current
      },
      tags[]->{
        _id,
        title,
        "slug": slug.current
      }
    }`;

  return await client.fetch(query);
}
// ✅ Get posts by TAG SLUG (not ID)
export async function getPostsByTagSlug(tagSlug: string) {
  const query = `*[_type == "blog" && $tagSlug in tags[]->slug.current] 
    | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      summary,
      "coverImage": coverImage.asset->url,
      "alt": coverImage.alt,
      "author": author->{ name },
      tags[]->{
        _id,
        title,
        "slug": slug.current
      }
    }`;

  return await client.fetch(query, { tagSlug });
}

// Get all tags (with slug)
export async function getAllTags() {
  const query = `*[_type == "tag"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }`;

  return await client.fetch(query);
}

// ✅ Get tag by SLUG
export async function getTagBySlug(slug: string) {
  const query = `*[_type == "tag" && slug.current == $slug][0] {
    _id,
    title,
    description,
    "slug": slug.current,
    "heroImage": heroImage.asset->url,
    "alt": heroImage.alt
  }`;

  return await client.fetch(query, { slug });
}
