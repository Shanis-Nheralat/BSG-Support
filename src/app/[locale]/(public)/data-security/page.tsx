import { Link } from "@/i18n/navigation";
import { Shield, Lock, Eye, Server, FileCheck, Trash2, ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "DataSecurity" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function DataSecurityPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("DataSecurity");
  const tc = await getTranslations("Common");

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

      {/* Introduction */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <p className="text-lg leading-relaxed text-gray-700">
            {t("intro")}
          </p>
        </div>
      </section>

      {/* Framework */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            {t("framework.title")}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <FileCheck className="h-8 w-8" />,
                title: t("framework.legal.title"),
                items: [
                  t("framework.legal.item1"),
                  t("framework.legal.item2"),
                  t("framework.legal.item3"),
                ],
              },
              {
                icon: <Lock className="h-8 w-8" />,
                title: t("framework.digital.title"),
                items: [
                  t("framework.digital.item1"),
                  t("framework.digital.item2"),
                  t("framework.digital.item3"),
                  t("framework.digital.item4"),
                ],
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: t("framework.physical.title"),
                items: [
                  t("framework.physical.item1"),
                  t("framework.physical.item2"),
                  t("framework.physical.item3"),
                  t("framework.physical.item4"),
                ],
              },
            ].map((pillar, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="mb-4 inline-flex rounded-lg bg-navy-50 p-3 text-navy">
                  {pillar.icon}
                </div>
                <h3 className="font-poppins text-lg font-semibold text-gray-900">
                  {pillar.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {pillar.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Access Protocols */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            {t("accessProtocols.title")}
          </h2>
          <div className="mx-auto mt-8 max-w-3xl">
            <ul className="space-y-3">
              {[
                t("accessProtocols.item1"),
                t("accessProtocols.item2"),
                t("accessProtocols.item3"),
                t("accessProtocols.item4"),
                t("accessProtocols.item5"),
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Data Handling */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            {t("dataHandling.title")}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Server className="h-6 w-6" />,
                title: t("dataHandling.secureStorage.title"),
                desc: t("dataHandling.secureStorage.desc"),
              },
              {
                icon: <Eye className="h-6 w-6" />,
                title: t("dataHandling.accessControl.title"),
                desc: t("dataHandling.accessControl.desc"),
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: t("dataHandling.regularAudits.title"),
                desc: t("dataHandling.regularAudits.desc"),
              },
              {
                icon: <Trash2 className="h-6 w-6" />,
                title: t("dataHandling.dataDestruction.title"),
                desc: t("dataHandling.dataDestruction.desc"),
              },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 p-6 text-center"
              >
                <div className="mx-auto mb-3 inline-flex rounded-lg bg-navy-50 p-2.5 text-navy">
                  {card.icon}
                </div>
                <h3 className="font-poppins font-semibold text-gray-900">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Security Measures */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            {t("comprehensiveMeasures.title")}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Lock className="h-8 w-8" />,
                title: t("comprehensiveMeasures.technical.title"),
                desc: t("comprehensiveMeasures.technical.desc"),
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: t("comprehensiveMeasures.personnel.title"),
                desc: t("comprehensiveMeasures.personnel.desc"),
              },
              {
                icon: <FileCheck className="h-8 w-8" />,
                title: t("comprehensiveMeasures.compliance.title"),
                desc: t("comprehensiveMeasures.compliance.desc"),
              },
            ].map((pillar, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 p-6 text-center"
              >
                <div className="mx-auto mb-3 inline-flex rounded-lg bg-navy-50 p-3 text-navy">
                  {pillar.icon}
                </div>
                <h3 className="font-poppins text-lg font-semibold text-gray-900">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{pillar.desc}</p>
              </div>
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
