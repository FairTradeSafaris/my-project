const { client } = require("./sanity-client.cjs");

module.exports = async function getAmbassadorUrls() {
  const ambassadors = await client.fetch(
    `*[_type == "ambassadors" && defined(slug.current)]{ "slug": slug.current }`,
  );

  return ambassadors
    .filter(
      (a) =>
        a.slug &&
        typeof a.slug === "string" &&
        !a.slug.includes(".png") &&
        !a.slug.includes("/"),
    )
    .map((a) => ({
      loc: `/ambassador/${a.slug}`,
      changefreq: "monthly",
      priority: 0.6,
    }));
};
