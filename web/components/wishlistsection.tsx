"use client";

import JourneyCard from "./JourneyCard";
import { useWishlist } from "@/hooks/useWishlist";
import { useEffect, useState } from "react";

type Journey = {
  _id: string;
  title: string;
  slug?: {
    current?: string;
  };
  summary?: string;
  mainImage?: {
    asset?: {
      url?: string;
    };
  };
  price?: number;
  duration?: string;
  region?: {
    title?: string;
  };
  countries?: {
    title: string;
  }[];
  starRating?: number;
  isFeatured?: boolean;
};

type Props = {
  wishlistJourneys: Journey[];
};

export default function WishlistSection({ wishlistJourneys }: Props) {
  const [mounted, setMounted] = useState(false);

  const { wishlistIds } = useWishlist();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="mt-14">
      <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>

      {wishlistJourneys.length === 0 ? (
        <p>You haven&apos;t saved any journeys yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistJourneys.map((journey) => {
            const destinationTitles =
              journey.countries?.map((c) => c.title) || [];

            return (
              <JourneyCard
                key={journey._id}
                journeyId={journey._id}
                slug={journey.slug?.current || ""}
                title={journey.title}
                summary={journey.summary}
                imageUrl={journey.mainImage?.asset?.url}
                alt={journey.title}
                price={journey.price}
                duration={journey.duration}
                region={journey.region?.title}
                destinations={destinationTitles} // ✅ updated to match prop type
                star={journey.starRating}
                isFeatured={journey.isFeatured}
                isWishlisted={wishlistIds.includes(journey._id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
