"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type Book = {
  _id: string;
  title: string;
  previewUrl: string;
  description?: string;
};

export default function BookPageContent({ userId }: { userId: string | null }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data.books || []);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const handleClaim = async (book: Book) => {
    const res = await fetch("/api/claim-book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book, userId }),
    });
    const data = await res.json();
    if (res.ok) alert("Book claim recorded! Enjoy your read.");
    else alert("Something went wrong: " + data.error);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Fair Trade Safari Guides</h1>
      <p className="mb-4 text-lg text-gray-700">
        Our expertly curated travel guides are available to preview. Sign up to
        claim one for free.
      </p>

      <SignedOut>
        <p className="text-red-600 font-medium mb-6">
          Sign up or log in to claim your free book.
        </p>
      </SignedOut>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="border rounded-lg p-4 shadow bg-white"
            >
              <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
              <a
                href={book.previewUrl}
                target="_blank"
                className="text-blue-600 underline mb-3 inline-block"
                rel="noopener noreferrer"
              >
                Preview on Issuu
              </a>
              <SignedIn>
                <button
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => handleClaim(book)}
                >
                  Claim This Guide
                </button>
              </SignedIn>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
