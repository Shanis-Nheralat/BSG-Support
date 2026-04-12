import { Link } from "@/i18n/navigation";
import { Mail, ArrowRight, Linkedin, Settings, HeadphonesIcon, Code, Users, Handshake, Lightbulb } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";

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
      name: "Muhammed Shanis Nheralat",
      role: t("leader1.role"),
      email: "shanis@backsureglobalsupport.com",
      linkedin: "https://www.linkedin.com/in/muhammedshanis592/",
      bio: t("leader1.bio"),
      image: "/images/team/shanis-nheralat.jpg",
    },
  ];

  const departments = [
    { icon: <Settings className="h-6 w-6" />, title: t("departments.operations.title"), desc: t("departments.operations.desc") },
    { icon: <HeadphonesIcon className="h-6 w-6" />, title: t("departments.clientSuccess.title"), desc: t("departments.clientSuccess.desc") },
    { icon: <Code className="h-6 w-6" />, title: t("departments.technology.title"), desc: t("departments.technology.desc") },
    { icon: <Users className="h-6 w-6" />, title: t("departments.hr.title"), desc: t("departments.hr.desc") },
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
          <div className="mx-auto mt-12 max-w-3xl">
            {leadership.map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-gray-200 p-8 md:flex md:items-start md:gap-8 md:text-left"
              >
                {/* Photo */}
                <div className="mx-auto mb-6 h-40 w-40 flex-shrink-0 overflow-hidden rounded-full border-4 border-navy/10 md:mx-0 md:mb-0">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={160}
                    height={160}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>

                {/* Info */}
                <div className="text-center md:text-left">
                  <h3 className="font-poppins text-2xl font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="mt-1 font-medium text-gold-700">{member.role}</p>
                  <p className="mt-4 text-sm leading-relaxed text-gray-600">
                    {member.bio}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 text-sm text-navy hover:text-gold"
                    >
                      <Mail className="h-4 w-4" />
                      {member.email}
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-navy hover:text-gold"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold">
            {t("valuesTitle")}
          </h2>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 p-8">
              <div className="mb-3 inline-flex rounded-lg bg-gold/20 p-2">
                <Handshake className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-poppins text-xl font-semibold">{t("values.partnership.title")}</h3>
              <p className="mt-2 text-white/70">
                {t("values.partnership.desc")}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 p-8">
              <div className="mb-3 inline-flex rounded-lg bg-gold/20 p-2">
                <Lightbulb className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-poppins text-xl font-semibold">{t("values.problemSolving.title")}</h3>
              <p className="mt-2 text-white/70">
                {t("values.problemSolving.desc")}
              </p>
            </div>
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
                className="hover-lift rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="mb-4 inline-flex rounded-lg bg-navy-50 p-3 text-navy">
                  {dept.icon}
                </div>
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
