import { serverClient } from "@/lib/sanity.server";

export async function POST(req: Request) {
  try {
    const { book, userId } = await req.json();

    if (!userId || !book?.title || !book?.previewUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
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
