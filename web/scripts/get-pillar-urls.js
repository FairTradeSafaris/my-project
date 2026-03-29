const { client } = require("./sanity-client.cjs");

module.exports = async function getPillarUrls() {
  const pages = await client.fetch(
    `*[_type == "pillarPage" && defined(slug.current)]{
      "slug": slug.current
    }`,
  );

  return pages.map((page) => ({
    loc: `/${page.slug}`,
    changefreq: "weekly",
    priority: 0.9,
  }));
};
