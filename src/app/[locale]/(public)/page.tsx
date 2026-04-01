import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import HomePageContent from "./HomePageContent";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://backsureglobalsupport.com";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  const title = t("meta.title");
  const description = t("meta.description");

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        en: `${SITE_URL}/en`,
        de: `${SITE_URL}/de`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName: "Backsure Global Support",
      locale: locale === "de" ? "de_DE" : "en_US",
      alternateLocale: locale === "de" ? "en_US" : "de_DE",
      type: "website",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch 3 latest published blog posts for "Latest Insights" section
  let latestPosts: {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_path: string | null;
    published_at: string | null;
    reading_time: number;
    category: { name: string; slug: string } | null;
  }[] = [];

  try {
    const posts = await prisma.blog_posts.findMany({
      where: { status: "published" },
      orderBy: { published_at: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        image_path: true,
        published_at: true,
        category: { select: { name: true, slug: true } },
        translations: {
          where: { locale },
          select: { title: true, slug: true, excerpt: true },
        },
      },
    });

    latestPosts = posts.map((post) => {
      const tr = post.translations[0];
      const wordCount = post.content
        .replace(/<[^>]*>/g, "")
        .split(/\s+/)
        .filter(Boolean).length;
      return {
        id: post.id,
        title: tr?.title ?? post.title,
        slug: tr?.slug ?? post.slug,
        excerpt: tr?.excerpt ?? post.excerpt,
        image_path: post.image_path,
        published_at: post.published_at?.toISOString() ?? null,
        reading_time: Math.max(1, Math.ceil(wordCount / 200)),
        category: post.category,
      };
    });
  } catch (error) {
    console.error("Failed to fetch latest blog posts:", error);
  }

  return <HomePageContent latestPosts={latestPosts} />;
}
