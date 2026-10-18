"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import useSWR, { useSWRConfig } from "swr";
import Image from "@/components/SanityImage";
import { authFetch } from "@/lib/authFetch";
import {
  coreBody,
  coreButton,
  coreButtonOutline,
  coreCard,
  coreH2,
  coreH3,
} from "@/components/core/coreStyles";

type Book = {
  _id: string;
  title: string;
  previewUrl: string;
  description?: string;
  previewImage?: { asset: { url: string } };
  buyLink?: string;
};

type Claim = {
  bookTitle: string;
  bookUrl: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const authFetcher = (url: string) => authFetch(url).then((res) => res.json());

// Turn Google Drive "view" links into direct-download links
function toDriveDownload(url: string) {
  let m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (m) return `https://drive.google.com/uc?export=download&id=${m[1]}`;
  m = url.match(/drive\.google\.com\/.*[?&]id=([^&]+)/i);
  if (m) return `https://drive.google.com/uc?export=download&id=${m[1]}`;
  return url; // non-Drive links just open as-is
}

export default function BookPageContent() {
  const { user } = useUser();
  const userId = user?.id ?? null;
  const { mutate } = useSWRConfig();

  const { data: bookData, isLoading: booksLoading } = useSWR(
    "/api/books",
    fetcher
  );
  const { data: claimData } = useSWR(
    userId ? `/api/claim-status?userId=${userId}` : null,
    authFetcher
  );

  const books: Book[] = bookData?.books || [];
  const claimed: Claim | null = claimData?.claim || null;

  const handleClaim = async (book: Book) => {
    if (!userId) {
      alert("Please sign in to claim your free guide.");
      return;
    }

    try {
      const res = await authFetch("/api/claim-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to record claim");

      // refresh claim status
      mutate(`/api/claim-status?userId=${userId}`);

      // kick off download / navigation
      const downloadUrl = toDriveDownload(book.previewUrl);
      window.location.href = downloadUrl; // or: window.open(downloadUrl, "_blank", "noopener,noreferrer");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      alert(`Something went wrong: ${msg}`);
    }
  };

  return (
    <>
      {/* Batch 23: homepage-style cards and buttons (display only; same
          Clerk components, claim logic and text) */}
      <div className="bg-[#f7f3ec]">
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className={coreH2}>Fair Trade Safari Guides</h2>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        <p className={`mb-4 ${coreBody} md:text-[17px] md:leading-8`}>
          Our expertly curated travel guides are available to preview. Sign up
          to claim one for free.
        </p>

        <SignedOut>
          <p className="mb-6 rounded-xl border border-[#e6d8c8] bg-white px-4 py-3 text-[16px] font-medium text-[#9a4f22]">
            Sign up or log in to claim your free book.
          </p>
        </SignedOut>

        {booksLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`${coreCard} space-y-3 p-5 animate-pulse`}
              >
                <div className="h-48 w-full rounded-xl bg-[#f2e7db]" />
                <div className="h-6 w-3/4 rounded bg-[#f2e7db]" />
                <div className="h-4 w-1/2 rounded bg-[#f2e7db]" />
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <p className="text-[16px] text-[#9a4f22]">No books found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {books.map((book) => {
              const isClaimed = claimed?.bookTitle === book.title;

              return (
                <div
                  key={book._id}
                  className={`${coreCard} space-y-4 p-5 md:p-6`}
                >
                  {book.previewImage?.asset?.url ? (
                    <div className="relative w-full overflow-hidden rounded-xl bg-[#f7f3ec] p-3">
                      <div className="relative w-full">
                        <Image
                          src={book.previewImage.asset.url}
                          alt={book.title}
                          layout="responsive"
                          width={400} // any realistic width/height ratio
                          height={300}
                          className="object-contain rounded"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center rounded-xl bg-[#f7f3ec] text-[15px] text-[#7a6656]">
                      No image
                    </div>
                  )}

                  <h3 className={coreH3}>{book.title}</h3>

                  <SignedIn>
                    {claimed ? (
                      isClaimed ? (
                        <div className="space-y-2">
                          <p className="text-[15px] font-medium text-[#3f6b3a]">
                            ✅ You downloaded this book
                          </p>
                          <button
                            className={coreButtonOutline}
                            onClick={() =>
                              (window.location.href = toDriveDownload(
                                book.previewUrl
                              ))
                            }
                          >
                            Download Again
                          </button>
                        </div>
                      ) : (
                        <p className="text-[15px] italic text-[#5c4a3d]">
                          You’ve already claimed a free guide.
                        </p>
                      )
                    ) : (
                      <button
                        className={`mt-1 ${coreButton}`}
                        onClick={() => handleClaim(book)}
                      >
                        Claim & Download
                      </button>
                    )}

                    {claimed && book.buyLink && (
                      <a
                        href={book.buyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-3 ${coreButtonOutline}`}
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
      </div>
    </>
  );
}
