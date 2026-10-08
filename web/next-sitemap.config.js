/** @type {import('next-sitemap').IConfig} */

const getStaticUrls = require("./scripts/get-static-urls.js");
const getBlogUrls = require("./scripts/get-blog-urls.js");
const getDestinationUrls = require("./scripts/get-destination-urls.js");
const getAuthorUrls = require("./scripts/getAuthorUrls.js");
const getAmbassadorUrls = require("./scripts/get-ambassador-urls.js");
const getVideoTestimonialUrls = require("./scripts/get-video-testimonial-urls.js");
const getPillarUrls = require("./scripts/get-pillar-urls.js");

// Batch 3a: search/filter URL variants of the itinerary index (q= / open= as
// the first or a later query parameter). Named user-agent groups do NOT
// inherit the `*` rules, so every group below carries the same list.
const ITINERARY_FILTER_DISALLOW = [
  "/africansafariitineraries/?q=",
  "/africansafariitineraries/?open=",
  "/africansafariitineraries/?*&q=",
  "/africansafariitineraries/?*&open=",
];

module.exports = {
  siteUrl: "https://www.fairtradesafaris.com",

  // Batch 4: list the journeys URL file directly. journeys-sitemap.xml is
  // itself a sitemap index, and an index inside an index isn't supported by
  // the sitemap protocol (Google ignores nested indexes). journeys-sitemap.xml
  // is still generated, so a copy submitted in Search Console keeps working.
  // (next-sitemap builds the index from robotsTxtOptions.additionalSitemaps
  // below; this top-level key is kept in step with it.)
  additionalSitemaps: ["https://www.fairtradesafaris.com/journeys-sitemap-0.xml"],

  generateRobotsTxt: true,

  // trailingSlash matches next.config.ts (trailingSlash: true)
  trailingSlash: true,

  exclude: [
    "/404",
    "/500",
    // never list sitemap files / non-HTML assets as pages
    "/*.xml",
    "/journeys-sitemap*",
    "/sign-in*",
    "/sign-up*",
    "/user-profile*",
    "/bookings",
    "/_offline",
    "/client-home",
    "/books",
    "/project-portal",
    "/robots.txt",
    // Batch 3a: destination pages are listed by additionalPaths
    // (scripts/get-destination-urls.js, with trailing slash + lastmod). The
    // auto-discovered copies have no trailing slash, so every country was in
    // the sitemap twice.
    "/destination/*",
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
      if (/\.(xml|txt|json|png|jpe?g|webp|svg)$/i.test(item.loc)) return;
      uniqueMap.set(item.loc, item);
    });

    return Array.from(uniqueMap.values());
  },

  robotsTxtOptions: {
    transformRobotsTxt: async (config, robotsTxt) => {
      return robotsTxt.replace(/Host: .*\n?/g, "");
    },
    // Used for BOTH sitemap.xml (index entries) and the robots.txt Sitemap:
    // lines (sitemap.xml is added automatically).
    additionalSitemaps: [
      "https://www.fairtradesafaris.com/journeys-sitemap-0.xml",
    ],
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ITINERARY_FILTER_DISALLOW,
      },
      { userAgent: "GPTBot", allow: "/", disallow: ITINERARY_FILTER_DISALLOW },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ITINERARY_FILTER_DISALLOW,
      },
      { userAgent: "CCBot", allow: "/", disallow: ITINERARY_FILTER_DISALLOW },
    ],
  },
};
