// components/NavbarWrapper.tsx
import Navbar from "./Navbar";
import { client } from "@/lib/sanity";

export default async function NavbarWrapper() {
  const data = await client.fetch(`
    *[_type == "megaMenu"][0]{
      navLinks,
      featureCards[]{
        title,
        description,
        image { asset->{url} },
        alt,
        link
      }
    }
  `);

  return <Navbar navLinks={data.navLinks} featureCards={data.featureCards} />;
}
