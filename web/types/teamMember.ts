// /types/teamMember.ts

import type { PortableTextBlock } from "@portabletext/types";

export interface TeamMember {
  _id: string;
  name: string;
  position: string;
  email?: string;
  linkedin?: string;
  image: string;
  bio: PortableTextBlock[];
  featured?: boolean;
}
