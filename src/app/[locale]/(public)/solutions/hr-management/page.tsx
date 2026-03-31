import ServicePageTemplate from "@/components/ServicePageTemplate";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "HR" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function HRManagementPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("HR");
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
        { title: t("services.attendance.title"), desc: t("services.attendance.desc") },
        { title: t("services.onboarding.title"), desc: t("services.onboarding.desc") },
        { title: t("services.performance.title"), desc: t("services.performance.desc") },
        { title: t("services.statutory.title"), desc: t("services.statutory.desc") },
      ]}
      benefitsTitle={t("benefitsTitle")}
      benefits={[
        { title: t("benefits.reduceWorkload.title"), desc: t("benefits.reduceWorkload.desc") },
        { title: t("benefits.complianceControl.title"), desc: t("benefits.complianceControl.desc") },
        { title: t("benefits.employeeExperience.title"), desc: t("benefits.employeeExperience.desc") },
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
