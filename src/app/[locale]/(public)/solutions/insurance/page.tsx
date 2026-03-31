import ServicePageTemplate from "@/components/ServicePageTemplate";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "Insurance" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function InsurancePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Insurance");
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
        { title: t("services.sales.title"), desc: t("services.sales.desc") },
        { title: t("services.underwriting.title"), desc: t("services.underwriting.desc") },
        { title: t("services.policy.title"), desc: t("services.policy.desc") },
        { title: t("services.claims.title"), desc: t("services.claims.desc") },
        { title: t("services.crm.title"), desc: t("services.crm.desc") },
        { title: t("services.quotes.title"), desc: t("services.quotes.desc") },
        { title: t("services.dataEntry.title"), desc: t("services.dataEntry.desc") },
      ]}
      benefitsTitle={t("benefitsTitle")}
      benefits={[
        { title: t("benefits.industryTrained.title"), desc: t("benefits.industryTrained.desc") },
        { title: t("benefits.costSavings.title"), desc: t("benefits.costSavings.desc") },
        { title: t("benefits.clientExperience.title"), desc: t("benefits.clientExperience.desc") },
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
