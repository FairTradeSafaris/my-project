"use client";

import dynamic from "next/dynamic";
import { FC } from "react";

// 👇 Define the props expected by CommentForm
type CommentFormProps = {
  postId: string;
};

// 👇 Dynamically import CommentForm with SSR off
const CommentForm = dynamic<CommentFormProps>(() => import("./CommentForm"), {
  ssr: false,
});

// 👇 Component with proper props typing
const CommentFormWrapper: FC<CommentFormProps> = (props) => {
  return <CommentForm {...props} />;
};

export default CommentFormWrapper;
