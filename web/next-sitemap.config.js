/** @type {import('next-sitemap').IConfig} */

const getStaticUrls = require("./scripts/get-static-urls.js");
const getBlogUrls = require("./scripts/get-blog-urls.js");
const getDestinationUrls = require("./scripts/get-destination-urls.js");
const getAuthorUrls = require("./scripts/getAuthorUrls.js");
const getJourneyUrls = require("./scripts/get-journey-urls.js");
const getAmbassadorUrls = require("./scripts/get-ambassador-urls.js");
const getVideoTestimonialUrls = require("./scripts/get-video-testimonial-urls.js");
const getPillarUrls = require("./scripts/get-pillar-urls.js");

module.exports = {
  siteUrl: "https://www.fairtradesafaris.com",
  generateRobotsTxt: true,
  exclude: ["/404", "/500", "/client-home", "/books", "/project-portal"],
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  additionalPaths: async () => {
    const staticPaths = await getStaticUrls();
    const blogPaths = await getBlogUrls();
    const destinationPaths = await getDestinationUrls();
    const authorPaths = await getAuthorUrls();
    const journeyPaths = await getJourneyUrls();
    const ambassadorPaths = await getAmbassadorUrls();
    const homePage = [{ loc: "/", changefreq: "weekly", priority: 1.0 }];
    const videoTestimonialPaths = await getVideoTestimonialUrls();
    const pillarPaths = await getPillarUrls();

    return [
      ...homePage,
      ...pillarPaths,
      ...staticPaths,
      ...blogPaths,
      ...destinationPaths,
      ...videoTestimonialPaths,
      ...authorPaths,
      ...journeyPaths,
      ...ambassadorPaths,
    ];
  },

  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
    ],
  },
  transformRobotsTxt: async (robotsTxt) => {
    return `Host: https://www.fairtradesafaris.com\n\n${robotsTxt}`;
  },
};
