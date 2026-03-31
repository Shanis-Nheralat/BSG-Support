import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPolicy" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PrivacyPolicy");

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

          <h2>{t("infoCollectTitle")}</h2>
          <p>{t("infoCollect")}</p>

          <h2>{t("howWeUseTitle")}</h2>
          <ul>
            <li>{t("howWeUse1")}</li>
            <li>{t("howWeUse2")}</li>
            <li>{t("howWeUse3")}</li>
            <li>{t("howWeUse4")}</li>
          </ul>

          <h2>{t("dataSecurityTitle")}</h2>
          <p>
            {t.rich("dataSecurity", {
              link: (chunks) => (
                <Link href="/data-security">{chunks}</Link>
              ),
            })}
          </p>

          <h2>{t("thirdPartyTitle")}</h2>
          <p>{t("thirdParty")}</p>

          <h2>{t("yourRightsTitle")}</h2>
          <p>
            {t.rich("yourRights", {
              email: () => (
                <a href="mailto:info@backsureglobalsupport.com">
                  info@backsureglobalsupport.com
                </a>
              ),
            })}
          </p>

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
