export type BlogPostPreview = {
  _id: string;
  title: string;
  slug: string; // ✅ FIXED
  publishedAt: string;
  summary?: string;
  extendedDescription?: string;
  coverImage?: string;
  alt?: string;
  isFeatured?: boolean;
  author?: {
    name: string;
  };
  tags?: {
    title: string;
  }[];
  readTime?: number;
};
