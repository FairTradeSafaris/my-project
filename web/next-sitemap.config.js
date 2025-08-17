/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_APP_URL || "https://demo.fairtradesafaris.com", // ⬅ fallback to demo if env is unset
  generateRobotsTxt: true,
  exclude: ["/404", "/500"],
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
