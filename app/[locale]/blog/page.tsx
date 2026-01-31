import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock, User, Tag } from "lucide-react";
import { getPosts, getCategories, getAllTags } from "@/lib/sanity.api";
import { buildImageUrl, urlFor } from "@/lib/sanity.client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Language } from "@/config/language.config";
import type { PostListItem, CategoryWithCounts } from "@/lib/sanity.types";

interface BlogPageProps {
  params: Promise<{
    locale: Language;
  }>;
  searchParams: Promise<{
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  }>;
}

interface BlogPostCardProps {
  post: PostListItem;
  locale: Language;
}

function BlogPostCard({ post, locale }: BlogPostCardProps) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset.url)
        .width(400)
        .height(240)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  const formattedDate = new Date(post.publishedAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/${locale}/blog/${post.slug.current}`} className="block">
        {imageUrl && (
          <div className="relative aspect-[5/3] overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <time dateTime={post.publishedAt}>{formattedDate}</time>
            </div>

            {post.readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} min read</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-3">
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
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

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

interface BlogFiltersProps {
  categories: CategoryWithCounts[];
  tags: string[];
  locale: Language;
  currentCategory?: string;
  currentTag?: string;
  currentSearch?: string;
}

function BlogFilters({
  categories,
  tags,
  locale,
  currentCategory,
  currentTag,
  currentSearch,
}: BlogFiltersProps) {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="space-y-2">
        <label htmlFor="search" className="text-sm font-medium">
          Search Posts
        </label>
        <Input
          id="search"
          placeholder="Search blog posts..."
          defaultValue={currentSearch}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">
          Filter by Category
        </label>
        <Select defaultValue={currentCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category.slug.current}>
                {category.title} ({category.postCount})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="tag" className="text-sm font-medium">
          Filter by Tag
        </label>
        <Select defaultValue={currentTag}>
          <SelectTrigger>
            <SelectValue placeholder="All Tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Tags</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/${locale}/blog?category=${category.slug.current}`}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                currentCategory === category.slug.current && "bg-muted"
              )}
            >
              <span>{category.title}</span>
              <Badge variant="outline" className="ms-auto">
                {category.postCount}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  locale: Language;
  searchParams: URLSearchParams;
}

function Pagination({
  currentPage,
  hasNext,
  hasPrev,
  locale,
  searchParams,
}: PaginationProps) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    return `/${locale}/blog${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {hasPrev && (
          <Button variant="outline" asChild>
            <Link href={createPageUrl(currentPage - 1)}>Previous</Link>
          </Button>
        )}

        <span className="text-sm text-muted-foreground">
          Page {currentPage}
        </span>

        {hasNext && (
          <Button variant="outline" asChild>
            <Link href={createPageUrl(currentPage + 1)}>Next</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

async function BlogContent({
  locale,
  searchParams,
}: {
  locale: Language;
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 12;

  try {
    const [postsResult, categories, tags] = await Promise.all([
      getPosts(
        locale,
        {
          category: searchParams.category,
          tag: searchParams.tag,
        },
        { page, limit }
      ),
      getCategories(locale),
      getAllTags(locale),
    ]);

    if (!postsResult.items.length && page > 1) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Blog & Notes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technical insights, tutorials, and thoughts on software development,
            web technologies, and programming best practices.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <BlogFilters
                categories={categories}
                tags={tags}
                locale={locale}
                currentCategory={searchParams.category}
                currentTag={searchParams.tag}
                currentSearch={searchParams.search}
              />
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            {postsResult.items.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {postsResult.items.map((post) => (
                    <BlogPostCard key={post._id} post={post} locale={locale} />
                  ))}
                </div>

                <Pagination
                  currentPage={postsResult.page}
                  hasNext={postsResult.hasNext}
                  hasPrev={postsResult.hasPrev}
                  locale={locale}
                  searchParams={
                    new URLSearchParams(searchParams as Record<string, string>)
                  }
                />
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <Button asChild>
                  <Link href={`/${locale}/blog`}>View All Posts</Link>
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog data:", error);
    throw error;
  }
}

export default async function BlogPage({
  params,
  searchParams,
}: BlogPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="text-center space-y-4">
              <div className="h-10 bg-muted rounded w-64 mx-auto"></div>
              <div className="h-6 bg-muted rounded w-96 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-96 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <BlogContent locale={locale} searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
