import ServicePageTemplate from "@/components/ServicePageTemplate";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "BusinessCare" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function BusinessCarePlansPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("BusinessCare");
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
        { title: t("services.payroll.title"), desc: t("services.payroll.desc") },
        { title: t("services.bookkeeping.title"), desc: t("services.bookkeeping.desc") },
        { title: t("services.hrRecords.title"), desc: t("services.hrRecords.desc") },
        { title: t("services.compliancePRO.title"), desc: t("services.compliancePRO.desc") },
      ]}
      benefitsTitle={t("benefitsTitle")}
      benefits={[
        { title: t("benefits.simplified.title"), desc: t("benefits.simplified.desc") },
        { title: t("benefits.costEffective.title"), desc: t("benefits.costEffective.desc") },
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
