import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // All routes except static files
    "/", // Home
    "/client-home(.*)", // Client portal
  ],
};
