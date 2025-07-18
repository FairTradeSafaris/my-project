import { client } from "@/lib/sanity";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    q = "",
    tag = "",
    author = "",
    page = "1",
    pageSize = "9",
  } = req.query;

  const filters = [`_type == "blog"`];
  if (q) filters.push(`title match "*${q}*" || summary match "*${q}*"`);
  if (tag) filters.push(`"${tag}" in tags`);
  if (author) filters.push(`author->name match "*${author}*"`);

  const start = (parseInt(page as string) - 1) * parseInt(pageSize as string);
  const end = start + parseInt(pageSize as string);

  const query = `*[
    ${filters.join(" && ")} && (!defined(isFeatured) || isFeatured == false)
  ] | order(publishedAt desc) [${start}...${end}] {
    _id, title, summary, publishedAt, "slug": slug,
    "coverImage": coverImage.asset->url, "alt": coverImage.alt,
    "author": author->{name}, tags, likes
  }`;

  try {
    const results = await client.fetch(query);
    res.status(200).json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
}
