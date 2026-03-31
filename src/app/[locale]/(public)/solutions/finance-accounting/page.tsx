import ServicePageTemplate from "@/components/ServicePageTemplate";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "Finance" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function FinanceAccountingPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Finance");
  const tst = await getTranslations("ServiceTemplate");

  return (
    <ServicePageTemplate
      hero={{
        title: t("hero.title"),
        subtitle: t("hero.subtitle"),
      }}
      intro={t("intro")}
      servicesTitle={t("servicesTitle")}
      services={[
        { title: t("services.bookkeeping.title"), desc: t("services.bookkeeping.desc") },
        { title: t("services.apAr.title"), desc: t("services.apAr.desc") },
        { title: t("services.vatTax.title"), desc: t("services.vatTax.desc") },
        { title: t("services.reporting.title"), desc: t("services.reporting.desc") },
        { title: t("services.budgeting.title"), desc: t("services.budgeting.desc") },
      ]}
      benefitsTitle={t("benefitsTitle")}
      benefits={[
        { title: t("benefits.accuracy.title"), desc: t("benefits.accuracy.desc") },
        { title: t("benefits.compliance.title"), desc: t("benefits.compliance.desc") },
        { title: t("benefits.scalable.title"), desc: t("benefits.scalable.desc") },
      ]}
      audienceTitle={tst("whoPerfectFor")}
      audience={[
        t("audience.a1"),
        t("audience.a2"),
        t("audience.a3"),
        t("audience.a4"),
      ]}
      cta={{
        headline: t("cta.headline"),
        text: t("cta.text"),
        button: t("cta.button"),
      }}
    />
  );
}
