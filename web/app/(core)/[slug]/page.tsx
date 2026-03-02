import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import BlogContent from "@/components/BlogContent";

export const revalidate = 0;

const query = groq`
  *[_type == "pillarPage" && slug.current == $slug][0]{
    title,
    heroVideo{
      asset->{ url }
    },
    heroPoster{
      asset->{ url },
      alt
    },
    heroHeadline,
    heroSubheadline,
    content[] {
      ...,
      _type == "heroBlock" => {
        ...,
        "image": {
          "url": image.asset->url,
          "alt": image.alt
        }
      },
      _type == "textImage" => {
        ...,
        "image": {
          "url": image.asset->url,
          "alt": image.alt
        }
      },
      _type == "galleryBlock" => {
        ...,
        "images": images[] {
          "url": asset->url,
          "alt": alt
        }
      }
    }
  }
`;

export default async function CorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await client.fetch(query, { slug });

  if (!data) return notFound();

  const videoUrl = data?.heroVideo?.asset?.url;
  const posterUrl = data?.heroPoster?.asset?.url;
  const headline = data?.heroHeadline || data?.title;
  const subheadline = data?.heroSubheadline;

  return (
    <main className="bg-white text-black min-h-screen">
      {/* Hero */}
      <section className="relative w-full h-[90vh] min-h-[600px] max-h-[1000px] overflow-hidden bg-black">
        {posterUrl && (
          <img
            src={posterUrl}
            alt={headline}
            className="absolute inset-0 w-full h-full object-cover animate-heroZoom"
          />
        )}
        {videoUrl && (
          <video
            className="absolute inset-0 w-full h-full object-cover animate-heroZoom"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={posterUrl}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
        <div className="relative z-10 h-full flex items-end animate-fadeInSlow">
          <div className="w-full max-w-6xl mx-auto px-6 pb-14">
            <h1 className="text-white text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] animate-heroTextUp drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
              {headline}
            </h1>
            {subheadline && (
              <p className="mt-5 max-w-2xl text-white/90 text-base sm:text-lg leading-relaxed animate-heroTextUp [animation-delay:180ms]">
                {subheadline}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}

      <BlogContent blocks={data.content} />
    </main>
  );
}
