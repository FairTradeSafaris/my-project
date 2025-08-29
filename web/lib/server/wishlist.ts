"use server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function updateWishlist(userId: string, wishlist: string[]) {
  await clerkClient.users.updateUser(userId, {
    publicMetadata: { wishlist },
  });

  const updatedUser = await clerkClient.users.getUser(userId);
  return updatedUser.publicMetadata?.wishlist || [];
}
