"use client";

import { useState, useEffect, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Calendar, Search, ChevronLeft, ChevronRight, X, Clock, Eye, ArrowRight } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  _count?: { posts: number };
}

interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  image_path: string | null;
  featured: boolean;
  published_at: string | null;
  views: number;
  reading_time?: number;
  category: Category | null;
  tags: BlogTag[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface BlogContentProps {
  initialPosts?: BlogPost[];
  initialCategories?: Category[];
}

export default function BlogContent({ initialPosts, initialCategories }: BlogContentProps) {
  const t = useTranslations("Blog");
  const locale = useLocale();

  const [posts, setPosts] = useState<BlogPost[]>(initialPosts || []);
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeTag, setActiveTag] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        locale,
      });

      if (activeCategory && activeCategory !== "all") {
        params.set("category", activeCategory);
      }
      if (activeTag) {
        params.set("tag", activeTag);
      }
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const response = await fetch(`/api/blog?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts);
        setPagination(data.pagination);
        if (data.filters) {
          setCategories(data.filters.categories);
          setTags(data.filters.tags);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeTag, searchQuery, locale]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const clearFilters = () => {
    setActiveCategory("all");
    setActiveTag("");
    setSearchQuery("");
    setSearchInput("");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const featuredPosts = posts.filter((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);
  const hasActiveFilters = activeCategory !== "all" || activeTag || searchQuery;

  return (
    <>
      {/* Sticky Search and Filters */}
      <section className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 py-5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-navy px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-dark"
            >
              {t("searchButton")}
            </button>
          </form>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-navy text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("allCategories")}
            </button>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeCategory === cat.slug
                    ? "bg-navy text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.name}
                {cat._count && (
                  <span className="ml-1 text-xs opacity-70">({cat._count.posts})</span>
                )}
              </button>
            ))}
          </div>

          {/* Tag Filters */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                {t("popularTopics")}
              </span>
              {tags.map((tag) => (
                <button
                  type="button"
                  key={tag.slug}
                  onClick={() => setActiveTag(activeTag === tag.slug ? "" : tag.slug)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    activeTag === tag.slug
                      ? "bg-gold text-white shadow-sm"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">{t("activeFilters")}</span>
              {activeCategory !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-3 py-1 text-xs text-navy">
                  {t("categoryLabel")} {categories.find((c) => c.slug === activeCategory)?.name}
                  <button type="button" onClick={() => setActiveCategory("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {activeTag && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold-50 px-3 py-1 text-xs text-gold-dark">
                  {t("tagLabel")} #{tags.find((tg) => tg.slug === activeTag)?.name}
                  <button type="button" onClick={() => setActiveTag("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  {t("searchLabel")} &quot;{searchQuery}&quot;
                  <button type="button" onClick={() => { setSearchQuery(""); setSearchInput(""); }}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-gray-500 underline hover:text-gray-700"
              >
                {t("clearAll")}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {loading ? (
            /* Skeleton Loading */
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-gray-200">
                  <div className="aspect-[16/10] animate-pulse bg-gray-200" />
                  <div className="p-5">
                    <div className="mb-3 h-4 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="mb-2 h-5 w-full animate-pulse rounded bg-gray-200" />
                    <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="mt-4 h-3 w-full animate-pulse rounded bg-gray-100" />
                    <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-gray-100" />
                    <div className="mt-4 flex justify-between">
                      <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                      <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Results Count */}
              {pagination.total > 0 && (
                <div className="mb-8 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {t("showing", {
                      from: (pagination.page - 1) * pagination.limit + 1,
                      to: Math.min(pagination.page * pagination.limit, pagination.total),
                      total: pagination.total,
                    })}
                  </p>
                  {pagination.pages > 1 && (
                    <p className="text-sm text-gray-400">
                      {t("pageOf", { current: pagination.page, total: pagination.pages })}
                    </p>
                  )}
                </div>
              )}

              {/* Editor's Pick - Featured Posts */}
              {featuredPosts.length > 0 && (
                <div className="mb-12">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="inline-block rounded-full bg-navy px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                      {t("editorsPick")}
                    </span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  {featuredPosts.length === 1 ? (
                    /* Single Featured Post - Full Width Spotlight */
                    <Link
                      href={`/blog/${featuredPosts[0].slug}`}
                      className="group hover-lift block overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:border-gold hover:shadow-xl"
                    >
                      <div className="grid md:grid-cols-5">
                        <div className="relative md:col-span-3">
                          {featuredPosts[0].image_path ? (
                            <div className="aspect-[16/10] md:aspect-auto md:h-full">
                              <Image
                                src={featuredPosts[0].image_path}
                                alt={featuredPosts[0].title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-navy to-navy-dark md:aspect-auto md:h-full">
                              <span className="font-poppins text-3xl font-bold text-white/20">BSG</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center p-8 md:col-span-2">
                          <div className="flex flex-wrap gap-2">
                            {featuredPosts[0].category && (
                              <span className="inline-block rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-gold-dark">
                                {featuredPosts[0].category.name}
                              </span>
                            )}
                          </div>
                          <h2 className="mt-3 font-poppins text-2xl font-bold text-gray-900 group-hover:text-navy lg:text-3xl">
                            {featuredPosts[0].title}
                          </h2>
                          <p className="mt-3 line-clamp-3 text-gray-600">
                            {featuredPosts[0].excerpt}
                          </p>
                          <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(featuredPosts[0].published_at)}
                            </div>
                            {featuredPosts[0].reading_time && (
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {t("readingTime", { minutes: featuredPosts[0].reading_time })}
                              </div>
                            )}
                          </div>
                          <span className="mt-6 inline-flex items-center gap-2 font-medium text-navy group-hover:text-gold">
                            {t("readMore")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    /* Multiple Featured Posts - Spotlight + Sidebar */
                    <div className="grid gap-6 lg:grid-cols-5">
                      {/* Main spotlight */}
                      <Link
                        href={`/blog/${featuredPosts[0].slug}`}
                        className="group hover-lift block overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:border-gold hover:shadow-xl lg:col-span-3"
                      >
                        <div className="relative">
                          {featuredPosts[0].image_path ? (
                            <div className="aspect-[16/10]">
                              <Image
                                src={featuredPosts[0].image_path}
                                alt={featuredPosts[0].title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-navy to-navy-dark">
                              <span className="font-poppins text-3xl font-bold text-white/20">BSG</span>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex flex-wrap gap-2">
                            {featuredPosts[0].category && (
                              <span className="inline-block rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-gold-dark">
                                {featuredPosts[0].category.name}
                              </span>
                            )}
                          </div>
                          <h2 className="mt-3 font-poppins text-xl font-bold text-gray-900 group-hover:text-navy lg:text-2xl">
                            {featuredPosts[0].title}
                          </h2>
                          <p className="mt-2 line-clamp-2 text-gray-600">{featuredPosts[0].excerpt}</p>
                          <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(featuredPosts[0].published_at)}
                            </div>
                            {featuredPosts[0].reading_time && (
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {t("readingTime", { minutes: featuredPosts[0].reading_time })}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>

                      {/* Sidebar featured */}
                      <div className="flex flex-col gap-6 lg:col-span-2">
                        {featuredPosts.slice(1, 3).map((post) => (
                          <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group hover-lift flex flex-1 gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gold hover:shadow-lg"
                          >
                            {post.image_path && (
                              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                                <Image
                                  src={post.image_path}
                                  alt={post.title}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                />
                              </div>
                            )}
                            <div className="flex flex-col justify-center">
                              {post.category && (
                                <span className="mb-1 inline-block self-start rounded-full bg-gold-50 px-2.5 py-0.5 text-xs font-medium text-gold-dark">
                                  {post.category.name}
                                </span>
                              )}
                              <h3 className="font-poppins text-sm font-semibold leading-tight text-gray-900 group-hover:text-navy">
                                {post.title}
                              </h3>
                              <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                                <span>{formatDate(post.published_at)}</span>
                                {post.reading_time && (
                                  <span>{t("readingTime", { minutes: post.reading_time })}</span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Regular Posts Grid */}
              {regularPosts.length > 0 && (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {regularPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group hover-lift overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-l-4 hover:border-l-gold hover:shadow-lg"
                    >
                      {/* Image */}
                      <div className="relative">
                        {post.image_path ? (
                          <div className="aspect-[16/10] overflow-hidden">
                            <Image
                              src={post.image_path}
                              alt={post.title}
                              width={600}
                              height={375}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-navy-50 to-navy-100">
                            <span className="font-poppins text-2xl font-bold text-navy/10">BSG</span>
                          </div>
                        )}
                        {/* Category overlay */}
                        {post.category && (
                          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm">
                            {post.category.name}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-poppins text-lg font-bold leading-tight text-gray-900 group-hover:text-navy">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                          {post.excerpt}
                        </p>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag.id}
                                className="text-xs text-gray-400"
                              >
                                #{tag.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(post.published_at)}
                            </div>
                            {post.reading_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {t("readingTime", { minutes: post.reading_time })}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {posts.length === 0 && (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Search className="h-7 w-7 text-gray-400" />
                  </div>
                  <p className="text-gray-500">
                    {hasActiveFilters
                      ? t("noArticlesFiltered")
                      : t("noArticlesYet")}
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-4 text-sm font-medium text-navy underline hover:text-navy-dark"
                    >
                      {t("clearFilters")}
                    </button>
                  )}
                </div>
              )}

              {/* Newsletter CTA */}
              {posts.length > 0 && (
                <div className="mt-16 rounded-2xl bg-navy px-6 py-12 text-center text-white sm:px-12">
                  <h2 className="font-poppins text-2xl font-bold lg:text-3xl">
                    {t("ctaTitle")}
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-white/70">
                    {t("ctaDescription")}
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-medium text-white transition-colors hover:bg-gold-dark"
                    >
                      {t("ctaButton")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
                    >
                      {t("scheduleCall")}
                    </Link>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fetchPosts(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t("previous")}
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter((p) => {
                        return (
                          p === 1 ||
                          p === pagination.pages ||
                          Math.abs(p - pagination.page) <= 1
                        );
                      })
                      .map((pageNum, idx, arr) => {
                        const prevPage = arr[idx - 1];
                        const showEllipsis = prevPage && pageNum - prevPage > 1;
                        return (
                          <span key={pageNum} className="flex items-center">
                            {showEllipsis && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                              type="button"
                              onClick={() => fetchPosts(pageNum)}
                              className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                                pagination.page === pageNum
                                  ? "bg-gold text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          </span>
                        );
                      })}
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchPosts(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("next")}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
