import { useEffect, useState } from "react";
import type { Journey } from "@/components/journey-finder/types";

/**
 * Returns a map of journey IDs that are wishlisted by the user.
 * Fully decoupled from Clerk – only uses `userId` if passed in.
 */
export function useWishlistGrid(journeys: Journey[], userId: string | null) {
  const [wishlistedMap, setWishlistedMap] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    if (!userId) {
      // No user = no wishlist
      setWishlistedMap({});
      return;
    }

    const key = `wishlist_user_${userId}`;
    const raw = localStorage.getItem(key);

    try {
      const parsed: { _id: string }[] = JSON.parse(raw || "[]");
      const map: Record<string, boolean> = {};

      parsed.forEach((item) => {
        if (item?._id) {
          map[item._id] = true;
        }
      });

      setWishlistedMap(map);
    } catch (err) {
      console.warn("❌ Failed to parse wishlist:", err);
      setWishlistedMap({});
    }
  }, [journeys, userId]);

  return { wishlistedMap };
}
