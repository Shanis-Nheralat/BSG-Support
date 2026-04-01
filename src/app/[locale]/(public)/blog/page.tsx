import BlogContent from "./BlogContent";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import HeroBackground from "@/components/animation/HeroBackground";
import ScrollReveal from "@/components/animation/ScrollReveal";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Blog");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-24 text-white lg:py-32">
        <HeroBackground />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center justify-center gap-2 text-sm text-white/50">
            <Link href="/" className="hover:text-white/80 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/70">Blog</span>
          </nav>

          <ScrollReveal animation="fade-in-up" duration={800}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
              {t("heroTagline")}
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-in-up" delay={150} duration={800}>
            <h1 className="font-poppins text-4xl font-bold lg:text-5xl xl:text-6xl">
              {t("heroTitle")}
            </h1>
          </ScrollReveal>

          {/* Gold accent line */}
          <ScrollReveal animation="fade-in-up" delay={250} duration={800}>
            <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gold" />
          </ScrollReveal>

          <ScrollReveal animation="fade-in-up" delay={350} duration={800}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
              {t("heroSubtitle")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <BlogContent />
    </>
  );
}
