import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { buildImageUrl } from "@/lib/sanity.client";
import { cn } from "@/lib/utils";
import type {
  PortableTextContent,
  SanityImage,
  CodeBlock,
  Callout,
  VideoEmbed,
} from "@/lib/sanity.types";

interface PortableTextRendererProps {
  content: PortableTextContent;
  className?: string;
}

const calloutIcons = {
  tip: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
  success: CheckCircle,
};

const calloutStyles = {
  tip: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
  warning:
    "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
  error:
    "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
  info: "border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100",
  success:
    "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
};

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage }) => {
      if (!value?.asset) return null;

      const imageUrl = buildImageUrl(value.asset.url)
        .width(800)
        .height(600)
        .fit("max")
        .auto("format")
        .url();

      const { width, height } = value.asset.metadata.dimensions;
      const aspectRatio = height / width;

      return (
        <figure
          className={cn(
            "my-8",
            value.width === "small" && "max-w-sm mx-auto",
            value.width === "medium" && "max-w-md mx-auto",
            value.width === "large" && "max-w-2xl mx-auto",
            value.width === "full" && "w-full"
          )}
        >
          <div className="relative overflow-hidden rounded-lg border border-border">
            <Image
              src={imageUrl}
              alt={value.alt || ""}
              width={800}
              height={Math.round(800 * aspectRatio)}
              className="h-auto w-full object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
              placeholder={value.asset.metadata.lqip ? "blur" : "empty"}
              blurDataURL={value.asset.metadata.lqip}
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    codeBlock: ({ value }: { value: CodeBlock }) => {
      return (
        <div className="my-6">
          {value.filename && (
            <div className="rounded-t-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground border border-b-0">
              {value.filename}
            </div>
          )}
          <SyntaxHighlighter
            language={value.language}
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: value.filename ? "0 0 0.5rem 0.5rem" : "0.5rem",
              border: "1px solid hsl(var(--border))",
              borderTop: value.filename
                ? "none"
                : "1px solid hsl(var(--border))",
            }}
            showLineNumbers
            wrapLines
            lineProps={(lineNumber) => {
              const style: React.CSSProperties = {};
              if (value.highlightLines) {
                const highlights = value.highlightLines
                  .split(",")
                  .map((range) => {
                    if (range.includes("-")) {
                      const [start, end] = range.split("-").map(Number);
                      return { start, end };
                    }
                    return { start: Number(range), end: Number(range) };
                  });

                const isHighlighted = highlights.some(
                  ({ start, end }) => lineNumber >= start && lineNumber <= end
                );

                if (isHighlighted) {
                  style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                  style.display = "block";
                  style.marginLeft = "-1em";
                  style.marginRight = "-1em";
                  style.paddingLeft = "1em";
                  style.paddingRight = "1em";
                }
              }
              return { style };
            }}
          >
            {value.code}
          </SyntaxHighlighter>
        </div>
      );
    },

    callout: ({ value }: { value: Callout }) => {
      const Icon = calloutIcons[value.type];

      return (
        <div
          className={cn(
            "my-6 rounded-lg border p-4",
            calloutStyles[value.type]
          )}
        >
          <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              {value.title && (
                <h4 className="mb-2 font-semibold">{value.title}</h4>
              )}
              <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <PortableText value={value.content} components={components} />
              </div>
            </div>
          </div>
        </div>
      );
    },

    videoEmbed: ({ value }: { value: VideoEmbed }) => {
      // Extract video ID from various platforms
      const getVideoId = (url: string) => {
        // YouTube
        const youtubeMatch = url.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
        );
        if (youtubeMatch) return { platform: "youtube", id: youtubeMatch[1] };

        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) return { platform: "vimeo", id: vimeoMatch[1] };

        return null;
      };

      const videoInfo = getVideoId(value.url);
      if (!videoInfo) return null;

      const aspectRatioClasses = {
        "16:9": "aspect-video",
        "4:3": "aspect-[4/3]",
        "1:1": "aspect-square",
      };

      const getEmbedUrl = () => {
        if (videoInfo.platform === "youtube") {
          return `https://www.youtube.com/embed/${videoInfo.id}`;
        }
        if (videoInfo.platform === "vimeo") {
          return `https://player.vimeo.com/video/${videoInfo.id}`;
        }
        return value.url;
      };

      return (
        <figure className="my-8">
          <div
            className={cn(
              "relative overflow-hidden rounded-lg border border-border",
              aspectRatioClasses[value.aspectRatio]
            )}
          >
            <iframe
              src={getEmbedUrl()}
              title={value.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {value.title && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.title}
            </figcaption>
          )}
        </figure>
      );
    },
  },

  block: {
    h1: ({ children }) => (
      <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 mb-4 text-2xl font-bold tracking-tight first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 text-xl font-semibold tracking-tight first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-3 text-lg font-semibold tracking-tight first:mt-0">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-s-4 border-primary ps-6 italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="my-4 leading-7 first:mt-0 last:mb-0">{children}</p>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="my-4 ms-6 list-disc space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 ms-6 list-decimal space-y-2">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    ),
    link: ({ value, children }) => (
      <a
        href={value.href}
        className="font-medium text-primary underline underline-offset-4 hover:no-underline"
        target={value.href?.startsWith("http") ? "_blank" : undefined}
        rel={value.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  },
};

export function PortableTextRenderer({
  content,
  className,
}: PortableTextRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-slate dark:prose-invert max-w-none",
        className
      )}
    >
      <PortableText value={content} components={components} />
    </div>
  );
}

export default PortableTextRenderer;
