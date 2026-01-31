import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    // Basic information
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "image",
      title: "Profile Image",
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

    // Bio in multiple languages
    defineField({
      name: "bio",
      title: "Biography",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "array",
          of: [
            defineArrayMember({
              type: "block",
              styles: [{ title: "Normal", value: "normal" }],
              lists: [],
            }),
          ],
        }),
        defineField({
          name: "zh",
          title: "中文",
          type: "array",
          of: [
            defineArrayMember({
              type: "block",
              styles: [{ title: "Normal", value: "normal" }],
              lists: [],
            }),
          ],
        }),
        defineField({
          name: "ms",
          title: "Bahasa Melayu",
          type: "array",
          of: [
            defineArrayMember({
              type: "block",
              styles: [{ title: "Normal", value: "normal" }],
              lists: [],
            }),
          ],
        }),
        defineField({
          name: "ta",
          title: "தமிழ்",
          type: "array",
          of: [
            defineArrayMember({
              type: "block",
              styles: [{ title: "Normal", value: "normal" }],
              lists: [],
            }),
          ],
        }),
        defineField({
          name: "ar",
          title: "العربية",
          type: "array",
          of: [
            defineArrayMember({
              type: "block",
              styles: [{ title: "Normal", value: "normal" }],
              lists: [],
            }),
          ],
        }),
      ],
    }),

    // Contact information
    defineField({
      name: "email",
      title: "Email",
      type: "email",
    }),

    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),

    // Social media
    defineField({
      name: "social",
      title: "Social Media",
      type: "object",
      fields: [
        defineField({
          name: "twitter",
          title: "Twitter/X",
          type: "string",
          description: "Username without @",
        }),
        defineField({
          name: "github",
          title: "GitHub",
          type: "string",
          description: "Username",
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          type: "string",
          description: "Username or profile URL",
        }),
      ],
    }),

    // Professional details
    defineField({
      name: "role",
      title: "Role/Title",
      type: "string",
      description: "e.g., Full Stack Developer, Technical Writer",
    }),

    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),

    defineField({
      name: "expertise",
      title: "Areas of Expertise",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "image",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        ...selection,
        title,
        subtitle: subtitle || "Author",
      };
    },
  },
});
