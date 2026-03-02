const { client } = require("./sanity-client.cjs");

module.exports = async function getAuthorUrls() {
  const authors = await client.fetch(
    `*[_type == "author" && defined(slug.current)]{ "slug": slug.current }`
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
      loc: `/authors/${author.slug}`,
      changefreq: "monthly",
      priority: 0.5,
    }));
};
