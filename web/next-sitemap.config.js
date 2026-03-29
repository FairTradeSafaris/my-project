/** @type {import('next-sitemap').IConfig} */

const getStaticUrls = require("./scripts/get-static-urls.js");
const getBlogUrls = require("./scripts/get-blog-urls.js");
const getDestinationUrls = require("./scripts/get-destination-urls.js");
const getAuthorUrls = require("./scripts/getAuthorUrls.js");
const getAmbassadorUrls = require("./scripts/get-ambassador-urls.js");
const getVideoTestimonialUrls = require("./scripts/get-video-testimonial-urls.js");
const getPillarUrls = require("./scripts/get-pillar-urls.js");

module.exports = {
  siteUrl: "https://www.fairtradesafaris.com",

  additionalSitemaps: ["https://www.fairtradesafaris.com/journeys-sitemap.xml"],

  generateRobotsTxt: true,

  exclude: [
    "/404",
    "/500",
    "/client-home",
    "/books",
    "/project-portal",
    "/robots.txt",
  ],

  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,

  additionalPaths: async () => {
    const staticPaths = await getStaticUrls();
    const blogPaths = await getBlogUrls();
    const destinationPaths = await getDestinationUrls();
    const authorPaths = await getAuthorUrls();
    const ambassadorPaths = await getAmbassadorUrls();
    const videoTestimonialPaths = await getVideoTestimonialUrls();
    const pillarPaths = await getPillarUrls();

    const homePage = [{ loc: "/", changefreq: "weekly", priority: 1.0 }];

    // Combine everything
    const allPaths = [
      ...homePage,
      ...pillarPaths,
      ...staticPaths,
      ...blogPaths,
      ...destinationPaths,
      ...videoTestimonialPaths,
      ...authorPaths,
      ...ambassadorPaths,
    ];

    // 🔥 GLOBAL DEDUPLICATION
    const uniqueMap = new Map();

    allPaths.forEach((item) => {
      if (!item || !item.loc) return;
      uniqueMap.set(item.loc, item);
    });

    return Array.from(uniqueMap.values());
  },

  robotsTxtOptions: {
    additionalSitemaps: [
      "https://www.fairtradesafaris.com/journeys-sitemap.xml",
    ],
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
