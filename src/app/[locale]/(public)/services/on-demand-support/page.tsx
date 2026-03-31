import ServicePageTemplate from "@/components/ServicePageTemplate";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "OnDemand" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function OnDemandSupportPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("OnDemand");
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
        { title: t("services.pro.title"), desc: t("services.pro.desc") },
        { title: t("services.regulatory.title"), desc: t("services.regulatory.desc") },
        { title: t("services.financial.title"), desc: t("services.financial.desc") },
        { title: t("services.licensing.title"), desc: t("services.licensing.desc") },
      ]}
      benefitsTitle={t("benefitsTitle")}
      benefits={[
        { title: t("benefits.fastTurnaround.title"), desc: t("benefits.fastTurnaround.desc") },
        { title: t("benefits.payForUse.title"), desc: t("benefits.payForUse.desc") },
        { title: t("benefits.noContracts.title"), desc: t("benefits.noContracts.desc") },
        { title: t("benefits.accessProfessionals.title"), desc: t("benefits.accessProfessionals.desc") },
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
