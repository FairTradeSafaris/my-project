"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import useSWR from "swr";
import Image from "next/image";

type Book = {
  _id: string;
  title: string;
  previewUrl: string;
  description?: string;
  previewImage?: {
    asset: {
      url: string;
    };
  };
  buyLink?: string;
};

type Claim = {
  bookTitle: string;
  bookUrl: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BookPageContent() {
  const { user } = useUser();
  const userId = user?.id ?? null;

  const { data: bookData, isLoading: booksLoading } = useSWR(
    "/api/books",
    fetcher
  );
  const { data: claimData } = useSWR(
    userId ? `/api/claim-status?userId=${userId}` : null,
    fetcher
  );

  const books: Book[] = bookData?.books || [];
  const claimed: Claim | null = claimData?.claim || null;

  const handleClaim = async (book: Book) => {
    const res = await fetch("/api/claim-book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book, userId }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Book claim recorded! Refresh to see update.");
    } else {
      alert("Something went wrong: " + data.error);
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section
        className="relative h-[400px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/sunset-safari.webp')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-xl drop-shadow">
            Welcome to your personal travel portal.
          </h1>
          <p className="text-lg max-w-lg drop-shadow">
            View your upcoming trips and manage your safari documents below.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Fair Trade Safari Guides</h2>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        <p className="mb-4 text-lg text-gray-700">
          Our expertly curated travel guides are available to preview. Sign up
          to claim one for free.
        </p>

        <SignedOut>
          <p className="text-red-600 font-medium mb-6">
            Sign up or log in to claim your free book.
          </p>
        </SignedOut>

        {booksLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="border rounded-lg p-4 shadow bg-white space-y-3 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 rounded" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <p className="text-red-600">No books found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {books.map((book) => {
              const isClaimed = claimed?.bookTitle === book.title;

              return (
                <div
                  key={book._id}
                  className="border rounded-lg p-4 shadow bg-white space-y-3"
                >
                  {book.previewImage?.asset?.url ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={book.previewImage.asset.url}
                        alt={book.title}
                        fill
                        className="object-cover rounded"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}

                  <h3 className="text-xl font-semibold">{book.title}</h3>

                  <SignedIn>
                    {claimed ? (
                      isClaimed ? (
                        <p className="text-green-700 text-sm font-medium">
                          ✅ You downloaded this book
                        </p>
                      ) : (
                        <p className="text-gray-500 text-sm italic">
                          You’ve already claimed a free guide.
                        </p>
                      )
                    ) : (
                      <button
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => handleClaim(book)}
                      >
                        Claim This Guide
                      </button>
                    )}

                    {claimed && book.buyLink && (
                      <a
                        href={book.buyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Buy on Amazon
                      </a>
                    )}
                  </SignedIn>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
