import Navbar from "./Navbar";
import { client } from "@/lib/sanity";

export default async function NavbarWrapper() {
  const data = await client.fetch(`
    *[_type == "megaMenu"][0]{
      navSections[] {
        heading,
        links[] {
          title,
          href
        }
      },
      featureCards[] {
        title,
        description,
        alt,
        link,
        image {
          asset -> {
            url
          }
        }
      },
      promoCard {
        title,
        description,
        alt,
        link,
        image {
          asset -> {
            url
          }
        }
      }
    }
  `);

  // ✅ Add this — log to server console (your terminal)
  console.log("NAV DATA:", JSON.stringify(data, null, 2));

  return (
    <Navbar
      navSections={data.navSections}
      featureCards={data.featureCards}
      promoCard={data.promoCard}
    />
  );
}
