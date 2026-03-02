const { client } = require("./sanity-client.cjs");

module.exports = async function getVideoTestimonialUrls() {
  const testimonials = await client.fetch(
    `*[_type == "videoTestimonial" && defined(slug.current)]{
      "slug": slug.current
    }`,
  );

  return testimonials.map((t) => ({
    loc: `/videoTestimonial/${t.slug}`,
    changefreq: "monthly",
    priority: 0.6,
  }));
};
