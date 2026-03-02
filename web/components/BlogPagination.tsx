"use client";
import Link from "next/link";

export default function BlogPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const getPageHref = (page: number) => {
    return page === 1 ? "/blog" : `/blog/page/${page}`;
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={getPageHref(currentPage - 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Prev
        </Link>
      )}

      {pageNumbers.map((page) => (
        <Link
          key={page}
          href={getPageHref(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage
              ? "bg-amber-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={getPageHref(currentPage + 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </Link>
      )}
    </div>
  );
}
