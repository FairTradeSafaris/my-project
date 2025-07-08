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
      className="text-sm mt-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded"
    >
      ❤️ {likes} {loading && "..."}
    </button>
  );
}
