"use server";

import { clerkClient } from "@clerk/clerk-sdk-node";

export async function updateWishlist(userId: string, wishlist: string[]) {
  // Update the user's public metadata with the new wishlist
  await clerkClient.users.updateUser(userId, {
    publicMetadata: { wishlist },
  });

  // Retrieve updated metadata to confirm and return it
  const updatedUser = await clerkClient.users.getUser(userId);
  return updatedUser.publicMetadata?.wishlist || [];
}
