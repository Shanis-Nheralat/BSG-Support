import { Link } from "@/i18n/navigation";
import { Shield, DollarSign, Users, FileCheck, Code, ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "Solutions" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function SolutionsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Solutions");
  const tc = await getTranslations("Common");

  const solutions = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: t("insurance.title"),
      desc: t("insurance.desc"),
      href: "/solutions/insurance" as const,
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: t("finance.title"),
      desc: t("finance.desc"),
      href: "/solutions/finance-accounting" as const,
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: t("hr.title"),
      desc: t("hr.desc"),
      href: "/solutions/hr-management" as const,
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: t("compliance.title"),
      desc: t("compliance.desc"),
      href: "/solutions/compliance-admin" as const,
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: t("technology.title"),
      desc: t("technology.desc"),
      href: "/solutions/technology" as const,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold lg:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-lg text-white/70">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Solution Listings */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2">
            {solutions.map((solution, i) => (
              <Link
                key={i}
                href={solution.href}
                className="group rounded-xl border border-gray-200 bg-white p-8 transition-all hover:border-gold hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-navy-50 p-3 text-navy group-hover:bg-gold-50 group-hover:text-gold-700">
                  {solution.icon}
                </div>
                <h2 className="font-poppins text-xl font-semibold text-gray-900">
                  {solution.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {solution.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy group-hover:text-gold-700">
                  {tc("learnMore")} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold py-12">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="font-poppins text-2xl font-bold text-white">
            {t("cta.title")}
          </h2>
          <p className="mt-2 text-white/80">
            {t("cta.desc")}
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-8 py-3 font-semibold text-white hover:bg-navy-dark"
          >
            {tc("contactUsToday")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
