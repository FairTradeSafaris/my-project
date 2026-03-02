const { client } = require("./sanity-client.cjs");

module.exports = async function getSitePagesUrls() {
  const pages = await client.fetch(`
    *[_type == "sitePages" && !defined(noIndex) || noIndex == false]{
      "slug": slug.current
    }
  `);

  return pages
    .filter((p) => p.slug)
    .map((p) => ({
      loc: p.slug === "home" ? "/" : `/${p.slug}`,
      changefreq: "monthly",
      priority: p.slug === "home" ? 1.0 : 0.8,
    }));
};
