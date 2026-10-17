// lib/server/portalAuth.ts
// Server-only helpers that identify the logged-in Clerk user straight from the
// request (session cookie or "Authorization: Bearer <session token>").
// They do NOT depend on the Clerk middleware matcher, so they work on /api/*
// routes without changing middleware.ts.
import { clerkClient } from "@clerk/nextjs/server";

export type PortalUser = { userId: string };

export async function getPortalUser(req: Request): Promise<PortalUser | null> {
  try {
    const client = await clerkClient();
    const state = await client.authenticateRequest(req);
    if (!state.isSignedIn) return null;
    const auth = state.toAuth();
    const userId = auth?.userId;
    return userId ? { userId } : null;
  } catch {
    // Missing keys, bad/expired token, network error: treat as signed out.
    return null;
  }
}

/** Verified email addresses of the logged-in user, lower-cased. */
export async function getVerifiedEmails(userId: string): Promise<string[]> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const emails = user.emailAddresses
    .filter((e) => e.verification?.status === "verified")
    .map((e) => e.emailAddress.toLowerCase().trim());
  return Array.from(new Set(emails));
}

export function unauthorized() {
  return Response.json({ error: "Not signed in" }, { status: 401 });
}

/** Fields of a trip document that a client may upload to / delete from. */
export const CLIENT_UPLOAD_FIELDS = [
  "passportUploads",
  "flightTicketUploads",
] as const;
export type ClientUploadField = (typeof CLIENT_UPLOAD_FIELDS)[number];

export function isClientUploadField(v: unknown): v is ClientUploadField {
  return (
    typeof v === "string" &&
    (CLIENT_UPLOAD_FIELDS as readonly string[]).includes(v)
  );
}
