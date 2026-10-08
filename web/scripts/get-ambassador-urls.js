const { client } = require("./sanity-client.cjs");

module.exports = async function getAmbassadorUrls() {
  const ambassadors = await client.fetch(
    `*[_type == "ambassador" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current, "lastmod": _updatedAt }`,
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
      // route is /ambassadors/[slug]/ (plural) — /ambassador/... does not exist
      loc: `/ambassadors/${a.slug}/`,
      lastmod: a.lastmod,
      changefreq: "monthly",
      priority: 0.6,
    }));
};
