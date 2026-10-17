import { serverClient } from "@/lib/sanity.server";
import { getPortalUser, unauthorized } from "@/lib/server/portalAuth";

export async function POST(req: Request) {
  // The user is always the logged-in Clerk user; any userId in the body is ignored.
  const me = await getPortalUser(req);
  if (!me) return unauthorized();

  try {
    const body = await req.json();
    const { book } = body ?? {};

    if (!book?.title || !book?.previewUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    await serverClient.create({
      _type: "leadMagnetClaim",
      clerkUserId: me.userId,
      bookTitle: book.title,
      bookUrl: book.previewUrl,
      claimedAt: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (err) {
    console.error(
      "[claim-book] failed:",
      err instanceof Error ? err.message : "unknown error"
    );
    return new Response(JSON.stringify({ error: "Failed to create claim" }), {
      status: 500,
    });
  }
}
