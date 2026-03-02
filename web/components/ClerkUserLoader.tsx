"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

type Props = {
  onUserId: (id: string | null) => void;
};

export default function ClerkUserLoader({ onUserId }: Props) {
  const { user } = useUser();

  useEffect(() => {
    onUserId(user?.id ?? null);
  }, [user, onUserId]);

  return null;
}
