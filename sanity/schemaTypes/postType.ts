import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

// Language configuration matching your portfolio
const SUPPORTED_LANGUAGES = ["en", "zh", "ms", "ta", "ar"] as const;
const LANGUAGE_NAMES = {
  en: "English",
  zh: "中文",
  ms: "Bahasa Melayu",
  ta: "தமிழ்",
  ar: "العربية",
};

export const postType = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    // Language for this version of the post
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: SUPPORTED_LANGUAGES.map((lang) => ({
          title: LANGUAGE_NAMES[lang],
          value: lang,
        })),
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),

    // Base slug (shared across translations)
    defineField({
      name: "baseSlug",
      title: "Base Slug",
      type: "slug",
      description: "Shared identifier across all language versions",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    // Language-specific fields
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      description: "Brief description of the post",
      rows: 3,
      validation: (rule) => rule.max(300),
    }),

    defineField({
      name: "slug",
      title: "Language-Specific Slug",
      type: "slug",
      description: "URL-friendly version for this language",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    // Content
    defineField({
      name: "body",
      title: "Content",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),

    // SEO fields
    defineField({
      name: "metaTitle",
      title: "SEO Title",
      type: "string",
      description:
        "Title for search engines (optional, defaults to post title)",
      validation: (rule) => rule.max(60),
    }),

    defineField({
      name: "metaDescription",
      title: "SEO Description",
      type: "text",
      description: "Description for search engines",
      rows: 2,
      validation: (rule) => rule.max(160),
    }),

    // Media
    defineField({
      name: "mainImage",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    // Categorization
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: { type: "category" } })],
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),

    // Publishing
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
    }),

    // Author reference
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
      validation: (rule) => rule.required(),
    }),

    // Reading time (auto-calculated)
    defineField({
      name: "readingTime",
      title: "Reading Time (minutes)",
      type: "number",
      description: "Estimated reading time in minutes",
      validation: (rule) => rule.min(1).max(60),
    }),
  ],

  preview: {
    select: {
      title: "title",
      language: "language",
      author: "author.name",
      media: "mainImage",
      status: "status",
    },
    prepare(selection) {
      const { title, language, author, status } = selection;
      const languageLabel =
        LANGUAGE_NAMES[language as keyof typeof LANGUAGE_NAMES] || language;
      return {
        ...selection,
        title: `${title} (${languageLabel})`,
        subtitle: `${status} • ${author ? `by ${author}` : "No author"}`,
      };
    },
  },

  orderings: [
    {
      title: "Published Date, Newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Published Date, Oldest",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
