import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@clerk/nextjs/server";
import { updateWishlist } from "@/lib/server/wishlist";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  const { userId } = await auth();

  if (!userId) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  let { wishlist } = req.body;
  if (!Array.isArray(wishlist)) wishlist = [];

  wishlist = wishlist.filter(
    (item: unknown): item is string => typeof item === "string"
  );

  try {
    const updatedWishlist = await updateWishlist(userId, wishlist);
    return res.status(200).json({ success: true, wishlist: updatedWishlist });
  } catch (err) {
    console.error("❌ Error updating wishlist:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update wishlist" });
  }
}
