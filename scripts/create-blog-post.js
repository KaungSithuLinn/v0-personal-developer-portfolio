#!/usr/bin/env node

/**
 * Script to create a blog post programmatically using Sanity API
 * This demonstrates the full capabilities of AI-driven content creation
 */

import { createClient } from "next-sanity";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables manually
const envPath = join(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf8");
const envLines = envContent
  .split("\n")
  .filter((line) => line.trim() && !line.startsWith("#"));
envLines.forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length) {
    process.env[key.trim()] = valueParts.join("=").replace(/^"(.*)"$/, "$1");
  }
});

// Initialize Sanity client with write permissions
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-09-20",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false, // Important for write operations
});

// Helper function to convert markdown to Sanity block content
function markdownToBlocks(markdown) {
  const lines = markdown.split("\n");
  const blocks = [];
  let currentBlock = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine === "") {
      // End current block if it exists
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    // Handle headers
    if (trimmedLine.startsWith("### ")) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = {
        _type: "block",
        _key: `block_${Date.now()}_${Math.random()}`,
        style: "h3",
        children: [
          {
            _type: "span",
            _key: `span_${Date.now()}_${Math.random()}`,
            text: trimmedLine.substring(4),
            marks: [],
          },
        ],
        markDefs: [],
      };
    } else if (trimmedLine.startsWith("## ")) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = {
        _type: "block",
        _key: `block_${Date.now()}_${Math.random()}`,
        style: "h2",
        children: [
          {
            _type: "span",
            _key: `span_${Date.now()}_${Math.random()}`,
            text: trimmedLine.substring(3),
            marks: [],
          },
        ],
        markDefs: [],
      };
    } else if (trimmedLine.startsWith("# ")) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = {
        _type: "block",
        _key: `block_${Date.now()}_${Math.random()}`,
        style: "h1",
        children: [
          {
            _type: "span",
            _key: `span_${Date.now()}_${Math.random()}`,
            text: trimmedLine.substring(2),
            marks: [],
          },
        ],
        markDefs: [],
      };
    } else if (trimmedLine.startsWith("* ")) {
      // List item - for now convert to normal paragraph
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = {
        _type: "block",
        _key: `block_${Date.now()}_${Math.random()}`,
        style: "normal",
        children: [
          {
            _type: "span",
            _key: `span_${Date.now()}_${Math.random()}`,
            text: `• ${trimmedLine.substring(2)}`,
            marks: [],
          },
        ],
        markDefs: [],
      };
    } else {
      // Regular paragraph
      if (currentBlock && currentBlock.style === "normal") {
        // Append to existing paragraph
        currentBlock.children[0].text += ` ${trimmedLine}`;
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = {
          _type: "block",
          _key: `block_${Date.now()}_${Math.random()}`,
          style: "normal",
          children: [
            {
              _type: "span",
              _key: `span_${Date.now()}_${Math.random()}`,
              text: trimmedLine,
              marks: [],
            },
          ],
          markDefs: [],
        };
      }
    }
  }

  // Don't forget the last block
  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks;
}

