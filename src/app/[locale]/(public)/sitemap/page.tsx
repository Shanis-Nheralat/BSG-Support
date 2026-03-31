import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Home,
  Info,
  Phone,
  BookOpen,
  Calculator,
  Briefcase,
  HelpCircle,
  Users,
  MessageSquare,
  Shield,
  FileText,
  ScrollText,
  Layers,
  Cpu,
  Building2,
  DollarSign,
  UserCog,
  ClipboardCheck,
  ExternalLink,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SitemapPage" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function SitemapPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("SitemapPage");

  const staticPages = [
    { label: t("pageHome"), href: "/", icon: Home },
    { label: t("pageAbout"), href: "/about", icon: Info },
    { label: t("pageContact"), href: "/contact", icon: Phone },
    { label: t("pageBlog"), href: "/blog", icon: BookOpen },
    { label: t("pageCalculator"), href: "/calculator", icon: Calculator },
    { label: t("pageCareers"), href: "/careers", icon: Briefcase },
    { label: t("pageFaq"), href: "/faq", icon: HelpCircle },
    { label: t("pageTeam"), href: "/team", icon: Users },
    { label: t("pageTestimonials"), href: "/testimonials", icon: MessageSquare },
    { label: t("pageDataSecurity"), href: "/data-security", icon: Shield },
    { label: t("pagePrivacyPolicy"), href: "/privacy-policy", icon: FileText },
    { label: t("pageTerms"), href: "/terms", icon: ScrollText },
  ];

  const servicePages = [
    { label: t("pageServices"), href: "/services", icon: Layers },
    { label: t("pageDedicatedTeams"), href: "/services/dedicated-teams", icon: Users },
    { label: t("pageOnDemand"), href: "/services/on-demand-support", icon: Phone },
    { label: t("pageBusinessCare"), href: "/services/business-care-plans", icon: Briefcase },
  ];

  const solutionPages = [
    { label: t("pageSolutions"), href: "/solutions", icon: Layers },
    { label: t("pageInsurance"), href: "/solutions/insurance", icon: Building2 },
    { label: t("pageFinance"), href: "/solutions/finance-accounting", icon: DollarSign },
    { label: t("pageHR"), href: "/solutions/hr-management", icon: UserCog },
    { label: t("pageCompliance"), href: "/solutions/compliance-admin", icon: ClipboardCheck },
    { label: t("pageTechnology"), href: "/solutions/technology", icon: Cpu },
  ];

  // Fetch published blog posts
  const blogPosts = await prisma.blog_posts.findMany({
    where: { status: "published" },
    select: { title: true, slug: true, published_at: true },
    orderBy: { published_at: "desc" },
  });

  // Fetch published job postings
  const jobPostings = await prisma.job_postings.findMany({
    where: { status: "published" },
    select: { title: true, slug: true, department: true },
    orderBy: { published_at: "desc" },
  });

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-white/70">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Sitemap Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {/* Main Pages */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 font-poppins text-xl font-bold text-gray-900">
                <Home className="h-5 w-5 text-navy" />
                {t("mainPages")}
              </h2>
              <ul className="space-y-2">
                {staticPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <li key={page.href}>
                      <Link
                        href={page.href}
                        className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-navy-50 hover:text-navy"
                      >
                        <Icon className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-navy" />
                        {page.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 font-poppins text-xl font-bold text-gray-900">
                <Layers className="h-5 w-5 text-navy" />
                {t("servicesHeading")}
              </h2>
              <ul className="space-y-2">
                {servicePages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <li key={page.href}>
                      <Link
                        href={page.href}
                        className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-navy-50 hover:text-navy"
                      >
                        <Icon className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-navy" />
                        {page.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <h2 className="mb-4 mt-10 flex items-center gap-2 font-poppins text-xl font-bold text-gray-900">
                <Building2 className="h-5 w-5 text-navy" />
                {t("solutionsHeading")}
              </h2>
              <ul className="space-y-2">
                {solutionPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <li key={page.href}>
                      <Link
                        href={page.href}
                        className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-navy-50 hover:text-navy"
                      >
                        <Icon className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-navy" />
                        {page.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Dynamic Content */}
            <div>
              {/* Blog Posts */}
              <h2 className="mb-4 flex items-center gap-2 font-poppins text-xl font-bold text-gray-900">
                <BookOpen className="h-5 w-5 text-navy" />
                {t("blogPosts")}
              </h2>
              {blogPosts.length > 0 ? (
                <ul className="space-y-2">
                  {blogPosts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex items-start gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-navy-50 hover:text-navy"
                      >
                        <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-navy" />
                        <span>{post.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 text-sm text-gray-500">
                  {t("noBlogPosts")}
                </p>
              )}

              {/* Job Postings */}
              <h2 className="mb-4 mt-10 flex items-center gap-2 font-poppins text-xl font-bold text-gray-900">
                <Briefcase className="h-5 w-5 text-navy" />
                {t("openPositions")}
              </h2>
              {jobPostings.length > 0 ? (
                <ul className="space-y-2">
                  {jobPostings.map((job) => (
                    <li key={job.slug}>
                      <Link
                        href={`/careers/${job.slug}`}
                        className="group flex items-start gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-navy-50 hover:text-navy"
                      >
                        <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-navy" />
                        <div>
                          <span>{job.title}</span>
                          <span className="ml-2 text-xs text-gray-400">
                            {job.department}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 text-sm text-gray-500">
                  {t("noOpenPositions")}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* XML Sitemap Reference */}
      <section className="border-t border-gray-200 bg-gray-50 py-10">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <p className="text-sm text-gray-500">
            {t("xmlSitemapText")}{" "}
            <Link
              href="/sitemap.xml"
              className="font-medium text-navy hover:underline"
            >
              {t("viewSitemapXml")}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
