import { Link } from "@/i18n/navigation";
import { Users, HeadphonesIcon, Shield, ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "Services" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function ServicesPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Services");
  const tc = await getTranslations("Common");

  const services = [
    {
      icon: <Users className="h-8 w-8" />,
      title: t("tailoredEmployee.title"),
      desc: t("tailoredEmployee.desc"),
      href: "/services/dedicated-teams" as const,
    },
    {
      icon: <HeadphonesIcon className="h-8 w-8" />,
      title: t("onDemand.title"),
      desc: t("onDemand.desc"),
      href: "/services/on-demand-support" as const,
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t("businessCare.title"),
      desc: t("businessCare.desc"),
      href: "/services/business-care-plans" as const,
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

      {/* Service Listings */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service, i) => (
              <Link
                key={i}
                href={service.href}
                className="group rounded-xl border border-gray-200 bg-white p-8 transition-all hover:border-gold hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-navy-50 p-3 text-navy group-hover:bg-gold-50 group-hover:text-gold-700">
                  {service.icon}
                </div>
                <h2 className="font-poppins text-xl font-semibold text-gray-900">
                  {service.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {service.desc}
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
