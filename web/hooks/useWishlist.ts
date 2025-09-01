import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

type WishlistResponse = {
  journeys?: { _ref: string }[];
};

export function useWishlist(journeyId?: string) {
  const { user } = useUser();
  const userId = user?.id ?? null;

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch(`/api/wishlist?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch wishlist");

      const data: WishlistResponse = await res.json();
      const ids = data?.journeys?.map((j) => j._ref) || [];

      setWishlistIds(ids);

      if (journeyId) {
        setIsWishlisted(ids.includes(journeyId));
      }
    } catch (err) {
      console.error("❌ useWishlist fetch error:", err);
    }
  }, [userId, journeyId]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async () => {
    if (!userId || !journeyId) return;
    setLoading(true);

    const action = isWishlisted ? "remove" : "add";

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, journeyId, action }),
      });

      if (!res.ok) throw new Error("Failed to update wishlist");

      const updated = action === "add";
      setIsWishlisted(updated);

      // If adding, also add to ids array
      setWishlistIds((prev) =>
        updated ? [...prev, journeyId] : prev.filter((id) => id !== journeyId)
      );
    } catch (err) {
      console.error("❌ Wishlist toggle error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    wishlistIds,
    isWishlisted,
    loading,
    toggleWishlist,
  };
}
