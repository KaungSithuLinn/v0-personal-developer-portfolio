import type { Language } from "@/config/language.config";

// Common fragments
export const imageFragment = `
  asset->{
    _id,
    url,
    metadata {
      dimensions {
        width,
        height,
        aspectRatio
      },
      lqip
    }
  },
  alt,
  caption,
  width,
  hotspot,
  crop
`;

export const authorFragment = `
  _id,
  name,
  slug,
  image {
    ${imageFragment}
  },
  role,
  company
`;

export const categoryFragment = `
  _id,
  title,
  slug,
  color,
  baseKey
`;

export const postListFragment = `
  _id,
  title,
  excerpt,
  slug,
  publishedAt,
  language,
  readingTime,
  mainImage {
    ${imageFragment}
  },
  categories[]-> {
    ${categoryFragment}
  },
  tags,
  author-> {
    ${authorFragment}
  }
`;

export const postDetailFragment = `
  _id,
  _createdAt,
  _updatedAt,
  title,
  excerpt,
  slug,
  body,
  metaTitle,
  metaDescription,
  mainImage {
    ${imageFragment}
  },
  categories[]-> {
    ${categoryFragment},
    description,
    metaTitle,
    metaDescription
  },
  tags,
  publishedAt,
  status,
  language,
  baseSlug,
  readingTime,
  author-> {
    _id,
    name,
    slug,
    image {
      ${imageFragment}
    },
    bio,
    email,
    website,
    social,
    role,
    company,
    expertise
  }
`;

// Query functions
export const getPostsQuery = (
  language?: Language,
  filters?: {
    category?: string;
    tag?: string;
    author?: string;
    limit?: number;
    offset?: number;
  }
) => {
  const { category, tag, author, limit = 10, offset = 0 } = filters || {};

  let filter = `_type == "post" && status == "published"`;

  if (language) {
    filter += ` && language == "${language}"`;
  }

  if (category) {
    filter += ` && "${category}" in categories[]->slug.current`;
  }

  if (tag) {
    filter += ` && "${tag}" in tags`;
  }

  if (author) {
    filter += ` && author->slug.current == "${author}"`;
  }

  return `
    *[${filter}] | order(publishedAt desc) [${offset}...${offset + limit}] {
      ${postListFragment}
    }
  `;
};

export const getPostBySlugQuery = (slug: string, language?: Language) => {
  let filter = `_type == "post" && slug.current == "${slug}"`;

  if (language) {
    filter += ` && language == "${language}"`;
  }

  return `
    *[${filter}][0] {
      ${postDetailFragment}
    }
  `;
};

export const getPostCountQuery = (
  language?: Language,
  filters?: {
    category?: string;
    tag?: string;
    author?: string;
  }
) => {
  const { category, tag, author } = filters || {};

  let filter = `_type == "post" && status == "published"`;

  if (language) {
    filter += ` && language == "${language}"`;
  }

  if (category) {
    filter += ` && "${category}" in categories[]->slug.current`;
  }

  if (tag) {
    filter += ` && "${tag}" in tags`;
  }

  if (author) {
    filter += ` && author->slug.current == "${author}"`;
  }

  return `count(*[${filter}])`;
};

export const getCategoriesQuery = (language?: Language) => {
  let filter = `_type == "category"`;

  if (language) {
    filter += ` && language == "${language}"`;
  }

  return `
    *[${filter}] | order(title asc) {
      ${categoryFragment},
      description,
      "postCount": count(*[_type == "post" && status == "published" && references(^._id)])
    }
  `;
};

export const getAuthorsQuery = () => `
  *[_type == "author"] | order(name asc) {
    ${authorFragment},
    bio,
    expertise,
    "postCount": count(*[_type == "post" && status == "published" && references(^._id)])
  }
`;

export const getFeaturedPostsQuery = (language?: Language, limit = 3) => {
  let filter = `_type == "post" && status == "published"`;

  if (language) {
    filter += ` && language == "${language}"`;
  }

  return `
    *[${filter}] | order(publishedAt desc) [0...${limit}] {
      ${postListFragment}
    }
  `;
};

