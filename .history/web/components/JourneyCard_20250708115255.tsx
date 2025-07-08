import Image from "next/image";
type Props = {
  title: string;
  summary?: string;
  imageUrl?: string;
  alt?: string;
  price?: string;
  duration?: string;
  region?: string;
  country?: string;
  starIcon?: string;
  star?: number;
  metaIcons?: React.ReactNode;
  badgeText?: string; // 🆕 NEW PROP
};

export default function JourneyCard({
  title,
  summary,
  imageUrl,
  alt,
  price,
  duration,
  region,
  starIcon,
  star = 0,
  metaIcons,
  badgeText,
}: Props) {
  return (
    <div className="relative w-full max-w-sm overflow-visible pb-40 bg-transparent">
      {/* Image container */}
      <div className="relative">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={alt || "Journey image"}
            width={400}
            height={256}
            className="w-full h-64 object-cover rounded-md"
          />
        )}

        {/* Price Ribbon */}
        {price && (
          <div className="price-ribbon">
            From {price.startsWith("$") ? price : `$${price}`}/person
          </div>
        )}

        {/* 🆕 Featured/Hot Seller Badge */}
        {badgeText && (
          <div className="absolute top-2 left-2 bg-yellow-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg uppercase z-10">
            {badgeText}
          </div>
        )}
      </div>

      {/* Text Box */}
      <div className="absolute top-48 left-4 right-4 bg-white p-4 shadow-lg border border-gray-200 rounded-md z-30 flex flex-col h-[220px]">
        {(duration || region) && (
          <p className="text-xs uppercase text-orange-600 font-bold mb-1">
            {duration}
            {region && ` • ${region}`}
          </p>
        )}

        <h3 className="text-lg font-bold text-gray-800 mb-1 leading-snug line-clamp-2">
          {title}
        </h3>

        {summary && <p className="text-sm text-gray-600 mb-2">{summary}</p>}

        {star > 0 && (
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={starIcon || "/default-star.svg"}
                alt="Star"
                className={`w-4 h-4 ${i >= star ? "opacity-30" : ""}`}
              />
            ))}
          </div>
        )}

        {metaIcons && (
          <div className="flex items-center gap-4 mt-2">{metaIcons}</div>
        )}
      </div>
    </div>
  );
}
