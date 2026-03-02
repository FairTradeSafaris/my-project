const { client } = require("./sanity-client.cjs");

module.exports = async function getBlogUrls() {
  // Fetch blog post slugs
  const posts = await client.fetch(
    `*[_type == "blog" && defined(slug.current)]{
      "slug": slug.current
    }`,
  );

  // Fetch tag slugs (make sure _type matches your Sanity schema: usually "tag")
  const tags = await client.fetch(
    `*[_type == "tag" && defined(slug.current)]{
      "slug": slug.current
    }`,
  );

  // Blog post URLs
  const blogPostPaths = posts.map((post) => ({
    loc: `/blog/${post.slug}`,
    changefreq: "weekly",
    priority: 0.7,
  }));

  // Tag page URLs (MATCHES your actual route: /blog/tags/[slug])
  const tagPaths = tags.map((tag) => ({
    loc: `/blog/tags/${tag.slug}`,
    changefreq: "weekly",
    priority: 0.5,
  }));

  return [...blogPostPaths, ...tagPaths];
};
