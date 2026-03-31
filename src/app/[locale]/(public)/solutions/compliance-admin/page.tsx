import ServicePageTemplate from "@/components/ServicePageTemplate";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "Compliance" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function ComplianceAdminPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Compliance");
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
        { title: t("services.companyFormation.title"), desc: t("services.companyFormation.desc") },
        { title: t("services.tradeLicense.title"), desc: t("services.tradeLicense.desc") },
        { title: t("services.documentPrep.title"), desc: t("services.documentPrep.desc") },
        { title: t("services.regulatoryCompliance.title"), desc: t("services.regulatoryCompliance.desc") },
      ]}
      benefitsTitle={t("benefitsTitle")}
      benefits={[
        { title: t("benefits.avoidFines.title"), desc: t("benefits.avoidFines.desc") },
        { title: t("benefits.reduceBurden.title"), desc: t("benefits.reduceBurden.desc") },
        { title: t("benefits.peaceOfMind.title"), desc: t("benefits.peaceOfMind.desc") },
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
