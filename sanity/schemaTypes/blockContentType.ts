import { defineType, defineArrayMember, defineField } from "sanity";
import { ImageIcon, CodeIcon, LinkIcon } from "@sanity/icons";

/**
 * Enhanced block content schema for technical blog posts
 * Supports code blocks, images, callouts, and rich formatting
 */

export const blockContentType = defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    // Standard text blocks
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "H5", value: "h5" },
        { title: "H6", value: "h6" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet List", value: "bullet" },
        { title: "Numbered List", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code (Inline)", value: "code" },
          { title: "Underline", value: "underline" },
          { title: "Strike", value: "strike-through" },
        ],
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            icon: LinkIcon,
            fields: [
              defineField({
                title: "URL",
                name: "href",
                type: "url",
                validation: (rule) => rule.required(),
              }),
              defineField({
                title: "Open in new tab",
                name: "blank",
                type: "boolean",
                initialValue: true,
              }),
            ],
          },
        ],
      },
    }),

    // Code blocks for technical content
    defineArrayMember({
      type: "object",
      name: "codeBlock",
      title: "Code Block",
      icon: CodeIcon,
      fields: [
        defineField({
          name: "language",
          title: "Language",
          type: "string",
          options: {
            list: [
              { title: "JavaScript", value: "javascript" },
              { title: "TypeScript", value: "typescript" },
              { title: "React JSX", value: "jsx" },
              { title: "React TSX", value: "tsx" },
              { title: "HTML", value: "html" },
              { title: "CSS", value: "css" },
              { title: "SCSS", value: "scss" },
              { title: "Python", value: "python" },
              { title: "Java", value: "java" },
              { title: "C#", value: "csharp" },
              { title: "PHP", value: "php" },
              { title: "Go", value: "go" },
              { title: "Rust", value: "rust" },
              { title: "SQL", value: "sql" },
              { title: "JSON", value: "json" },
              { title: "YAML", value: "yaml" },
              { title: "Markdown", value: "markdown" },
              { title: "Bash", value: "bash" },
              { title: "PowerShell", value: "powershell" },
              { title: "Docker", value: "dockerfile" },
              { title: "Plain Text", value: "text" },
            ],
            layout: "dropdown",
          },
          initialValue: "javascript",
        }),
        defineField({
          name: "code",
          title: "Code",
          type: "text",
          rows: 10,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "filename",
          title: "Filename",
          type: "string",
          description: "Optional filename to display",
        }),
        defineField({
          name: "highlightLines",
          title: "Highlight Lines",
          type: "string",
          description:
            'Comma-separated line numbers to highlight (e.g., "2,5-7,10")',
        }),
      ],
      preview: {
        select: {
          language: "language",
          code: "code",
          filename: "filename",
        },
        prepare(selection) {
          const { language, code, filename } = selection;
          const codePreview = code
            ? code.substring(0, 100) + (code.length > 100 ? "..." : "")
            : "Empty code block";
          return {
            title: filename || `${language} code`,
            subtitle: codePreview,
            media: CodeIcon,
          };
        },
      },
    }),

    // Images with enhanced metadata
    defineArrayMember({
      type: "image",
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Important for accessibility and SEO",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "caption",
          type: "string",
          title: "Caption",
          description: "Optional caption displayed below the image",
        }),
        defineField({
          name: "width",
          type: "string",
          title: "Width",
          options: {
            list: [
              { title: "Small (300px)", value: "small" },
              { title: "Medium (600px)", value: "medium" },
              { title: "Large (900px)", value: "large" },
              { title: "Full Width", value: "full" },
            ],
          },
          initialValue: "large",
        }),
      ],
    }),

    // Callout boxes for important information
    defineArrayMember({
      type: "object",
      name: "callout",
      title: "Callout",
      fields: [
        defineField({
          name: "type",
          title: "Type",
          type: "string",
          options: {
            list: [
              { title: "💡 Tip", value: "tip" },
              { title: "⚠️ Warning", value: "warning" },
              { title: "❌ Error", value: "error" },
              { title: "ℹ️ Info", value: "info" },
              { title: "✅ Success", value: "success" },
            ],
            layout: "radio",
          },
          initialValue: "info",
        }),
        defineField({
          name: "title",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "content",
          title: "Content",
          type: "array",
          of: [
            defineArrayMember({
              type: "block",
              styles: [{ title: "Normal", value: "normal" }],
              marks: {
                decorators: [
                  { title: "Strong", value: "strong" },
                  { title: "Emphasis", value: "em" },
                  { title: "Code", value: "code" },
                ],
              },
            }),
          ],
        }),
      ],
      preview: {
        select: {
          type: "type",
          title: "title",
        },
        prepare(selection) {
          const { type, title } = selection;
          const typeLabels = {
            tip: "💡 Tip",
            warning: "⚠️ Warning",
            error: "❌ Error",
            info: "ℹ️ Info",
            success: "✅ Success",
          };
          return {
            title: title || "Callout",
            subtitle: typeLabels[type as keyof typeof typeLabels] || type,
          };
        },
      },
    }),

    // YouTube/Video embeds
    defineArrayMember({
      type: "object",
      name: "videoEmbed",
      title: "Video Embed",
      fields: [
        defineField({
          name: "url",
          title: "Video URL",
          type: "url",
          description: "YouTube, Vimeo, or other video platform URL",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "title",
          title: "Video Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "aspectRatio",
          title: "Aspect Ratio",
          type: "string",
          options: {
            list: [
              { title: "16:9 (Widescreen)", value: "16:9" },
              { title: "4:3 (Standard)", value: "4:3" },
              { title: "1:1 (Square)", value: "1:1" },
            ],
          },
          initialValue: "16:9",
        }),
      ],
      preview: {
        select: {
          title: "title",
          url: "url",
        },
        prepare(selection) {
          const { title, url } = selection;
          return {
            title: title || "Video",
            subtitle: url,
          };
        },
      },
    }),
  ],
});
