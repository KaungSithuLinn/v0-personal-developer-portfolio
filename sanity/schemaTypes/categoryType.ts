import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Language configuration matching your portfolio
const SUPPORTED_LANGUAGES = ["en", "zh", "ms", "ta", "ar"] as const;
const LANGUAGE_NAMES = {
  en: "English",
  zh: "中文",
  ms: "Bahasa Melayu",
  ta: "தமிழ்",
  ar: "العربية",
};

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    // Language for this version of the category
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

    // Base identifier (shared across translations)
    defineField({
      name: "baseKey",
      title: "Base Key",
      type: "string",
      description:
        'Shared identifier across all language versions (e.g., "technology", "design")',
      validation: (rule) =>
        rule.required().regex(/^[a-z-]+$/, {
          name: "slug format",
          invert: false,
        }),
    }),

    // Language-specific fields
    defineField({
      name: "title",
      title: "Category Name",
      type: "string",
      validation: (rule) => rule.required().max(50),
    }),

    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(300),
    }),

    // Category color for visual organization
    defineField({
      name: "color",
      title: "Category Color",
      type: "string",
      options: {
        list: [
          { title: "Blue", value: "blue" },
          { title: "Green", value: "green" },
          { title: "Purple", value: "purple" },
          { title: "Orange", value: "orange" },
          { title: "Red", value: "red" },
          { title: "Pink", value: "pink" },
          { title: "Yellow", value: "yellow" },
          { title: "Gray", value: "gray" },
        ],
        layout: "radio",
      },
      initialValue: "blue",
    }),

    // SEO fields
    defineField({
      name: "metaTitle",
      title: "SEO Title",
      type: "string",
      description:
        "Title for search engines (optional, defaults to category title)",
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
  ],

  preview: {
    select: {
      title: "title",
      language: "language",
      baseKey: "baseKey",
      color: "color",
    },
    prepare(selection) {
      const { title, language, baseKey, color } = selection;
      const languageLabel =
        LANGUAGE_NAMES[language as keyof typeof LANGUAGE_NAMES] || language;
      return {
        title: `${title} (${languageLabel})`,
        subtitle: `${baseKey} • ${color}`,
        media: TagIcon,
      };
    },
  },

  orderings: [
    {
      title: "Base Key A-Z",
      name: "baseKeyAsc",
      by: [{ field: "baseKey", direction: "asc" }],
    },
    {
      title: "Language",
      name: "languageAsc",
      by: [{ field: "language", direction: "asc" }],
    },
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