async function createBlogPost() {
  try {
    console.log("🚀 Starting blog post creation...");

    // First, check if we need to create an author
    const existingAuthors = await client.fetch('*[_type == "author"]');
    let authorId;

    if (existingAuthors.length === 0) {
      console.log("📝 Creating author document...");
      const authorDoc = await client.create({
        _type: "author",
        name: "Kaung Sithu Linn",
        slug: {
          _type: "slug",
          current: "kaung-sithu-linn",
        },
        role: "Full Stack Developer",
        bio: {
          en: [
            {
              _type: "block",
              _key: `bio_block_${Date.now()}`,
              style: "normal",
              children: [
                {
                  _type: "span",
                  _key: `bio_span_${Date.now()}`,
                  text: "Full Stack Developer passionate about modern web technologies and AI-assisted development.",
                  marks: [],
                },
              ],
              markDefs: [],
            },
          ],
        },
        expertise: [
          "Next.js",
          "React",
          "TypeScript",
          "Node.js",
          "AI Development",
        ],
      });
      authorId = authorDoc._id;
      console.log("✅ Author created successfully!");
    } else {
      authorId = existingAuthors[0]._id;
      console.log("✅ Using existing author");
    }

    // Check if we need to create a category
    const existingCategories = await client.fetch(
      '*[_type == "category" && language == "en" && baseKey == "web-development"]'
    );
    let categoryId;

    if (existingCategories.length === 0) {
      console.log("📝 Creating Web Development category...");
      const categoryDoc = await client.create({
        _type: "category",
        language: "en",
        baseKey: "web-development",
        title: "Web Development",
        slug: {
          _type: "slug",
          current: "web-development",
        },
        description:
          "Posts about modern web development technologies, frameworks, and best practices.",
        color: "blue",
        metaDescription:
          "Web development articles covering Next.js, React, TypeScript, and modern development practices.",
      });
      categoryId = categoryDoc._id;
      console.log("✅ Category created successfully!");
    } else {
      categoryId = existingCategories[0]._id;
      console.log("✅ Using existing Web Development category");
    }

    // Convert the markdown content to Sanity blocks
    const markdownContent = `### The Challenge: A Modern, Multilingual Portfolio Blog

Every developer portfolio needs a space to share thoughts and showcase expertise. For this project, the goal was to build a full-featured, production-ready blog integrated directly into my existing multilingual Next.js portfolio. The key requirements were:

* **Seamless Integration**: Must fit perfectly with the existing 5-language i18n architecture.
* **Rich Content**: Support for technical posts with code blocks, images, and custom components.
* **Headless CMS**: A flexible and powerful content backend.
* **Rapid Development**: Leverage modern tools to build quickly and efficiently.

### The Stack: Next.js 15, Sanity.io, and AI Collaboration

The foundation of this project is a modern tech stack:

* **Frontend**: Next.js 15 with React 19, utilizing the App Router for a robust structure.
* **Backend (Content)**: Sanity.io was chosen as the headless CMS for its incredible flexibility, real-time Studio, and powerful multilingual content management features.
* **Styling**: Tailwind CSS for a utility-first approach.

What made this build unique was the development process itself. I worked collaboratively with an AI development agent. The agent assisted in everything from scaffolding the initial Sanity.io schemas to writing the frontend components and fixing complex TypeScript errors.

### The Outcome: A Production-Ready System

The result is a fully functional blog system with a sophisticated, language-aware content backend and a pixel-perfect frontend. The AI agent handled the heavy lifting of schema design, API integration, and component creation, allowing me to focus on the overall architecture and user experience.

This post is the very first entry created via that system, serving as a testament to a powerful new way of building software.`;

    const bodyBlocks = markdownToBlocks(markdownContent);

    // Create the blog post
    console.log("📝 Creating blog post...");
    const postDoc = {
      _type: "post",
      language: "en",
      title:
        "Building a Multilingual Blog with Next.js, Sanity.io, and an AI Agent",
      excerpt:
        "A meta-reflection on building this very blog system using modern web technologies and AI-assisted development.",
      baseSlug: {
        _type: "slug",
        current: "building-multilingual-blog-ai-agent",
      },
      slug: {
        _type: "slug",
        current: "building-multilingual-blog-ai-agent",
      },
      body: bodyBlocks,
      metaTitle: "Building a Multilingual Blog with AI: Next.js + Sanity.io",
      metaDescription:
        "Learn how I built a production-ready, multilingual blog system using Next.js 15, Sanity.io, and AI assistance in this meta-reflection on modern development.",
      categories: [
        {
          _type: "reference",
          _ref: categoryId,
        },
      ],
      tags: [
        "Next.js",
        "Sanity.io",
        "AI Development",
        "TypeScript",
        "Multilingual",
        "Blog System",
      ],
      publishedAt: new Date().toISOString(),
      status: "draft",
      author: {
        _type: "reference",
        _ref: authorId,
      },
      readingTime: 5,
    };

    const result = await client.create(postDoc);

    console.log("🎉 Blog post created successfully!");
    console.log(`📄 Post ID: ${result._id}`);
    console.log(
      `🔗 View in Studio: http://localhost:3001/studio/structure/post;${result._id}`
    );
    console.log("\n✨ Your first AI-generated blog post is ready!");
    console.log("   Navigate to the Studio to review and publish it.");

    return result;
  } catch (error) {
    console.error("❌ Error creating blog post:", error);
    throw error;
  }
}

// Run the script
createBlogPost()
  .then(() => {
    console.log("\n🎯 Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Script failed:", error);
    process.exit(1);
  });
