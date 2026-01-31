"use client";

import { useEffect } from "react";
import { useTranslation } from "@/context/language-utils";

interface HtmlAttributeManagerProps {
  initialLocale: string;
  initialDirection: string;
}

export default function HtmlAttributeManager({
  initialLocale,
  initialDirection,
}: HtmlAttributeManagerProps) {
  const { language, getDirection } = useTranslation();

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language;

    // Update HTML dir attribute
    const direction = getDirection();
    document.documentElement.dir = direction;

    // Update meta dir attribute if it exists
    const metaDir = document.querySelector('meta[name="dir"]');
    if (metaDir) {
      metaDir.setAttribute("content", direction);
    }
  }, [language, getDirection]);

  // Set initial attributes on mount
  useEffect(() => {
    document.documentElement.lang = initialLocale;
    document.documentElement.dir = initialDirection;
  }, [initialLocale, initialDirection]);

  return null; // This component doesn't render anything
}
