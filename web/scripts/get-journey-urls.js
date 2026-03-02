const { client } = require("./sanity-client.cjs");

module.exports = async function getJourneyUrls() {
  const journeys = await client.fetch(
    `*[_type == "journey" && defined(slug.current)]{
      "slug": slug.current
    }`
  );

  return journeys
    .filter(
      (j) =>
        j.slug &&
        typeof j.slug === "string" &&
        !j.slug.includes(".png") &&
        !j.slug.includes("/")
    )
    .map((journey) => ({
      loc: `https://www.fairtradesafaris.com/africansafariitineraries/${journey.slug}`,
      changefreq: "monthly",
      priority: 0.6,
    }));
};
