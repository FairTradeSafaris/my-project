"use client";
import { useState } from "react";

export function LikeButton({
  postId,
  initialLikes,
}: {
  postId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/like/${postId}`, {
        method: "POST",
      });
      const data = await res.json();
      setLikes(data.likes);
    } catch (err) {
      console.error("Failed to like post", err);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-2 text-sm mt-4 px-4 py-2 bg-rose-100 hover:bg-rose-200 rounded-full shadow transition"
    >
      <span role="img" aria-label="heart">
        ❤️
      </span>
      {likes} {loading && "..."}
    </button>
  );
}
