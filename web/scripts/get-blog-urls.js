const { client } = require("./sanity-client.cjs");

module.exports = async function getBlogUrls() {
  // Fetch blog post slugs
  const posts = await client.fetch(
    `*[_type == "blog" && defined(slug.current)]{
      "slug": slug.current
    }`,
  );
  // Blog post URLs
  const blogPostPaths = posts.map((post) => ({
    loc: `/blog/${post.slug}`,
    changefreq: "weekly",
    priority: 0.7,
  }));

  return [...blogPostPaths];
};
