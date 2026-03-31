import { Link } from "@/i18n/navigation";
import { Shield, Users, Lightbulb, ArrowRight, Eye, Target } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "About" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("About");
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

      {/* Core Purpose, Vision & Mission */}
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-700">
              {t("corePurpose.label")}
            </p>
            <h2 className="mt-2 font-poppins text-3xl font-bold">
              {t("corePurpose.title")}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 p-8">
              <div className="mb-3 inline-flex rounded-lg bg-gold/20 p-2">
                <Eye className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-poppins text-xl font-semibold">{t("vision.title")}</h3>
              <p className="mt-2 text-white/70">
                {t("vision.desc")}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 p-8">
              <div className="mb-3 inline-flex rounded-lg bg-gold/20 p-2">
                <Target className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-poppins text-xl font-semibold">{t("mission.title")}</h3>
              <p className="mt-2 text-white/70">
                {t("mission.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              t("valuePillars.v1"),
              t("valuePillars.v2"),
              t("valuePillars.v3"),
              t("valuePillars.v4"),
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-gray-200 p-6"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-gray-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            {t("whoWeAre.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-gray-600">
            {t("whoWeAre.desc")}
          </p>
        </div>
      </section>

      {/* Why Choose BSG */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            {t("whyChoose.title")}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: t("whyChoose.industryReadyTeams.title"), desc: t("whyChoose.industryReadyTeams.desc") },
              { title: t("whyChoose.flexibleEngagement.title"), desc: t("whyChoose.flexibleEngagement.desc") },
              { title: t("whyChoose.seamlessIntegration.title"), desc: t("whyChoose.seamlessIntegration.desc") },
              { title: t("whyChoose.smartProcesses.title"), desc: t("whyChoose.smartProcesses.desc") },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <h3 className="font-poppins text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            {t("coreValues.title")}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Shield className="h-8 w-8" />,
                title: t("coreValues.safe.title"),
                subtitle: t("coreValues.safe.subtitle"),
                desc: t("coreValues.safe.desc"),
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: t("coreValues.flexible.title"),
                subtitle: t("coreValues.flexible.subtitle"),
                desc: t("coreValues.flexible.desc"),
              },
              {
                icon: <Lightbulb className="h-8 w-8" />,
                title: t("coreValues.innovative.title"),
                subtitle: t("coreValues.innovative.subtitle"),
                desc: t("coreValues.innovative.desc"),
              },
            ].map((v, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 p-8 text-center"
              >
                <div className="mx-auto mb-4 inline-flex rounded-lg bg-navy-50 p-3 text-navy">
                  {v.icon}
                </div>
                <h3 className="font-poppins text-xl font-semibold text-gray-900">
                  {v.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-gold-700">{v.subtitle}</p>
                <p className="mt-3 text-sm text-gray-600">{v.desc}</p>
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
