import Link from "next/link";

type CTABannerProps = {
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  buttonLink?: string;
  textOnLeft?: boolean;
  sideImage?: { asset?: { url?: string } };
  backgroundImage?: { asset?: { url?: string } };
};

export default function CTABanner({
  headline,
  subheadline,
  buttonText,
  buttonLink,
  textOnLeft,
  sideImage,
  backgroundImage,
}: CTABannerProps) {
  return (
    <section
      className="py-16 md:py-20 relative overflow-hidden"
      style={{
        backgroundImage: backgroundImage?.asset?.url
          ? `url(${backgroundImage.asset.url})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        {/* TEXT */}
        <div className={textOnLeft ? "" : "md:order-2"}>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">{headline}</h3>

          {subheadline && <p className="text-gray-700 mb-6">{subheadline}</p>}

          {buttonText && buttonLink && (
            <Link
              href={buttonLink}
              className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
            >
              {buttonText}
            </Link>
          )}
        </div>

        {/* IMAGE */}
        {sideImage?.asset?.url && (
          <div className={textOnLeft ? "md:order-2" : ""}>
            <img
              src={sideImage.asset.url}
              alt={headline || "CTA image"}
              className="w-full max-w-md mx-auto"
            />
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-b from-transparent to-[#f5f2ed]" />
    </section>
  );
}
