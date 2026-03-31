import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Calendar, Eye, ArrowLeft, Tag } from "lucide-react";
import SafeHTML from "@/components/ui/SafeHTML";
import BlogComments from "@/components/BlogComments";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface BlogDetailPageProps {
  params: { slug: string; locale: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://backsureglobalsupport.com";

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  // Try to find by EN slug first, then by translated slug
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

  // Try EN slug first, then translated slug
  let post = await prisma.blog_posts.findUnique({
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

  // Overlay translated fields
  const postTr = 'translations' in post && Array.isArray(post.translations) && post.translations[0];
  const displayTitle = (postTr && postTr.title) || post.title;
  const displayExcerpt = (postTr && postTr.excerpt) || post.excerpt;
  const displayContent = (postTr && postTr.content) || post.content;

  // Increment view count
  await prisma.blog_posts.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  // Get related posts
  const relatedPosts = await prisma.blog_posts.findMany({
    where: {
      status: "published",
      id: { not: post.id },
      category_id: post.category_id || undefined,
    },
    take: 3,
    orderBy: { published_at: "desc" },
    include: {
      translations: { where: { locale }, select: { title: true, slug: true, excerpt: true }, take: 1 },
    },
  });

  // Get approved comment count
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

  // Calculate reading time (approx 200 words per minute)
  const wordCount = displayContent.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // JSON-LD Structured Data for SEO
  const imageUrl = post.image_path
    ? post.image_path.startsWith("http")
      ? post.image_path
      : `${SITE_URL}${post.image_path}`
    : `${SITE_URL}/images/og-default.jpg`;

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

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToBlog")}
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.category && (
              <span className="inline-block rounded-full bg-gold px-3 py-1 text-xs font-medium text-white">
                {post.category.name}
              </span>
            )}
          </div>

          <h1 className="font-poppins text-3xl font-bold lg:text-4xl">
            {displayTitle}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(post.published_at || post.created_at)}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t("views", { count: post.views.toLocaleString() })}
            </div>
            <span>{t("minRead", { minutes: readingTime })}</span>
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

      {/* Content */}
      <article className="py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          {/* Featured Image */}
          {post.image_path && (
            <div className="mb-8 overflow-hidden rounded-xl">
              <Image
                src={post.image_path}
                alt={displayTitle}
                width={1200}
                height={630}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          )}

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
        </div>
      </article>

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
                return (
                <Link
                  key={related.id}
                  href={`/blog/${rSlug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
                >
                  {related.image_path && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={related.image_path}
                        alt={rTitle}
                        className="h-40 w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="font-poppins font-semibold text-gray-900 group-hover:text-navy">
                    {rTitle}
                  </h3>
                  {rExcerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {rExcerpt}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-gray-400">
                    {formatDate(related.published_at || related.created_at)}
                  </p>
                </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h2 className="font-poppins text-2xl font-bold">
            {t("ctaTitle")}
          </h2>
          <p className="mt-4 text-white/70">
            {t("ctaDescription")}
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-lg bg-gold px-6 py-3 font-medium text-white transition-colors hover:bg-gold-dark"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </section>
    </>
  );
}
