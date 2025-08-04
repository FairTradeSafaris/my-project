import { auth } from "@clerk/nextjs/server";
import BookPageContent from "./BookPageContent";

export default async function BooksPage() {
  const { userId } = await auth();
  return <BookPageContent userId={userId} />;
}
