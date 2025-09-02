import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { client as sanityClient } from "@/lib/sanity";

type WishlistResponse = {
  journeys?: { _ref: string }[];
};

type JourneyLite = {
  _id: string;
  title: string;
  slug: { current: string };
  price?: string;
  heroUrl?: string;
  duration?: string;
  star?: string;
  region?: { title: string };
};

export function useWishlist(journeyId?: string) {
  const { user } = useUser();
  const userId = user?.id ?? null;

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistJourneys, setWishlistJourneys] = useState<JourneyLite[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const storageKey = userId ? `wishlist_user_${userId}` : null;

  // ✅ Fetch wishlist from localStorage first, then from API
  const fetchWishlist = useCallback(async () => {
    if (!userId) return;

    try {
      let local: JourneyLite[] = [];
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(storageKey!);
        if (raw) {
          try {
            local = JSON.parse(raw);
            setWishlistJourneys(local);
            setWishlistIds(local.map((j) => j._id));
            if (journeyId) {
              setIsWishlisted(local.some((j) => j._id === journeyId));
            }
          } catch {
            console.warn("❌ Failed to parse wishlist from localStorage");
          }
        }
      }

      // ✅ Also sync from backend
      const res = await fetch(`/api/wishlist?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch wishlist");

      const data: WishlistResponse = await res.json();
      const ids = data?.journeys?.map((j) => j._ref) || [];

      setWishlistIds(ids);
      if (journeyId) setIsWishlisted(ids.includes(journeyId));

      // Optional: reconcile with localStorage or fetch full objects
    } catch (err) {
      console.error("❌ useWishlist fetch error:", err);
    }
  }, [userId, journeyId, storageKey]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async () => {
    if (!userId || !journeyId || !storageKey) return;
    setLoading(true);

    const action = isWishlisted ? "remove" : "add";

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, journeyId, action }),
      });

      if (!res.ok) throw new Error("Failed to update wishlist");

      // ✅ If adding → fetch full journey from Sanity
      if (action === "add") {
        const fullJourney: JourneyLite = await sanityClient.fetch(
          `*[_type == "journey" && _id == $id][0]{
            _id, title, slug, price, duration, star,
            "heroUrl": heroImage.asset->url,
            region->{ title }
          }`,
          { id: journeyId }
        );

        const updated = [...wishlistJourneys, fullJourney];
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setWishlistJourneys(updated);
        setWishlistIds((prev) => [...prev, journeyId]);
        setIsWishlisted(true);
      }

      // ✅ If removing → remove from localStorage
      if (action === "remove") {
        const updated = wishlistJourneys.filter((j) => j._id !== journeyId);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setWishlistJourneys(updated);
        setWishlistIds((prev) => prev.filter((id) => id !== journeyId));
        setIsWishlisted(false);
      }
    } catch (err) {
      console.error("❌ Wishlist toggle error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    wishlistIds,
    wishlistJourneys, // ✅ expose full journeys (optional)
    isWishlisted,
    loading,
    toggleWishlist,
  };
}
