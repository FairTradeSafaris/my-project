import { groq } from "next-sanity";
import { sanityClient as client } from "@/lib/client";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const data = await client.fetch(
    groq`*[_type == "journey" && slug.current == $slug][0]{ title, summary }`,
    { slug }
  );

  if (!data) return {};

  return {
    title: `${data.title} | Fair Trade Safaris`,
    description: data.summary,
    alternates: {
      canonical: `/africansafariitineraries/${slug}`,
    },
  };
}
