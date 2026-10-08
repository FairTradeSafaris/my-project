const { client } = require("./sanity-client.cjs");

module.exports = async function getSitePagesUrls() {
  const pages = await client.fetch(`
    *[_type == "sitePages" && (!defined(noIndex) || noIndex == false) && !(_id in path("drafts.**"))]{
      "slug": slug.current,
      "lastmod": _updatedAt
    }
  `);

  return pages
    .filter((p) => p.slug)
    .map((p) => ({
      loc: p.slug === "home" ? "/" : `/${p.slug}/`,
      lastmod: p.lastmod,
      changefreq: "monthly",
      priority: p.slug === "home" ? 1.0 : 0.8,
    }));
};
