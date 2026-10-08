// Server-rendered JSON-LD.
//
// Why: several routes passed schema through `metadata.other["script:ld+json"]`.
// Next.js renders `other` entries as <meta name="script:ld+json" content="...">,
// which search engines ignore — so the TouristDestination, Breadcrumb, FAQ,
// Product and CollectionPage schemas were never actually visible to Google.
// `next/script` with type="application/ld+json" is also injected client-side
// only. A plain <script> rendered by a Server Component is in the raw HTML.

type Props = { data: unknown; id?: string };

export default function JsonLd({ data, id }: Props) {
  if (!data) return null;
  return (
    <script
      id={id}
      type="application/ld+json"
      // escape "<" so CMS text can never close the script tag
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
