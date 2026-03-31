import { prisma } from "@/lib/prisma";
import {
  Briefcase,
  MapPin,
  Clock,
  Award,
  Heart,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CareersApplicationForm } from "./CareersApplicationForm";
import { getTranslations, setRequestLocale } from "next-intl/server";

// Force dynamic rendering - jobs are fetched from database
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function CareersPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Careers");

  const benefits = [
    t("benefit1"), t("benefit2"), t("benefit3"), t("benefit4"), t("benefit5"),
    t("benefit6"), t("benefit7"), t("benefit8"), t("benefit9"), t("benefit10"),
  ];

  const values = [
    {
      icon: <Award className="h-7 w-7" />,
      title: t("excellenceTitle"),
      desc: t("excellenceDesc"),
    },
    {
      icon: <Heart className="h-7 w-7" />,
      title: t("integrityTitle"),
      desc: t("integrityDesc"),
    },
    {
      icon: <TrendingUp className="h-7 w-7" />,
      title: t("innovationTitle"),
      desc: t("innovationDesc"),
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: t("collaborationTitle"),
      desc: t("collaborationDesc"),
    },
  ];

  // Fetch published job postings with translations
  let rawJobs: Array<{
    id: number;
    title: string;
    slug: string;
    department: string;
    location: string;
    employment_type: string;
    experience: string | null;
    salary_range: string | null;
    description: string;
    featured: boolean;
    translations?: Array<{
      title: string;
      slug: string;
      location: string | null;
      description: string;
    }>;
  }> = [];

  try {
    rawJobs = await prisma.job_postings.findMany({
      where: { status: "published" },
      orderBy: [
        { featured: "desc" },
        { published_at: "desc" },
      ],
      include: locale !== "en" ? {
        translations: {
          where: { locale },
          select: { title: true, slug: true, location: true, description: true },
          take: 1,
        },
      } : undefined,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }

  // Overlay translations
  const jobs = rawJobs.map((job) => {
    const jTr = job.translations?.[0];
    return {
      ...job,
      title: jTr?.title || job.title,
      slug: jTr?.slug || job.slug,
      location: jTr?.location || job.location,
      description: jTr?.description || job.description,
    };
  });

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold lg:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 text-lg text-white/70">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <p className="text-lg leading-relaxed text-gray-700">
            {t("intro")}
          </p>
        </div>
      </section>

      {/* Current Openings */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            {t("currentOpenings")}
          </h2>
          
          {jobs.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  className={`rounded-xl border bg-white p-6 transition-shadow hover:shadow-lg ${
                    job.featured ? "border-gold ring-1 ring-gold/20" : "border-gray-200"
                  }`}
                >
                  {job.featured && (
                    <span className="mb-3 inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-700">
                      {t("featured")}
                    </span>
                  )}
                  <h3 className="font-poppins text-xl font-semibold text-gray-900">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{job.department}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy">
                      <Briefcase className="h-3.5 w-3.5" /> {job.employment_type}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy">
                      <MapPin className="h-3.5 w-3.5" /> {job.location}
                    </span>
                    {job.experience && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy">
                        <Clock className="h-3.5 w-3.5" /> {job.experience}
                      </span>
                    )}
                  </div>
                  
                  <p className="mt-4 line-clamp-3 text-sm text-gray-600">
                    {job.description}
                  </p>
                  
                  {job.salary_range && (
                    <p className="mt-3 text-sm font-medium text-green-600">
                      {job.salary_range}
                    </p>
                  )}
                  
                  <div className="mt-4 flex items-center gap-3">
                    <Link
                      href={`/careers/${job.slug}`}
                      className="text-sm font-medium text-navy hover:text-navy-dark"
                    >
                      {t("viewDetails")}
                    </Link>
                    <span className="text-gray-300">|</span>
                    <a
                      href={`#apply?job=${job.id}`}
                      className="text-sm font-medium text-gold-700 hover:text-gold-dark"
                    >
                      {t("applyNow")} &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 mx-auto max-w-2xl">
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 font-poppins text-xl font-semibold text-gray-900">
                  {t("noCurrentOpenings")}
                </h3>
                <p className="mt-2 text-gray-600">
                  {t("noOpeningsDesc")}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            {t("whatWeOffer")}
          </h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-white">
                  {i + 1}
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-2xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            {t("howToApply")}
          </h2>
          <CareersApplicationForm 
            jobs={jobs.map((j) => ({ id: j.id, title: j.title }))} 
          />
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            {t("ourValues")}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 inline-flex rounded-lg bg-navy-50 p-3 text-navy">
                  {v.icon}
                </div>
                <h3 className="font-poppins font-semibold text-gray-900">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
