const { client } = require("./sanity-client.cjs");

module.exports = async function getVideoTestimonialUrls() {
  const testimonials = await client.fetch(
    `*[_type == "videoTestimonial" && defined(slug.current) && !(_id in path("drafts.**"))]{
      "slug": slug.current,
      "lastmod": _updatedAt
    }`,
  );

  // Batch 8: greg-and-megan-shindler1 is a duplicate doc and 301s away
  return testimonials.filter((t) => t.slug !== "greg-and-megan-shindler1").map((t) => ({
    loc: `/videoTestimonial/${t.slug}/`,
    lastmod: t.lastmod,
    changefreq: "monthly",
    priority: 0.6,
  }));
};
