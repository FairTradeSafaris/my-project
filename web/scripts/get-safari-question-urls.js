// Batch 17: Safari Questions (/safari-questions/<slug>/) for the sitemap.
// The index page is only listed when at least one question exists.
const { client } = require("./sanity-client.cjs");

module.exports = async function getSafariQuestionUrls() {
  const questions = await client.fetch(
    `*[_type == "safariQuestion" && defined(slug.current) && defined(question) && !(_id in path("drafts.**"))]{
      "slug": slug.current,
      "lastmod": coalesce(lastReviewed, _updatedAt)
    }`,
  );
  if (!questions || questions.length === 0) return [];
  return [
    { loc: "/safari-questions/", changefreq: "weekly", priority: 0.7 },
    ...questions.map((q) => ({
      loc: `/safari-questions/${q.slug}/`,
      lastmod: q.lastmod,
      changefreq: "monthly",
      priority: 0.7,
    })),
  ];
};
