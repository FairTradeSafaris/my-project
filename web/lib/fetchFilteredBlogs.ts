import { client } from "@/lib/sanity";

export async function fetchFilteredBlogs({
  query = "",
  tag = "",
  author = "",
  page = 1,
  pageSize = 9,
}: {
  query?: string;
  tag?: string;
  author?: string;
  page?: number;
  pageSize?: number;
}) {
  const filters = [`_type == "blog"`];
  if (query)
    filters.push(`title match "*${query}*" || summary match "*${query}*"`);
  if (tag) filters.push(`"${tag}" in tags`);
  if (author) filters.push(`author->name match "*${author}*"`);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const queryStr = `*[
    ${filters.join(" && ")} && (!defined(isFeatured) || isFeatured == false)
  ] | order(publishedAt desc) [${start}...${end}] {
    _id, title, summary, publishedAt, "slug": slug,
    "coverImage": coverImage.asset->url, "alt": coverImage.alt,
    "author": author->{name}, tags, likes
  }`;

  return await client.fetch(queryStr);
}
