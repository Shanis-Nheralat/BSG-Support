"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Search, ChevronLeft, ChevronRight, Tag, X } from "lucide-react";

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
  }, [activeCategory, activeTag, searchQuery]);

  // Fetch posts on mount and when filters change
  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveCategory("all");
    setActiveTag("");
    setSearchQuery("");
    setSearchInput("");
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("en-US", {
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
      {/* Search and Filters */}
      <section className="border-b border-gray-200 py-6">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-navy px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-dark"
            >
              Search
            </button>
          </form>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === "all"
                  ? "bg-navy text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-navy text-white"
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
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-gray-400" />
              {tags.map((tag) => (
                <button
                  key={tag.slug}
                  onClick={() => setActiveTag(activeTag === tag.slug ? "" : tag.slug)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    activeTag === tag.slug
                      ? "bg-gold text-white"
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
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {activeCategory !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-3 py-1 text-xs text-navy">
                  Category: {categories.find((c) => c.slug === activeCategory)?.name}
                  <button onClick={() => setActiveCategory("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {activeTag && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold-50 px-3 py-1 text-xs text-gold-dark">
                  Tag: #{tags.find((t) => t.slug === activeTag)?.name}
                  <button onClick={() => setActiveTag("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  Search: &quot;{searchQuery}&quot;
                  <button onClick={() => { setSearchQuery(""); setSearchInput(""); }}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 underline hover:text-gray-700"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy border-t-transparent" />
            </div>
          ) : (
            <>
              {/* Results Count */}
              {pagination.total > 0 && (
                <p className="mb-6 text-sm text-gray-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} articles
                </p>
              )}

              {/* Featured Posts */}
              {featuredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group mb-12 block rounded-xl border border-gray-200 p-8 transition-all hover:border-gold hover:shadow-lg"
                >
                  {post.image_path && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={post.image_path}
                        alt={post.title}
                        width={800}
                        height={400}
                        className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {post.category && (
                      <span className="inline-block rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-gold-dark">
                        {post.category.name}
                      </span>
                    )}
                    <span className="inline-block rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy">
                      Featured
                    </span>
                  </div>
                  <h2 className="mt-3 font-poppins text-2xl font-bold text-gray-900 group-hover:text-navy">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-gray-600">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.published_at)}
                    </div>
                    <span>{post.views.toLocaleString()} views</span>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}

              {/* Regular Posts Grid */}
              {regularPosts.length > 0 && (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {regularPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group rounded-xl border border-gray-200 p-6 transition-all hover:border-gold hover:shadow-lg"
                    >
                      {post.image_path && (
                        <div className="mb-3 overflow-hidden rounded-lg">
                          <Image
                            src={post.image_path}
                            alt={post.title}
                            width={400}
                            height={200}
                            className="h-36 w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}
                      {post.category && (
                        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                          {post.category.name}
                        </span>
                      )}
                      <h3 className="mt-3 font-poppins text-lg font-semibold text-gray-900 group-hover:text-navy">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(post.published_at)}
                        </div>
                        <span>{post.views.toLocaleString()} views</span>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="rounded bg-gray-50 px-2 py-0.5 text-xs text-gray-400"
                            >
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {posts.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-gray-500">
                    {hasActiveFilters
                      ? "No articles found matching your filters."
                      : "No articles published yet. Check back soon!"}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-sm text-navy underline hover:text-navy-dark"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => fetchPosts(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter((p) => {
                        // Show first, last, current, and adjacent pages
                        return (
                          p === 1 ||
                          p === pagination.pages ||
                          Math.abs(p - pagination.page) <= 1
                        );
                      })
                      .map((pageNum, idx, arr) => {
                        // Add ellipsis
                        const prevPage = arr[idx - 1];
                        const showEllipsis = prevPage && pageNum - prevPage > 1;
                        return (
                          <span key={pageNum} className="flex items-center">
                            {showEllipsis && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => fetchPosts(pageNum)}
                              className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                                pagination.page === pageNum
                                  ? "bg-navy text-white"
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
                    onClick={() => fetchPosts(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
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
