import { client } from "@/lib/sanity";
import { faqCategoriesQuery } from "@/lib/queries";
import FAQClient from "./FAQClient";

export default async function FAQServer() {
  const categories = await client.fetch(faqCategoriesQuery);
  return <FAQClient categories={categories} />;
}
