const { client } = require("./sanity-client.cjs");

module.exports = async function getDestinationUrls() {
  const destinations = await client.fetch(
    `*[_type == "destination" && defined(slug.current)]{ "slug": slug.current }`
  );

  return destinations
    .filter(
      (d) =>
        d.slug &&
        typeof d.slug === "string" &&
        !d.slug.includes(".png") && // prevent assets like icon.png
        !d.slug.includes("/") // catch misformatted slugs
    )
    .map((d) => ({
      loc: `/destination/${d.slug}`,
      changefreq: "weekly",
      priority: 0.8,
    }));
};
