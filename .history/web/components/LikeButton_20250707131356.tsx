"use client";
import { useState, useEffect } from "react";

export function LikeButton({
  postId,
  initialLikes,
}: {
  postId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    setHasLiked(likedPosts.includes(postId));
  }, [postId]);

  const handleLike = async () => {
    if (hasLiked) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/like/${postId}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to update like");
      const data = await res.json();
      setLikes(data.likes);
      setHasLiked(true);
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
      localStorage.setItem(
        "likedPosts",
        JSON.stringify([...likedPosts, postId])
      );
    } catch (err) {
      console.error("LIKE ERROR:", err);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading || hasLiked}
      className={`flex items-center gap-2 text-sm mt-4 px-4 py-2 rounded-full shadow transition ${
        hasLiked
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-rose-100 hover:bg-rose-200"
      }`}
    >
      ❤️ {likes} {loading && "..."}
    </button>
  );
}
