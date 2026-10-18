import Link from "next/link";
import {
  sanityDimensions,
  sanitySized,
  sanitySrcSet,
} from "@/lib/sanityImageLoader";
import {
  homeBody,
  homeButton,
  homeContainer,
  homeH2,
  homeSection,
} from "@/components/home/homeStyles";

// Batch 20: calm restyle (display only). Same Sanity headline, text, button,
// background and line-art image; wider container, consistent type.

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
    <section className={`relative isolate overflow-hidden bg-[#efe3cf] ${homeSection}`}>
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
      <div className={`${homeContainer} grid items-center gap-8 md:grid-cols-2 md:gap-12`}>
        {/* TEXT */}
        <div className={textOnLeft ? "" : "md:order-2"}>
          {/* Batch 20: h2 (was h3) - it is a main section of the page */}
          <h2 className={homeH2}>{headline}</h2>

          {subheadline && (
            <p className={`mt-4 max-w-xl ${homeBody} text-[#3f2e1f] md:text-[17px] md:leading-8`}>
              {subheadline}
            </p>
          )}

          {buttonText && buttonLink && (
            <div className="mt-6">
              <Link href={buttonLink} className={homeButton}>
                {buttonText}
              </Link>
            </div>
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
              className="mx-auto w-full max-w-[420px] opacity-90"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
      </div>
    </section>
  );
}
