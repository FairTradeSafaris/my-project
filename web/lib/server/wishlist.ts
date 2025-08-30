"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function updateWishlist(userId: string, wishlist: string[]) {
  const client = await clerkClient(); // ✅ Add await

  await client.users.updateUser(userId, {
    publicMetadata: { wishlist },
  });

  const updatedUser = await client.users.getUser(userId);
  return updatedUser.publicMetadata?.wishlist || [];
}
