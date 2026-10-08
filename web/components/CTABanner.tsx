import Link from "next/link";
import {
  sanityDimensions,
  sanitySized,
  sanitySrcSet,
} from "@/lib/sanityImageLoader";

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
  // Performance: the CMS background used to be a CSS background-image, which
  // the browser fetches immediately (110 KB competing with the hero on the
  // homepage, even though this banner is far below the fold). It is now a
  // lazy <img> with the same cover/center positioning, sized per screen
  // width by Sanity's image CDN.
  const bgUrl = backgroundImage?.asset?.url;
  const sideUrl = sideImage?.asset?.url;
  const sideDims = sanityDimensions(sideUrl);

  return (
    <section className="py-16 md:py-20 relative overflow-hidden isolate">
      {bgUrl && (
        <img
          src={sanitySized(bgUrl, 1920)}
          srcSet={sanitySrcSet(bgUrl, [640, 960, 1280, 1920])}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />
      )}
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
              src={sanitySized(sideUrl, 896)}
              alt={headline || "CTA image"}
              width={sideDims?.width}
              height={sideDims?.height}
              className="w-full max-w-md mx-auto"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-b from-transparent to-[#f5f2ed]" />
    </section>
  );
}
