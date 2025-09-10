// app/robots.txt/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const isProduction = process.env.NODE_ENV === "production";

  const body = isProduction
    ? `
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

Host: https://www.fairtradesafaris.com
Sitemap: https://www.fairtradesafaris.com/sitemap.xml
`.trim()
    : `
User-agent: *
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /
`.trim();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