export const getRelatedPostsQuery = (
  currentPostId: string,
  categories: string[],
  language?: Language,
  limit = 3
) => {
  const categoryFilter = categories
    .map((cat) => `"${cat}" in categories[]->slug.current`)
    .join(" || ");
  let filter = `_type == "post" && status == "published" && _id != "${currentPostId}"`;

  if (language) {
    filter += ` && language == "${language}"`;
  }

  if (categories.length > 0) {
    filter += ` && (${categoryFilter})`;
  }

  return `
    *[${filter}] | order(publishedAt desc) [0...${limit}] {
      ${postListFragment}
    }
  `;
};

export const getAllTagsQuery = (language?: Language) => {
  let filter = `_type == "post" && status == "published"`;

  if (language) {
    filter += ` && language == "${language}"`;
  }

  return `
    array::unique(*[${filter}].tags[])
  `;
};

export const getPostsByTagQuery = (
  tag: string,
  language?: Language,
  limit = 10,
  offset = 0
) => {
  let filter = `_type == "post" && status == "published" && "${tag}" in tags`;

  if (language) {
    filter += ` && language == "${language}"`;
  }

  return `
    *[${filter}] | order(publishedAt desc) [${offset}...${offset + limit}] {
      ${postListFragment}
    }
  `;
};

export const getPostsByCategoryQuery = (
  categorySlug: string,
  language?: Language,
  limit = 10,
  offset = 0
) => {
  let filter = `_type == "post" && status == "published" && "${categorySlug}" in categories[]->slug.current`;

  if (language) {
    filter += ` && language == "${language}"`;
  }

  return `
    *[${filter}] | order(publishedAt desc) [${offset}...${offset + limit}] {
      ${postListFragment}
    }
  `;
};

export const getPostsByAuthorQuery = (
  authorSlug: string,
  language?: Language,
  limit = 10,
  offset = 0
) => {
  let filter = `_type == "post" && status == "published" && author->slug.current == "${authorSlug}"`;

  if (language) {
    filter += ` && language == "${language}"`;
  }

  return `
    *[${filter}] | order(publishedAt desc) [${offset}...${offset + limit}] {
      ${postListFragment}
    }
  `;
};

export const searchPostsQuery = (
  searchTerm: string,
  language?: Language,
  limit = 10,
  offset = 0
) => {
  let filter = `_type == "post" && status == "published" && (title match "*${searchTerm}*" || excerpt match "*${searchTerm}*" || tags match "*${searchTerm}*")`;

  if (language) {
    filter += ` && language == "${language}"`;
  }

  return `
    *[${filter}] | order(publishedAt desc) [${offset}...${offset + limit}] {
      ${postListFragment}
    }
  `;
};

// Preview queries (for draft content)
export const getPreviewPostBySlugQuery = (
  slug: string,
  language?: Language
) => {
  let filter = `_type == "post" && slug.current == "${slug}"`;

  if (language) {
    filter += ` && language == "${language}"`;
  }

  return `
    *[${filter}][0] {
      ${postDetailFragment}
    }
  `;
};

// Sitemap and SEO queries
export const getAllPostSlugsQuery = () => `
  *[_type == "post" && status == "published"] {
    "slug": slug.current,
    language,
    publishedAt,
    _updatedAt
  }
`;

export const getCategorySlugsQuery = () => `
  *[_type == "category"] {
    "slug": slug.current,
    language
  }
`;

export const getCategoryBySlugQuery = (slug: string, language?: Language) => {
  let filter = `_type == "category" && slug.current == "${slug}"`;

  if (language) {
    filter += ` && language == "${language}"`;
  }

  return `
    *[${filter}][0] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      language,
      baseKey,
      title,
      slug,
      description,
      color,
      metaTitle,
      metaDescription
    }
  `;
};

export const getAuthorSlugsQuery = () => `
  *[_type == "author"] {
    "slug": slug.current
  }
`;
