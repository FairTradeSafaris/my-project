"use client";

import { useState } from "react";

type Props = {
  postId: string;
};

export default function CommentForm({ postId }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, postId }),
      });

      if (!res.ok) throw new Error();

      setSubmitted(true);
      setFormData({ name: "", email: "", comment: "" });
    } catch {
      setError(true);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Leave a Comment</h2>

      {submitted ? (
        <p className="text-green-600">
          Thanks for your comment! Awaiting approval.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-lg shadow-md"
        >
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="w-full border px-4 py-2 rounded"
          />
          <textarea
            placeholder="Your Comment"
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            required
            className="w-full border px-4 py-2 rounded h-32"
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Submit Comment
          </button>
          {error && (
            <p className="text-red-600">Something went wrong. Try again.</p>
          )}
        </form>
      )}
    </section>
  );
}
