import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import type { Journey } from "@/components/journey-finder/types";

export function useWishlistGrid(journeys: Journey[]) {
  const [wishlistedMap, setWishlistedMap] = useState<Record<string, boolean>>(
    {}
  );
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      console.warn("❌ No Clerk user ID found.");
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

      console.log("🔑 Wishlist Key:", key);
      console.log("📦 Raw Wishlist JSON:", parsed);
      console.log("✅ Wishlist map populated:", map);

      setWishlistedMap(map);
    } catch (err) {
      console.warn("❌ Failed to parse wishlist from localStorage:", err);
    }
  }, [journeys, userId]);

  return { wishlistedMap };
}
