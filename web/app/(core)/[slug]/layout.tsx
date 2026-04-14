import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

// ✅ Types
type PortableTextChild = {
  text: string;
};

type PortableTextBlock = {
  children?: PortableTextChild[];
};

type FAQItem = {
  question: string;
  answer: PortableTextBlock[];
};

type PageData = {
  title: string;
  metaDescription: string;
  slug: string;
  faq?: FAQItem[];
};

// ✅ Query
const schemaQuery = groq`
*[_type == "pillarPage" && slug.current == $slug][0]{
  title,
  metaDescription,
  "slug": slug.current,
  faq[]->{
    question,
    answer
  }
}
`;

type Props = {
  children: React.ReactNode;
  params: { slug: string };
};

export default async function Layout({ children, params }: Props) {
  const data: PageData | null = await client.fetch(schemaQuery, {
    slug: params.slug,
  });

  // fallback
  if (!data) {
    return <>{children}</>;
  }

  // ✅ Page schema
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: data.title,
    description: data.metaDescription,
    url: `https://www.fairtradesafaris.com/${data.slug}`,
  };

  // ✅ FAQ schema
  const faqSchema =
    data.faq && data.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text:
                item.answer
                  ?.map((block) =>
                    block.children?.map((child) => child.text).join(""),
                  )
                  .join(" ") ?? "",
            },
          })),
        }
      : null;

  return (
    <>
      {/* ✅ CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageSchema),
        }}
      />

      {/* ✅ FAQPage */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      {children}
    </>
  );
}
