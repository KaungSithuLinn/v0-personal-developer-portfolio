import type { Language } from "@/config/language.config";

// Re-export Language type for convenience
export type { Language };

// Base types from Sanity
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

export interface SanityImageAsset {
  _id: string;
  url: string;
  metadata: {
    dimensions: {
      width: number;
      height: number;
      aspectRatio: number;
    };
    lqip?: string;
  };
}

export interface SanityImage {
  _type: "image";
  asset: SanityImageAsset;
  alt?: string;
  caption?: string;
  width?: "small" | "medium" | "large" | "full";
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Block content types
export interface SanityBlock {
  _type: "block";
  _key: string;
  style?: string;
  children: SanitySpan[];
  markDefs?: SanityMarkDef[];
  listItem?: string;
  level?: number;
}

export interface SanitySpan {
  _type: "span";
  _key: string;
  text: string;
  marks?: string[];
}

export interface SanityMarkDef {
  _type: string;
  _key: string;
  [key: string]: any;
}

export interface CodeBlock {
  _type: "codeBlock";
  _key: string;
  language: string;
  code: string;
  filename?: string;
  highlightLines?: string;
}

export interface Callout {
  _type: "callout";
  _key: string;
  type: "tip" | "warning" | "error" | "info" | "success";
  title?: string;
  content: SanityBlock[];
}

export interface VideoEmbed {
  _type: "videoEmbed";
  _key: string;
  url: string;
  title: string;
  aspectRatio: "16:9" | "4:3" | "1:1";
}

export type PortableTextContent = (
  | SanityBlock
  | SanityImage
  | CodeBlock
  | Callout
  | VideoEmbed
)[];

// Author types
export interface MultilangBio {
  en?: SanityBlock[];
  zh?: SanityBlock[];
  ms?: SanityBlock[];
  ta?: SanityBlock[];
  ar?: SanityBlock[];
}

export interface SocialMedia {
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export interface Author extends SanityDocument {
  _type: "author";
  name: string;
  slug: {
    current: string;
  };
  image?: SanityImage;
  bio: MultilangBio;
  email?: string;
  website?: string;
  social?: SocialMedia;
  role?: string;
  company?: string;
  expertise?: string[];
}

// Category types
export interface Category extends SanityDocument {
  _type: "category";
  language: Language;
  baseKey: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  color:
    | "blue"
    | "green"
    | "purple"
    | "orange"
    | "red"
    | "pink"
    | "yellow"
    | "gray";
  metaTitle?: string;
  metaDescription?: string;
}

// Post types
export interface Post extends SanityDocument {
  _type: "post";
  language: Language;
  baseSlug: {
    current: string;
  };
  title: string;
  excerpt?: string;
  slug: {
    current: string;
  };
  body: PortableTextContent;
  metaTitle?: string;
  metaDescription?: string;
  mainImage?: SanityImage;
  categories?: Category[];
  tags?: string[];
  publishedAt: string;
  status: "draft" | "published" | "archived";
  author: Author;
  readingTime?: number;
}

// Query result types
export interface PostListItem {
  _id: string;
  title: string;
  excerpt?: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  mainImage?: SanityImage;
  categories?: Pick<Category, "_id" | "title" | "slug" | "color">[];
  tags?: string[];
  author: Pick<Author, "_id" | "name" | "image">;
  readingTime?: number;
  language: Language;
}

export interface CategoryWithCounts extends Category {
  postCount: number;
}

// Search and filtering types
export interface BlogFilters {
  language?: Language;
  category?: string;
  tag?: string;
  author?: string;
  status?: "draft" | "published" | "archived";
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}
