import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "@sanity/types";

import { apiVersion, dataset, projectId } from "../sanity/env";

// Create the client for fetching data
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production", // Use CDN for production, live data for development
  perspective: "published", // Only fetch published documents
});

// Create a client for previewing drafts (useful for preview mode)
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "previewDrafts", // Fetch draft documents
  token: process.env.SANITY_API_READ_TOKEN, // Required for draft access
});

// Helper to get the right client based on preview mode
export const getClient = (usePreview = false) =>
  usePreview ? previewClient : client;

// Image URL builder
const builder = imageUrlBuilder({ projectId, dataset });

// Helper function to generate Sanity image URLs
export const urlFor = (source: Image | string) => builder.image(source);

// Helper function to generate responsive image URLs
export const getImageUrl = (
  source: Image | string,
  width?: number,
  height?: number,
  quality = 80
) => {
  let imageBuilder = urlFor(source).quality(quality);

  if (width) imageBuilder = imageBuilder.width(width);
  if (height) imageBuilder = imageBuilder.height(height);

  return imageBuilder.url();
};

// Helper function that returns the URL builder for chaining
export const buildImageUrl = (source: Image | string) => urlFor(source);

// Helper function for responsive image sets
export const getResponsiveImageUrls = (source: Image | string) => ({
  mobile: getImageUrl(source, 768),
  tablet: getImageUrl(source, 1024),
  desktop: getImageUrl(source, 1200),
  original: urlFor(source).url(),
});
