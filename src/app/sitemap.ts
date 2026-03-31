import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://backsureglobalsupport.com";
const locales = ["en", "de"] as const;

function localizedEntry(
  path: string,
  opts: { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
      ),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages with locale variants
  const staticPages: MetadataRoute.Sitemap = [
    ...localizedEntry("", { changeFrequency: "weekly", priority: 1 }),
    ...localizedEntry("/about", { changeFrequency: "monthly", priority: 0.8 }),
    ...localizedEntry("/contact", { changeFrequency: "monthly", priority: 0.9 }),
    ...localizedEntry("/blog", { changeFrequency: "daily", priority: 0.9 }),
    ...localizedEntry("/calculator", { changeFrequency: "monthly", priority: 0.9 }),
    ...localizedEntry("/careers", { changeFrequency: "weekly", priority: 0.7 }),
    ...localizedEntry("/faq", { changeFrequency: "monthly", priority: 0.6 }),
    ...localizedEntry("/team", { changeFrequency: "monthly", priority: 0.6 }),
    ...localizedEntry("/testimonials", { changeFrequency: "monthly", priority: 0.6 }),
    ...localizedEntry("/data-security", { changeFrequency: "monthly", priority: 0.5 }),
    ...localizedEntry("/privacy-policy", { changeFrequency: "yearly", priority: 0.3 }),
    ...localizedEntry("/terms", { changeFrequency: "yearly", priority: 0.3 }),
    // Services
    ...localizedEntry("/services", { changeFrequency: "monthly", priority: 0.8 }),
    ...localizedEntry("/services/dedicated-teams", { changeFrequency: "monthly", priority: 0.8 }),
    ...localizedEntry("/services/on-demand-support", { changeFrequency: "monthly", priority: 0.8 }),
    ...localizedEntry("/services/business-care-plans", { changeFrequency: "monthly", priority: 0.8 }),
    // Solutions
    ...localizedEntry("/solutions", { changeFrequency: "monthly", priority: 0.8 }),
    ...localizedEntry("/solutions/insurance", { changeFrequency: "monthly", priority: 0.7 }),
    ...localizedEntry("/solutions/finance-accounting", { changeFrequency: "monthly", priority: 0.7 }),
    ...localizedEntry("/solutions/hr-management", { changeFrequency: "monthly", priority: 0.7 }),
    ...localizedEntry("/solutions/compliance-admin", { changeFrequency: "monthly", priority: 0.7 }),
    ...localizedEntry("/solutions/technology", { changeFrequency: "monthly", priority: 0.7 }),
    ...localizedEntry("/sitemap", { changeFrequency: "weekly", priority: 0.3 }),
  ];

  // Dynamic blog posts (with locale-specific slugs)
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blog_posts.findMany({
      where: { status: "published" },
      select: {
        slug: true,
        updated_at: true,
        published_at: true,
        translations: {
          select: { locale: true, slug: true },
        },
      },
      orderBy: { published_at: "desc" },
    });

    blogPages = posts.flatMap((post) => {
      const slugMap: Record<string, string> = { en: post.slug };
      for (const tr of post.translations) {
        slugMap[tr.locale] = tr.slug;
      }

      return locales.map((locale) => ({
        url: `${SITE_URL}/${locale}/blog/${slugMap[locale] || post.slug}`,
        lastModified: post.updated_at || post.published_at || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}/blog/${slugMap[l] || post.slug}`])
          ),
        },
      }));
    });
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error);
  }

  // Dynamic job postings (with locale-specific slugs)
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const jobs = await prisma.job_postings.findMany({
      where: { status: "published" },
      select: {
        slug: true,
        updated_at: true,
        published_at: true,
        translations: {
          select: { locale: true, slug: true },
        },
      },
      orderBy: { published_at: "desc" },
    });

    jobPages = jobs.flatMap((job) => {
      const slugMap: Record<string, string> = { en: job.slug };
      for (const tr of job.translations) {
        slugMap[tr.locale] = tr.slug;
      }

      return locales.map((locale) => ({
        url: `${SITE_URL}/${locale}/careers/${slugMap[locale] || job.slug}`,
        lastModified: job.updated_at || job.published_at || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}/careers/${slugMap[l] || job.slug}`])
          ),
        },
      }));
    });
  } catch (error) {
    console.error("Error fetching job postings for sitemap:", error);
  }

  return [...staticPages, ...blogPages, ...jobPages];
}
