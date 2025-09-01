import JourneyCard from "./JourneyCard";

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
  country?: {
    title?: string;
  };
  starRating?: number;
  isFeatured?: boolean;
};

type Props = {
  wishlistJourneys: Journey[];
};

export default function WishlistSection({ wishlistJourneys }: Props) {
  return (
    <div className="mt-14">
      <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>

      {wishlistJourneys.length === 0 ? (
        <p>You haven&apos;t saved any journeys yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistJourneys.map((journey) => (
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
              country={journey.country?.title}
              star={journey.starRating}
              isFeatured={journey.isFeatured}
            />
          ))}
        </div>
      )}
    </div>
  );
}
