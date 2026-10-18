/** @type {import('next-sitemap').IConfig} */

const getStaticUrls = require("./scripts/get-static-urls.js");
const getBlogUrls = require("./scripts/get-blog-urls.js");
const getDestinationUrls = require("./scripts/get-destination-urls.js");
const getAuthorUrls = require("./scripts/getAuthorUrls.js");
const getAmbassadorUrls = require("./scripts/get-ambassador-urls.js");
const getVideoTestimonialUrls = require("./scripts/get-video-testimonial-urls.js");
const getPillarUrls = require("./scripts/get-pillar-urls.js");
const getSafariQuestionUrls = require("./scripts/get-safari-question-urls.js"); // batch 17

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
    // Batch 16: API routes are not pages (e.g. /api/ambassador-config/)
    "/api/*",
    // Batch 17: listed by additionalPaths (only when questions exist)
    "/safari-questions",
    "/safari-questions/*",
    // Batch 3a: destination pages are listed by additionalPaths
    // (scripts/get-destination-urls.js, with trailing slash + lastmod). The
    // auto-discovered copies have no trailing slash, so every country was in
    // the sitemap twice.
    "/destination/*",
    // Batch 8: tag listing pages are noindex
    "/blog/tags/*",
    // duplicate of /videoTestimonial/greg-and-megan-shindler/ (301)
    "/videoTestimonial/greg-and-megan-shindler1*",
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
    const safariQuestionPaths = await getSafariQuestionUrls();

    const homePage = [{ loc: "/", changefreq: "weekly", priority: 1.0 }];
    // batch 12: ambassador / affiliate programme join page
    const programmePages = [{ loc: "/affiliate-program/", changefreq: "monthly", priority: 0.7 }];

    // Combine everything
    const allPaths = [
      ...homePage,
      ...programmePages,
      ...pillarPaths,
      ...staticPaths,
      ...blogPaths,
      ...destinationPaths,
      ...videoTestimonialPaths,
      ...authorPaths,
      ...ambassadorPaths,
      ...safariQuestionPaths,
    ];

    // 🔥 GLOBAL DEDUPLICATION
    const uniqueMap = new Map();

    allPaths.forEach((item) => {
      if (!item || !item.loc) return;
      if (/\.(xml|txt|json|png|jpe?g|webp|svg)$/i.test(item.loc)) return;
      uniqueMap.set(item.loc, item);
    });

    // Batch 25: video sitemap entry for the Fair Trade Safaris film on the
    // pages that show it (same facts as components/video/ftsVideo.ts).
    const FTS_VIDEO_PAGES = ["/", "/affiliate-program/", "/ethical-sustainable-safaris/", "/contact/"];
    const ftsVideo = {
      title: "Safe, luxurious, and affordable wildlife safaris in Africa",
      description:
        "Meet Fair Trade Safaris: a socially conscious travel company planning memorable trips to Africa, from wildlife safaris and beach holidays to mountain climbs, food experiences and relaxing retreats, with every journey giving back to wildlife and local communities.",
      thumbnailLoc: new URL("https://i.ytimg.com/vi/ARcR_mGkZ_s/maxresdefault.jpg"),
      playerLoc: new URL("https://www.youtube.com/embed/ARcR_mGkZ_s"),
      duration: 331,
      publicationDate: "2019-06-27T14:19:59-07:00",
      familyFriendly: true,
    };
    // The ethical safaris page (indexable, canonical) was missing from the
    // sitemap; list it once, unless it is already there.
    if (!uniqueMap.has("/ethical-sustainable-safaris/")) {
      uniqueMap.set("/ethical-sustainable-safaris/", {
        loc: "/ethical-sustainable-safaris/",
        changefreq: "monthly",
        priority: 0.8,
      });
    }
    for (const loc of FTS_VIDEO_PAGES) {
      const item = uniqueMap.get(loc);
      if (item) uniqueMap.set(loc, { ...item, videos: [ftsVideo] });
    }

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
