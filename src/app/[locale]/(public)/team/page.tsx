import { Link } from "@/i18n/navigation";
import { Mail, ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "Team" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function TeamPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Team");

  const leadership = [
    {
      initials: "MS",
      name: "Muhammed Shanis Nheralat",
      role: t("leader1.role"),
      email: "shanisnheralat@gmail.com",
      bio: t("leader1.bio"),
    },
  ];

  const departments = [
    { title: t("departments.operations.title"), desc: t("departments.operations.desc") },
    { title: t("departments.clientSuccess.title"), desc: t("departments.clientSuccess.desc") },
    { title: t("departments.technology.title"), desc: t("departments.technology.desc") },
    { title: t("departments.hr.title"), desc: t("departments.hr.desc") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold lg:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-lg text-white/70">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            {t("leadershipTitle")}
          </h2>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-1">
            {leadership.map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-gray-200 p-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-navy text-3xl font-bold text-white">
                  {member.initials}
                </div>
                <h3 className="font-poppins text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="mt-1 font-medium text-gold-700">{member.role}</p>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-600">
                  {member.bio}
                </p>
                <a
                  href={`mailto:${member.email}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-navy hover:text-gold"
                >
                  <Mail className="h-4 w-4" />
                  {member.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            {t("departmentsTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            {t("departmentsSubtitle")}
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {departments.map((dept, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <h3 className="font-poppins text-lg font-semibold text-gray-900">
                  {dept.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {dept.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="bg-gold py-12">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="font-poppins text-2xl font-bold text-white">
            {t("cta.title")}
          </h2>
          <p className="mt-2 text-white/80">
            {t("cta.desc")}
          </p>
          <Link
            href="/careers"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-8 py-3 font-semibold text-white hover:bg-navy-dark"
          >
            {t("cta.button")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
