"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function updateWishlist(userId: string, wishlist: string[]) {
  const client = await clerkClient();

  await client.users.updateUserMetadata(userId, {
    publicMetadata: { wishlist },
  });

  const updatedUser = await client.users.getUser(userId);
  return updatedUser.publicMetadata?.wishlist || [];
}
