import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  CalendarDays,
  Clock,
  User,
  ArrowLeft,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import { getPostBySlug, getRelatedPosts } from "@/lib/sanity.api";
import { buildImageUrl } from "@/lib/sanity.client";
import { PortableTextRenderer } from "@/app/components/PortableTextRenderer";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Language } from "@/config/language.config";
import type { Post, PostListItem } from "@/lib/sanity.types";

interface BlogPostPageProps {
  params: Promise<{
    locale: Language;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const title = post.metaTitle || post.title;
  const description =
    post.metaDescription ||
    post.excerpt ||
    "Read this blog post to learn more.";
  const imageUrl = post.mainImage
    ? buildImageUrl(post.mainImage.asset.url)
        .width(1200)
        .height(630)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      authors: [post.author.name],
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.mainImage?.alt || post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
    },
  };
}

interface AuthorCardProps {
  author: Post["author"];
  locale: Language;
}

function AuthorCard({ author, locale }: AuthorCardProps) {
  const authorImageUrl = author.image
    ? buildImageUrl(author.image.asset.url)
        .width(120)
        .height(120)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        {authorImageUrl && (
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={authorImageUrl}
              alt={author.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <div>
            <h3 className="font-semibold">{author.name}</h3>
            {author.role && author.company && (
              <p className="text-sm text-muted-foreground">
                {author.role} at {author.company}
              </p>
            )}
          </div>

          {author.bio?.[locale] && (
            <div className="text-sm text-muted-foreground">
              <PortableTextRenderer content={author.bio[locale]} />
            </div>
          )}

          {author.social && (
            <div className="flex items-center gap-2">
              {author.social.twitter && (
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href={`https://twitter.com/${author.social.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Follow ${author.name} on Twitter`}
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {author.social.linkedin && (
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href={author.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Connect with ${author.name} on LinkedIn`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {author.social.github && (
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href={`https://github.com/${author.social.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`View ${author.name}'s GitHub profile`}
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

interface RelatedPostsProps {
  posts: PostListItem[];
  locale: Language;
}

function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const imageUrl = post.mainImage
            ? buildImageUrl(post.mainImage.asset.url)
                .width(300)
                .height(200)
                .fit("crop")
                .auto("format")
                .url()
            : null;

          return (
            <Card
              key={post._id}
              className="group overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link href={`/${locale}/blog/${post.slug.current}`}>
                {imageUrl && (
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={post.mainImage?.alt || post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                <CardHeader className="space-y-2">
                  <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>

                    {post.readingTime && (
                      <>
                        <Clock className="h-3 w-3 ms-2" />
                        <span>{post.readingTime} min</span>
                      </>
                    )}
                  </div>
                </CardHeader>
              </Link>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

interface ShareButtonsProps {
  title: string;
  url: string;
}

function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Share:</span>

      <Button variant="ghost" size="sm" asChild>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </a>
      </Button>

      <Button variant="ghost" size="sm" asChild>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </a>
      </Button>

      <Button variant="ghost" size="sm" asChild>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}

async function BlogPostContent({
  locale,
  slug,
}: {
  locale: Language;
  slug: string;
}) {
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(
    post._id,
    post.categories?.map((cat) => cat.slug.current) || [],
    locale,
    3,
  );

  const imageUrl = post.mainImage
    ? buildImageUrl(post.mainImage.asset.url)
        .width(1200)
        .height(600)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  const formattedDate = new Date(post.publishedAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `/${locale}/blog/${slug}`;

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="gap-2">
          <Link href={`/${locale}/blog`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      {/* Article header */}
      <header className="space-y-6 mb-8">
        <div className="space-y-4">
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <Badge
                  key={category._id}
                  variant="secondary"
                  className={cn(
                    category.color === "blue" &&
                      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
                    category.color === "green" &&
                      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
                    category.color === "purple" &&
                      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
                    category.color === "orange" &&
                      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
                    category.color === "red" &&
                      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
                    category.color === "pink" &&
                      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
                    category.color === "yellow" &&
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
                  )}
                >
                  <Link
                    href={`/${locale}/blog?category=${category.slug.current}`}
                  >
                    {category.title}
                  </Link>
                </Badge>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <time dateTime={post.publishedAt}>{formattedDate}</time>
            </div>

            {post.readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} min read</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
          </div>

          <ShareButtons title={post.title} url={currentUrl} />
        </div>

        {imageUrl && (
          <div className="relative aspect-[2/1] overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}
      </header>

      {/* Article content */}
      <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
        <PortableTextRenderer content={post.body} />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                <Link href={`/${locale}/blog?tag=${tag}`}>#{tag}</Link>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-8" />

      {/* Author bio */}
      <div className="mb-12">
        <AuthorCard author={post.author} locale={locale} />
      </div>

      {/* Related posts */}
      <RelatedPosts posts={relatedPosts} locale={locale} />
    </article>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-24"></div>
              <div className="h-16 bg-muted rounded w-full"></div>
              <div className="h-6 bg-muted rounded w-3/4"></div>
            </div>
            <div className="aspect-[2/1] bg-muted rounded-lg"></div>
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <BlogPostContent locale={locale} slug={slug} />
    </Suspense>
  );
}
