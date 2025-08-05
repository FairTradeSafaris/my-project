import { serverClient } from "@/lib/sanity.server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("POST /api/claim-book body:", body);
    const { book, userId } = body;
    console.log("Parsed userId:", userId, "book:", book);

    if (!userId || !book?.title || !book?.previewUrl) {
      console.log("❌ Missing required fields! userId:", userId, "book:", book);
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    await serverClient.create({
      _type: "leadMagnetClaim",
      clerkUserId: userId,
      bookTitle: book.title,
      bookUrl: book.previewUrl,
      claimedAt: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (err) {
    console.error("❌ Failed to create claim:", err);
    return new Response(JSON.stringify({ error: "Failed to create claim" }), {
      status: 500,
    });
  }
}
