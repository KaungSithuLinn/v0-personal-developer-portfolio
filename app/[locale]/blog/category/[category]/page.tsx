import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { CalendarDays, Clock, ArrowLeft, Filter } from "lucide-react";
import { getPostsByCategory, getCategoryBySlug } from "@/lib/sanity.api";
import { buildImageUrl } from "@/lib/sanity.client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Language } from "@/config/language.config";
import type { PostListItem } from "@/lib/sanity.types";

interface CategoryPageProps {
  params: Promise<{
    locale: Language;
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, category } = await params;
  const categoryData = await getCategoryBySlug(category, locale);

  if (!categoryData) {
    return {
      title: "Category Not Found",
    };
  }

  const title = `${categoryData.title} - Blog Category`;
  const description =
    categoryData.description ||
    `Explore all posts in the ${categoryData.title} category.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/blog/category/${category}`,
    },
  };
}

interface PostCardProps {
  post: PostListItem;
  locale: Language;
}

function PostCard({ post, locale }: PostCardProps) {
  const imageUrl = post.mainImage
    ? buildImageUrl(post.mainImage.asset.url)
        .width(400)
        .height(250)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  const formattedDate = new Date(post.publishedAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/${locale}/blog/${post.slug.current}`}>
        {imageUrl && (
          <div className="relative aspect-[8/5] overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <CardHeader className="space-y-3">
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.categories.slice(0, 2).map((category) => (
                <Badge
                  key={category._id}
                  variant="secondary"
                  className={cn(
                    "text-xs",
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
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                  )}
                >
                  {category.title}
                </Badge>
              ))}
            </div>
          )}

          <h2 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                <time dateTime={post.publishedAt}>{formattedDate}</time>
              </div>

              {post.readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.readingTime} min</span>
                </div>
              )}
            </div>

            <span className="font-medium">{post.author.name}</span>
          </div>
        </CardHeader>
      </Link>
    </Card>
  );
}

interface CategoryContentProps {
  locale: Language;
  category: string;
  page: number;
}

async function CategoryContent({
  locale,
  category,
  page,
}: CategoryContentProps) {
  const [categoryData, postsData] = await Promise.all([
    getCategoryBySlug(category, locale),
    getPostsByCategory(category, locale, { page, limit: 12 }),
  ]);

  if (!categoryData) {
    notFound();
  }

  const {
    items: posts,
    hasNext: hasNextPage,
    hasPrev: hasPrevPage,
  } = postsData;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="gap-2">
          <Link href={`/${locale}/blog`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      {/* Category header */}
      <div className="mb-12 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Badge
            variant="secondary"
            className={cn(
              "text-base px-4 py-2",
              categoryData.color === "blue" &&
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
              categoryData.color === "green" &&
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
              categoryData.color === "purple" &&
                "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
              categoryData.color === "orange" &&
                "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
              categoryData.color === "red" &&
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
              categoryData.color === "pink" &&
                "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
              categoryData.color === "yellow" &&
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
            )}
          >
            {categoryData.title}
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {categoryData.title}
        </h1>

        {categoryData.description && (
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {categoryData.description}
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"} in this
          category
        </p>
      </div>

      {/* Posts grid */}
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post: PostListItem) => (
              <PostCard key={post._id} post={post} locale={locale} />
            ))}
          </div>

          {/* Pagination */}
          {(hasNextPage || hasPrevPage) && (
            <div className="flex items-center justify-center gap-4">
              {hasPrevPage && (
                <Button variant="outline" asChild>
                  <Link
                    href={`/${locale}/blog/category/${category}${page > 2 ? `?page=${page - 1}` : ""}`}
                  >
                    Previous
                  </Link>
                </Button>
              )}

              <span className="text-sm text-muted-foreground">Page {page}</span>

              {hasNextPage && (
                <Button variant="outline" asChild>
                  <Link
                    href={`/${locale}/blog/category/${category}?page=${page + 1}`}
                  >
                    Next
                  </Link>
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="space-y-4">
            <div className="text-6xl opacity-20">📝</div>
            <h2 className="text-2xl font-semibold">No posts found</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              There are currently no published posts in the {categoryData.title}{" "}
              category.
            </p>
            <Button asChild className="mt-6">
              <Link href={`/${locale}/blog`}>Browse All Posts</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { locale, category } = await params;
  const { page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10));

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="text-center space-y-4">
              <div className="h-6 bg-muted rounded w-24 mx-auto"></div>
              <div className="h-12 bg-muted rounded w-64 mx-auto"></div>
              <div className="h-6 bg-muted rounded w-96 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[8/5] bg-muted rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <CategoryContent locale={locale} category={category} page={currentPage} />
    </Suspense>
  );
}
