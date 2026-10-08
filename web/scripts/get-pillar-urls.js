const { client } = require("./sanity-client.cjs");

module.exports = async function getPillarUrls() {
  const pages = await client.fetch(
    `*[_type == "pillarPage" && defined(slug.current) && noIndex != true && !(_id in path("drafts.**"))]{
      "slug": slug.current,
      "lastmod": _updatedAt
    }`,
  );

  return pages.map((page) => ({
    loc: `/${page.slug}/`,
    lastmod: page.lastmod,
    changefreq: "weekly",
    priority: 0.9,
  }));
};
