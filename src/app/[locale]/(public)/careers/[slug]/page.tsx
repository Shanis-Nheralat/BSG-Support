import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { JobApplicationForm } from "./JobApplicationForm";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface JobDetailPageProps {
  params: { slug: string; locale: string };
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  const { slug, locale } = await params;

  // Try EN slug first, then translated slug
  let job = await prisma.job_postings.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale }, take: 1 },
    },
  });

  if (!job && locale !== "en") {
    const tr = await prisma.job_posting_translations.findFirst({
      where: { locale, slug },
      include: { job: { include: { translations: { where: { locale }, take: 1 } } } },
    });
    if (tr) {
      job = { ...tr.job, translations: [tr] } as unknown as typeof job;
    }
  }

  if (!job) {
    return { title: "Job Not Found" };
  }

  const jTr = job.translations?.[0];
  const displayTitle = jTr?.title || job.title;
  const displayDesc = jTr?.description || job.description;

  return {
    title: `${displayTitle} - Careers`,
    description: displayDesc.substring(0, 160),
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("JobDetail");

  // Try EN slug first, then translated slug
  let job = await prisma.job_postings.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale }, take: 1 },
    },
  });

  if (!job && locale !== "en") {
    const foundTr = await prisma.job_posting_translations.findFirst({
      where: { locale, slug },
      include: { job: { include: { translations: { where: { locale }, take: 1 } } } },
    });
    if (foundTr && foundTr.job.status === "published") {
      job = { ...foundTr.job, translations: [foundTr] } as unknown as typeof job;
    }
  }

  if (!job || job.status !== "published") {
    notFound();
  }

  // Overlay translated fields
  const jTr = job.translations?.[0];
  const displayTitle = jTr?.title || job.title;
  const displayLocation = jTr?.location || job.location;
  const displayDescription = jTr?.description || job.description;
  const displayRequirements = jTr?.requirements || job.requirements;
  const displayBenefits = jTr?.benefits || job.benefits;

  // Parse requirements and benefits (stored as newline-separated text)
  const requirements = displayRequirements
    ? displayRequirements.split("\n").filter((r) => r.trim())
    : [];
  const benefits = displayBenefits
    ? displayBenefits.split("\n").filter((b) => b.trim())
    : [];

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <Link
            href="/careers"
            className="mb-6 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToJobs")}
          </Link>

          {job.featured && (
            <span className="mb-4 inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold-700">
              {t("featuredPosition")}
            </span>
          )}

          <h1 className="font-poppins text-3xl font-bold lg:text-4xl">
            {displayTitle}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-white/70">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {job.department}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {displayLocation}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              {job.employment_type}
            </span>
            {job.experience && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {job.experience}
              </span>
            )}
            {job.salary_range && (
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                {job.salary_range}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="font-poppins text-xl font-semibold text-gray-900">
                  {t("aboutRole")}
                </h2>
                <div className="mt-4 prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap text-gray-600">
                    {displayDescription}
                  </p>
                </div>
              </div>

              {/* Requirements */}
              {requirements.length > 0 && (
                <div>
                  <h2 className="font-poppins text-xl font-semibold text-gray-900">
                    {t("requirements")}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <div>
                  <h2 className="font-poppins text-xl font-semibold text-gray-900">
                    {t("whatWeOffer")}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" />
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar - Application Form */}
            <div>
              <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="font-poppins text-lg font-semibold text-gray-900">
                  {t("applyForPosition")}
                </h3>
                <JobApplicationForm jobId={job.id} jobTitle={displayTitle} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
