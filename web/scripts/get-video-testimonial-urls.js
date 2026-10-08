const { client } = require("./sanity-client.cjs");

module.exports = async function getVideoTestimonialUrls() {
  const testimonials = await client.fetch(
    `*[_type == "videoTestimonial" && defined(slug.current) && !(_id in path("drafts.**"))]{
      "slug": slug.current,
      "lastmod": _updatedAt
    }`,
  );

  return testimonials.map((t) => ({
    loc: `/videoTestimonial/${t.slug}/`,
    lastmod: t.lastmod,
    changefreq: "monthly",
    priority: 0.6,
  }));
};
