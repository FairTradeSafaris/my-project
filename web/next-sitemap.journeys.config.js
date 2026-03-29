/** @type {import('next-sitemap').IConfig} */

const getJourneyUrls = require("./scripts/get-journey-urls.js");

module.exports = {
  siteUrl: "https://www.fairtradesafaris.com",
  generateRobotsTxt: false,
  sitemapBaseFileName: "journeys-sitemap",
  changefreq: "weekly",
  priority: 0.9,
  sitemapSize: 5000,

  transform: async () => null,

  additionalPaths: async () => {
    const journeyPaths = await getJourneyUrls();
    const seen = new Set();

    return journeyPaths
      .map((item) => (typeof item === "string" ? { loc: item } : item))
      .filter((item) => item && item.loc)
      .filter((item) => {
        if (seen.has(item.loc)) return false;
        seen.add(item.loc);
        return true;
      })
      .map((item) => ({
        ...item,
        changefreq: "weekly",
        priority: 0.9,
      }));
  },
};
