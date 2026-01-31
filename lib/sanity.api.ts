import { cache } from "react";
import { client } from "./sanity.client";
import {
  getPostsQuery,
  getPostBySlugQuery,
  getPostCountQuery,
  getCategoriesQuery,
  getAuthorsQuery,
  getFeaturedPostsQuery,
  getRelatedPostsQuery,
  getAllTagsQuery,
  getPostsByTagQuery,
  getPostsByCategoryQuery,
  getPostsByAuthorQuery,
  searchPostsQuery,
  getAllPostSlugsQuery,
  getCategorySlugsQuery,
  getCategoryBySlugQuery,
  getAuthorSlugsQuery,
} from "./sanity.queries";
import type {
  Post,
  PostListItem,
  Category,
  CategoryWithCounts,
  Author,
  BlogFilters,
  PaginationParams,
  PaginatedResult,
  Language,
} from "./sanity.types";

// Cache duration for different types of data
const CACHE_TAGS = {
  posts: "posts",
  categories: "categories",
  authors: "authors",
  tags: "tags",
} as const;

// Posts
export const getPosts = cache(
  async (
    language?: Language,
    filters?: BlogFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<PostListItem>> => {
    const { page = 1, limit = 10 } = pagination || {};
    const offset = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      client.fetch<PostListItem[]>(
        getPostsQuery(language, { ...filters, limit, offset }),
        {},
        { next: { revalidate: 3600, tags: [CACHE_TAGS.posts] } },
      ),
      client.fetch<number>(
        getPostCountQuery(language, filters),
        {},
        { next: { revalidate: 3600, tags: [CACHE_TAGS.posts] } },
      ),
    ]);

    return {
      items: posts,
      total,
      page,
      limit,
      hasNext: offset + limit < total,
      hasPrev: page > 1,
    };
  },
);

export const getPostBySlug = cache(
  async (slug: string, language?: Language): Promise<Post | null> => {
    const post = await client.fetch<Post | null>(
      getPostBySlugQuery(slug, language),
      {},
      { next: { revalidate: 3600, tags: [CACHE_TAGS.posts] } },
    );

    return post;
  },
);

export const getFeaturedPosts = cache(
  async (language?: Language, limit = 3): Promise<PostListItem[]> => {
    const posts = await client.fetch<PostListItem[]>(
      getFeaturedPostsQuery(language, limit),
      {},
      { next: { revalidate: 3600, tags: [CACHE_TAGS.posts] } },
    );

    return posts;
  },
);

export const getRelatedPosts = cache(
  async (
    currentPostId: string,
    categories: string[],
    language?: Language,
    limit = 3,
  ): Promise<PostListItem[]> => {
    const posts = await client.fetch<PostListItem[]>(
      getRelatedPostsQuery(currentPostId, categories, language, limit),
      {},
      { next: { revalidate: 3600, tags: [CACHE_TAGS.posts] } },
    );

    return posts;
  },
);

// Categories
export const getCategories = cache(
  async (language?: Language): Promise<CategoryWithCounts[]> => {
    const categories = await client.fetch<CategoryWithCounts[]>(
      getCategoriesQuery(language),
      {},
      { next: { revalidate: 3600, tags: [CACHE_TAGS.categories] } },
    );

    return categories;
  },
);

export const getCategoryBySlug = cache(
  async (slug: string, language?: Language): Promise<Category | null> => {
    const category = await client.fetch<Category | null>(
      getCategoryBySlugQuery(slug, language),
      {},
      { next: { revalidate: 3600, tags: [CACHE_TAGS.categories] } },
    );

    return category;
  },
);

export const getPostsByCategory = cache(
  async (
    categorySlug: string,
    language?: Language,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<PostListItem>> => {
    const { page = 1, limit = 10 } = pagination || {};
    const offset = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      client.fetch<PostListItem[]>(
        getPostsByCategoryQuery(categorySlug, language, limit, offset),
        {},
        {
          next: {
            revalidate: 3600,
            tags: [CACHE_TAGS.posts, CACHE_TAGS.categories],
          },
        },
      ),
      client.fetch<number>(
        getPostCountQuery(language, { category: categorySlug }),
        {},
        {
          next: {
            revalidate: 3600,
            tags: [CACHE_TAGS.posts, CACHE_TAGS.categories],
          },
        },
      ),
    ]);

    return {
      items: posts,
      total,
      page,
      limit,
      hasNext: offset + limit < total,
      hasPrev: page > 1,
    };
  },
);

// Authors
export const getAuthors = cache(async (): Promise<Author[]> => {
  const authors = await client.fetch<Author[]>(
    getAuthorsQuery(),
    {},
    { next: { revalidate: 3600, tags: [CACHE_TAGS.authors] } },
  );

  return authors;
});

