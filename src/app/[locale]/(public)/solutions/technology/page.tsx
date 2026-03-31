import ServicePageTemplate from "@/components/ServicePageTemplate";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "Technology" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function TechnologySolutionsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Technology");
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
        { title: t("services.customDev.title"), desc: t("services.customDev.desc") },
        { title: t("services.appSupport.title"), desc: t("services.appSupport.desc") },
        { title: t("services.automation.title"), desc: t("services.automation.desc") },
        { title: t("services.uiux.title"), desc: t("services.uiux.desc") },
        { title: t("services.dataReporting.title"), desc: t("services.dataReporting.desc") },
        { title: t("services.integration.title"), desc: t("services.integration.desc") },
      ]}
      benefitsTitle={t("benefitsTitle")}
      benefits={[
        { title: t("benefits.endToEnd.title"), desc: t("benefits.endToEnd.desc") },
        { title: t("benefits.businessFirst.title"), desc: t("benefits.businessFirst.desc") },
        { title: t("benefits.recurringPartnership.title"), desc: t("benefits.recurringPartnership.desc") },
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
