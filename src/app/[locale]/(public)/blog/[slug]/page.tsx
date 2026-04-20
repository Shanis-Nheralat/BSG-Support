import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Calendar, Eye, Tag, Clock, ArrowRight, BookOpen } from "lucide-react";
import SafeHTML from "@/components/ui/SafeHTML";
import BlogComments from "@/components/BlogComments";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButtons from "@/components/ShareButtons";
import FloatingShareBar from "@/components/FloatingShareBar";
import MobileTOC from "@/components/MobileTOC";
import HeroBackground from "@/components/animation/HeroBackground";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface BlogDetailPageProps {
  params: { slug: string; locale: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://backsureglobalsupport.com";

// Extract headings from HTML content for TOC
function extractHeadings(html: string): Array<{ id: string; text: string; level: number }> {
  const headings: Array<{ id: string; text: string; level: number }> = [];
  const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (id && text) {
      headings.push({ id, text, level: parseInt(match[1]) });
    }
  }
  return headings;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  let post = await prisma.blog_posts.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: { include: { tag: true } },
      translations: { where: { locale }, take: 1 },
    },
  });

  if (!post && locale !== "en") {
    const tr = await prisma.blog_post_translations.findFirst({
      where: { locale, slug },
      include: { post: { include: { category: true, tags: { include: { tag: true } } } } },
    });
    if (tr) {
      post = { ...tr.post, translations: [tr] } as unknown as typeof post;
    }
  }

  if (!post) {
    return { title: "Post Not Found" };
  }

  const tr = 'translations' in post && Array.isArray(post.translations) && post.translations[0];
  const title = (tr && tr.meta_title) || post.meta_title || (tr && tr.title) || post.title;
  const description = (tr && tr.meta_description) || post.meta_description || (tr && tr.excerpt) || post.excerpt || "";
  const displayTitle = (tr && tr.title) || post.title;
  const displaySlug = (tr && tr.slug) || post.slug;
  const imageUrl = post.image_path 
    ? post.image_path.startsWith("http") 
      ? post.image_path 
      : `${SITE_URL}${post.image_path}`
    : `${SITE_URL}/images/og-default.jpg`;
  const postUrl = `${SITE_URL}/${locale}/blog/${displaySlug}`;
  const keywords = post.meta_keywords 
    ? post.meta_keywords.split(",").map(k => k.trim())
    : post.tags.map(t => t.tag.name);

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Backsure Global Support" }],
    openGraph: {
      title,
      description,
      url: postUrl,
      siteName: "Backsure Global Support",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: displayTitle,
        },
      ],
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "article",
      publishedTime: post.published_at?.toISOString(),
      modifiedTime: post.updated_at?.toISOString(),
      section: post.category?.name || "Blog",
      tags: keywords,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("BlogDetail");

  let post = await prisma.blog_posts.findFirst({
    where: { slug, status: "published" },
    include: {
      category: true,
      tags: { include: { tag: true } },
      translations: { where: { locale }, take: 1 },
    },
  });

  if (!post && locale !== "en") {
    const foundTr = await prisma.blog_post_translations.findFirst({
      where: { locale, slug },
      include: {
        post: {
          include: {
            category: true,
            tags: { include: { tag: true } },
          },
        },
      },
    });
    if (foundTr && foundTr.post.status === "published") {
      post = { ...foundTr.post, translations: [foundTr] } as unknown as typeof post;
    }
  }

  if (!post) notFound();

  const postTr = 'translations' in post && Array.isArray(post.translations) && post.translations[0];
  const displayTitle = (postTr && postTr.title) || post.title;
  const displayExcerpt = (postTr && postTr.excerpt) || post.excerpt;
  const displayContent = (postTr && postTr.content) || post.content;

  // Increment view count
  await prisma.blog_posts.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  // Get related posts with content for reading time
  const relatedPosts = await prisma.blog_posts.findMany({
    where: {
      status: "published",
      id: { not: post.id },
      category_id: post.category_id || undefined,
    },
    take: 3,
    orderBy: { published_at: "desc" },
    include: {
      category: true,
      translations: { where: { locale }, select: { title: true, slug: true, excerpt: true }, take: 1 },
    },
  });

  const commentCount = await prisma.blog_comments.count({
    where: { post_id: post.id, status: "approved" },
  });

  function formatDate(date: Date | null) {
    if (!date) return "";
    return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  }

  const wordCount = displayContent.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Extract TOC headings
  const headings = extractHeadings(displayContent);

  // Image URL for hero and JSON-LD
  const imageUrl = post.image_path
    ? post.image_path.startsWith("http")
      ? post.image_path
      : `${SITE_URL}${post.image_path}`
    : `${SITE_URL}/images/og-default.jpg`;

  const postUrl = `${SITE_URL}/${locale}/blog/${(postTr && postTr.slug) || post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: displayTitle,
    description: displayExcerpt || displayContent.replace(/<[^>]*>/g, "").substring(0, 160),
    image: imageUrl,
    datePublished: (post.published_at || post.created_at).toISOString(),
    dateModified: post.updated_at.toISOString(),
    author: {
      "@type": "Organization",
      name: "Backsure Global Support",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Backsure Global Support",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    wordCount: wordCount,
    articleSection: post.category?.name || "Blog",
    keywords: post.tags.map((tg) => tg.tag.name).join(", "),
  };

  const hasHeroImage = !!post.image_path;

  return (
    <>
      {/* Reading Progress Bar */}
      <ReadingProgress />

      {/* Floating Share Bar (Desktop) */}
      <FloatingShareBar url={postUrl} title={displayTitle} />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Immersive Hero */}
      <section className={`relative overflow-hidden text-white ${hasHeroImage ? 'py-24 lg:py-32' : 'py-20 lg:py-28'}`}>
        {/* Background */}
        {hasHeroImage ? (
          <>
            <Image
              src={post.image_path!}
              alt={displayTitle}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-navy" />
            <HeroBackground />
          </>
        )}

        <div className="relative z-10 mx-auto max-w-4xl px-4 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/50">
            <Link href="/" className="transition-colors hover:text-white/80">Home</Link>
            <span>/</span>
            <Link href="/blog" className="transition-colors hover:text-white/80">Blog</Link>
            {post.category && (
              <>
                <span>/</span>
                <Link href={`/blog?category=${post.category.slug}`} className="transition-colors hover:text-white/80">{post.category.name}</Link>
              </>
            )}
          </nav>

          {/* Category Badge */}
          <div className="mb-4 flex flex-wrap gap-2">
            {post.category && (
              <span className="inline-block rounded-full bg-gold px-3 py-1 text-xs font-medium text-white">
                {post.category.name}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-poppins text-3xl font-bold leading-tight lg:text-4xl xl:text-5xl">
            {displayTitle}
          </h1>

          {/* Meta Row */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(post.published_at || post.created_at)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t("minRead", { minutes: readingTime })}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t("views", { count: post.views.toLocaleString() })}
            </div>
            <div className="ml-auto">
              <ShareButtons url={postUrl} title={displayTitle} />
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-white/50" />
              {post.tags.map((pt) => (
                <Link
                  key={pt.tag.id}
                  href={`/blog?tag=${pt.tag.slug}`}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/20"
                >
                  #{pt.tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article Content with TOC Sidebar */}
      <article className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className={headings.length > 2 ? "lg:grid lg:grid-cols-[1fr_280px] lg:gap-12" : ""}>
            {/* Main Content */}
            <div className="mx-auto max-w-4xl lg:mx-0">
              {/* Excerpt */}
              {displayExcerpt && (
                <p className="mb-8 text-xl leading-relaxed text-gray-600">
                  {displayExcerpt}
                </p>
              )}

              {/* Post Content */}
              <SafeHTML
                html={displayContent}
                className="prose prose-lg max-w-none prose-headings:font-poppins prose-headings:text-gray-900 prose-a:text-navy prose-a:no-underline hover:prose-a:underline"
              />

              {/* Author Section */}
              <div className="mt-12 rounded-xl border border-gray-200 bg-gradient-to-r from-navy-50 to-white p-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-gold/30 bg-white p-1.5">
                    <Image
                      src="/images/logo.png"
                      alt="Backsure Global Support"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{t("publishedBy")}</p>
                    <p className="font-poppins text-base font-semibold text-gray-900">{t("authorName")}</p>
                    <p className="text-sm text-gray-500">{t("authorTagline")}</p>
                  </div>
                </div>
                {post.published_at && (
                  <div className="mt-4 flex items-center gap-2 border-t border-gray-200 pt-4 text-xs text-gray-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{t("publishedOn")} {formatDate(post.published_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* TOC Sidebar (Desktop only, only if enough headings) */}
            {headings.length > 2 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <h4 className="mb-4 font-poppins text-sm font-semibold uppercase tracking-wider text-gray-400">
                    {t("tableOfContents")}
                  </h4>
                  <nav className="space-y-1 border-l-2 border-gray-200">
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block border-l-2 -ml-[2px] py-1.5 text-sm transition-colors hover:border-gold hover:text-navy ${
                          heading.level === 3 ? "pl-6" : "pl-4"
                        } border-transparent text-gray-500`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>
      </article>

      {/* Mobile TOC */}
      <MobileTOC headings={headings} label={t("tableOfContents")} />

      {/* Comments Section */}
      <BlogComments slug={slug} commentCount={commentCount} />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-gray-200 bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="mb-8 font-poppins text-2xl font-bold text-gray-900">
              {t("relatedArticles")}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((related) => {
                const rTr = 'translations' in related && Array.isArray(related.translations) && related.translations[0];
                const rTitle = (rTr && rTr.title) || related.title;
                const rSlug = (rTr && rTr.slug) || related.slug;
                const rExcerpt = (rTr && rTr.excerpt) || related.excerpt;
                const rReadingTime = Math.max(1, Math.ceil(related.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length / 200));
                return (
                  <Link
                    key={related.id}
                    href={`/blog/${rSlug}`}
                    className="group hover-lift overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-gold hover:shadow-lg"
                  >
                    {/* Image */}
                    <div className="relative">
                      {related.image_path ? (
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={related.image_path}
                            alt={rTitle}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-[16/10] flex-col items-center justify-center bg-gradient-to-br from-navy-50 via-navy-100 to-gold-50">
                          <BookOpen className="h-10 w-10 text-navy/15" />
                          <span className="mt-2 font-poppins text-xs font-semibold uppercase tracking-widest text-navy/15">BSG Insights</span>
                        </div>
                      )}
                      {related.category && (
                        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm">
                          {related.category.name}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-poppins font-semibold text-gray-900 group-hover:text-navy">
                        {rTitle}
                      </h3>
                      {rExcerpt && (
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          {rExcerpt}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(related.published_at || related.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {t("minRead", { minutes: rReadingTime })}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-medium text-navy hover:text-gold"
              >
                {t("viewAllInsights")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden bg-navy py-16 text-white">
        <HeroBackground />
        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left">
            <div className="flex-1">
              <h2 className="font-poppins text-2xl font-bold lg:text-3xl">
                {t("ctaTitle")}
              </h2>
              <p className="mt-4 text-white/70">
                {t("ctaDescription")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-gold px-6 py-3 font-medium text-white transition-colors hover:bg-gold-dark"
              >
                {t("ctaButton")}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
              >
                {t("scheduleCall")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