export const getPostsByAuthor = cache(
  async (
    authorSlug: string,
    language?: Language,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<PostListItem>> => {
    const { page = 1, limit = 10 } = pagination || {};
    const offset = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      client.fetch<PostListItem[]>(
        getPostsByAuthorQuery(authorSlug, language, limit, offset),
        {},
        {
          next: {
            revalidate: 3600,
            tags: [CACHE_TAGS.posts, CACHE_TAGS.authors],
          },
        },
      ),
      client.fetch<number>(
        getPostCountQuery(language, { author: authorSlug }),
        {},
        {
          next: {
            revalidate: 3600,
            tags: [CACHE_TAGS.posts, CACHE_TAGS.authors],
          },
        },
      ),
    ]);

    return {
      items: posts,
      total,
      page,
      limit,
      hasNext: offset + limit < total,
      hasPrev: page > 1,
    };
  },
);

// Tags
export const getAllTags = cache(
  async (language?: Language): Promise<string[]> => {
    const tags = await client.fetch<string[]>(
      getAllTagsQuery(language),
      {},
      { next: { revalidate: 3600, tags: [CACHE_TAGS.tags] } },
    );

    return tags || [];
  },
);

export const getPostsByTag = cache(
  async (
    tag: string,
    language?: Language,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<PostListItem>> => {
    const { page = 1, limit = 10 } = pagination || {};
    const offset = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      client.fetch<PostListItem[]>(
        getPostsByTagQuery(tag, language, limit, offset),
        {},
        {
          next: { revalidate: 3600, tags: [CACHE_TAGS.posts, CACHE_TAGS.tags] },
        },
      ),
      client.fetch<number>(
        getPostCountQuery(language, { tag }),
        {},
        {
          next: { revalidate: 3600, tags: [CACHE_TAGS.posts, CACHE_TAGS.tags] },
        },
      ),
    ]);

    return {
      items: posts,
      total,
      page,
      limit,
      hasNext: offset + limit < total,
      hasPrev: page > 1,
    };
  },
);

// Search
export const searchPosts = cache(
  async (
    searchTerm: string,
    language?: Language,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<PostListItem>> => {
    const { page = 1, limit = 10 } = pagination || {};
    const offset = (page - 1) * limit;

    // For search, we get posts and count separately since we can't easily count search results
    const posts = await client.fetch<PostListItem[]>(
      searchPostsQuery(searchTerm, language, limit + 1, offset), // Get one extra to check if there are more
      {},
      { next: { revalidate: 300 } }, // Shorter cache for search results
    );

    const hasNext = posts.length > limit;
    const items = hasNext ? posts.slice(0, -1) : posts;

    return {
      items,
      total: items.length, // We don't have the total count for search
      page,
      limit,
      hasNext,
      hasPrev: page > 1,
    };
  },
);

// Sitemap and SEO
export const getAllPostSlugs = cache(
  async (): Promise<
    Array<{
      slug: string;
      language: Language;
      publishedAt: string;
      updatedAt: string;
    }>
  > => {
    const slugs = await client.fetch<
      Array<{
        slug: string;
        language: Language;
        publishedAt: string;
        _updatedAt: string;
      }>
    >(
      getAllPostSlugsQuery(),
      {},
      { next: { revalidate: 3600, tags: [CACHE_TAGS.posts] } },
    );

    return slugs.map(({ _updatedAt, ...rest }) => ({
      ...rest,
      updatedAt: _updatedAt,
    }));
  },
);

export const getCategorySlugs = cache(
  async (): Promise<
    Array<{
      slug: string;
      language: Language;
    }>
  > => {
    const slugs = await client.fetch<
      Array<{
        slug: string;
        language: Language;
      }>
    >(
      getCategorySlugsQuery(),
      {},
      { next: { revalidate: 3600, tags: [CACHE_TAGS.categories] } },
    );

    return slugs;
  },
);

export const getAuthorSlugs = cache(
  async (): Promise<
    Array<{
      slug: string;
    }>
  > => {
    const slugs = await client.fetch<
      Array<{
        slug: string;
      }>
    >(
      getAuthorSlugsQuery(),
      {},
      { next: { revalidate: 3600, tags: [CACHE_TAGS.authors] } },
    );

    return slugs;
  },
);

// Utility functions
export const revalidateBlogData = async () => {
  const { revalidateTag } = await import("next/cache");

  // Revalidate all blog-related cache tags
  Object.values(CACHE_TAGS).forEach((tag) => {
    // New signature requires a second argument (profile or config); pass 'default' to keep behaviour stable
    revalidateTag(tag, "default");
  });
};

// Export cache tags for use in webhooks
export { CACHE_TAGS };
