import {
  clerkMiddleware,
  type ClerkMiddlewareAuth,
} from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { match } from "path-to-regexp";
import redirects from "./public/redirects.json";

type Redirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

const knownValidPaths = [
  "/",
  "/sign-in",
  "/sign-up",
  "/sign-out",
  "/meta-test",
];

const addSecurityHeaders = (res: NextResponse) => {
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "geolocation=(), microphone=()");

  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self';",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;",
      "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https:;",
      "style-src 'self' 'unsafe-inline' https:;",
      "img-src 'self' data: blob: https:;",
      "media-src 'self' https:;", // ← ADD THIS
      "connect-src 'self' https:;",
      "font-src 'self' data: https:;",
      "frame-src https:;",
      "worker-src 'self' blob:;",
    ].join(" "),
  );

  res.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  return res;
};

const middlewareLogic = async (auth: ClerkMiddlewareAuth, req: NextRequest) => {
  const pathname = req.nextUrl.pathname;

  // ✅ ABSOLUTE BYPASS FOR API ROUTES (Zoho fix)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  const cleanPath = pathname.replace(/\/+$/, "").toLowerCase();
  const host = req.headers.get("host");

  if (host?.startsWith("wordpress.") || host?.startsWith("staging4.")) {
    const destinationUrl = new URL("/", req.url);
    destinationUrl.hostname = "fairtradesafaris.com";
    return NextResponse.redirect(destinationUrl, 301);
  }

  try {
    const redirectList: Redirect[] = redirects;

    for (const r of redirectList) {
      const normalizedSource = r.source.replace(/\/+$/, "").toLowerCase();

      if (normalizedSource.includes("?")) continue;

      let matcher;
      try {
        matcher = match(normalizedSource, {
          decode: decodeURIComponent,
          end: true,
        });
      } catch {
        continue;
      }

      const result = matcher(cleanPath);
      if (result !== false) {
        const destinationUrl = new URL(r.destination, req.url);
        destinationUrl.search = url.search;

        return NextResponse.redirect(destinationUrl, r.permanent ? 301 : 302);
      }
    }
  } catch {}

  if (cleanPath.startsWith("/destinations/")) {
    const newPath = cleanPath
      .replace("/destinations/", "/destination/")
      .replace(/\/?$/, "/"); // force trailing slash

    const redirectUrl = new URL(newPath, req.url);
    redirectUrl.search = url.search;

    return NextResponse.redirect(redirectUrl, 301);
  }

  if (cleanPath.startsWith("/news/") || cleanPath.startsWith("/adventure/")) {
    const redirectUrl = new URL("/blog", req.url);
    redirectUrl.search = url.search;
    return NextResponse.redirect(redirectUrl, 301);
  }

  if (knownValidPaths.includes(cleanPath)) {
    return addSecurityHeaders(NextResponse.next());
  }

  const res = NextResponse.next();
  return addSecurityHeaders(res);
};

export default clerkMiddleware(middlewareLogic);

export const config = {
  matcher: ["/", "/((?!_next|.*\\..*|wp-admin).*)"],
};
