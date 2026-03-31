import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function TermsPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Terms");

  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold">{t("title")}</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="prose-bsg mx-auto max-w-4xl px-4 lg:px-8">
          <p>{t("intro")}</p>

          <h2>{t("servicesTitle")}</h2>
          <p>{t("services")}</p>

          <h2>{t("useTitle")}</h2>
          <p>{t("use")}</p>

          <h2>{t("ipTitle")}</h2>
          <p>{t("ip")}</p>

          <h2>{t("liabilityTitle")}</h2>
          <p>{t("liability")}</p>

          <h2>{t("lawTitle")}</h2>
          <p>{t("law")}</p>

          <h2>{t("contactTitle")}</h2>
          <p>
            {t.rich("contact", {
              email: () => (
                <a href="mailto:info@backsureglobalsupport.com">
                  info@backsureglobalsupport.com
                </a>
              ),
            })}
            .
          </p>
        </div>
      </section>
    </>
  );
}
