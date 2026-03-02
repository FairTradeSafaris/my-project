"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
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
  const [hasConsent, setHasConsent] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistJourneys, setWishlistJourneys] = useState<JourneyLite[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useUser(); // ✅ Always call this unconditionally
  const userId = isClientReady && hasConsent ? (user?.id ?? null) : null;
  const storageKey = userId ? `wishlist_user_${userId}` : null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClientReady(true);
    }
  }, []);

  useEffect(() => {
    if (isClientReady) {
      const consent = localStorage.getItem("cookieConsent");
      if (consent === "accepted") {
        setHasConsent(true);
      }
    }
  }, [isClientReady]);

  const fetchWishlist = useCallback(async () => {
    if (!userId || !storageKey) return;

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const local = JSON.parse(raw);
        setWishlistJourneys(local);
        setWishlistIds(local.map((j: JourneyLite) => j._id));
        if (journeyId) {
          setIsWishlisted(local.some((j: JourneyLite) => j._id === journeyId));
        }
      }

      const res = await fetch(`/api/wishlist?userId=${userId}`);
      if (!res.ok) return;

      const data: WishlistResponse = await res.json();
      const ids = data?.journeys?.map((j) => j._ref) || [];
      setWishlistIds(ids);
      if (journeyId) setIsWishlisted(ids.includes(journeyId));
    } catch {
      // silent fail
    }
  }, [userId, journeyId, storageKey]);

  useEffect(() => {
    if (hasConsent && userId) {
      fetchWishlist();
    }
  }, [hasConsent, userId, fetchWishlist]);

  const toggleWishlist = async () => {
    if (!userId || !journeyId || !storageKey) return;
    setLoading(true);

    const action = isWishlisted ? "remove" : "add";

    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, journeyId, action }),
      });

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
      } else {
        const updated = wishlistJourneys.filter((j) => j._id !== journeyId);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setWishlistJourneys(updated);
        setWishlistIds((prev) => prev.filter((id) => id !== journeyId));
        setIsWishlisted(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isClientReady || !hasConsent || !userId) {
    return {
      wishlistIds: [],
      wishlistJourneys: [],
      isWishlisted: false,
      loading: false,
      toggleWishlist: async () => {},
    };
  }

  return {
    wishlistIds,
    wishlistJourneys,
    isWishlisted,
    loading,
    toggleWishlist,
  };
}
