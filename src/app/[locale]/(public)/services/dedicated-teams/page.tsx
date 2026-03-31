import ServicePageTemplate from "@/components/ServicePageTemplate";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "DedicatedTeams" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function DedicatedTeamsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("DedicatedTeams");
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
        { title: t("services.fullTime.title"), desc: t("services.fullTime.desc") },
        { title: t("services.aligned.title"), desc: t("services.aligned.desc") },
        { title: t("services.handpicked.title"), desc: t("services.handpicked.desc") },
        { title: t("services.infrastructure.title"), desc: t("services.infrastructure.desc") },
      ]}
      benefitsTitle={t("benefitsTitle")}
      benefits={[
        { title: t("benefits.lowerCosts.title"), desc: t("benefits.lowerCosts.desc") },
        { title: t("benefits.fullControl.title"), desc: t("benefits.fullControl.desc") },
        { title: t("benefits.quickScaleUp.title"), desc: t("benefits.quickScaleUp.desc") },
        { title: t("benefits.transparency.title"), desc: t("benefits.transparency.desc") },
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
