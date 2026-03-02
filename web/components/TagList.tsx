"use client";
import { useState } from "react";
import Link from "next/link";

type Tag = {
  _id: string;
  title: string;
  slug: string;
};

type TagListProps = {
  tags: Tag[];
  visibleCount?: number;
};

export default function TagList({ tags, visibleCount = 10 }: TagListProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedTags = showAll ? tags : tags.slice(0, visibleCount);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/blog/"
          className="px-4 py-1 rounded-full border text-sm font-medium hover:bg-orange-100"
        >
          All Tags
        </Link>
        {displayedTags.map((tag) => (
          <Link
            key={tag._id}
            href={`/blog/tags/${tag.slug}`}
            prefetch={false}
            className="px-4 py-1 rounded-full border text-sm font-medium hover:bg-orange-100"
          >
            {tag.title}
          </Link>
        ))}
      </div>

      {tags.length > visibleCount && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-blue-600 underline hover:text-blue-800 mt-2"
        >
          {showAll ? "Show Fewer Tags" : "Show All Tags"}
        </button>
      )}
    </div>
  );
}
