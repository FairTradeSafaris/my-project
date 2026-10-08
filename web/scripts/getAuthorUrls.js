const { client } = require("./sanity-client.cjs");

module.exports = async function getAuthorUrls() {
  const authors = await client.fetch(
    `*[_type == "author" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current, "lastmod": _updatedAt }`
  );

  return authors
    .filter(
      (author) =>
        author.slug &&
        typeof author.slug === "string" &&
        !author.slug.includes(".png") &&
        !author.slug.includes("/")
    )
    .map((author) => ({
      loc: `/authors/${author.slug}/`,
      lastmod: author.lastmod,
      changefreq: "monthly",
      priority: 0.5,
    }));
};
