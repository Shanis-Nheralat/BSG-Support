import { Link } from "@/i18n/navigation";
import { Quote, ArrowRight, Star } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "Testimonials" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function TestimonialsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Testimonials");
  const tc = await getTranslations("Common");

  const testimonials = [
    { quote: t("t1.quote"), attribution: t("t1.attribution"), company: t("t1.company") },
    { quote: t("t2.quote"), attribution: t("t2.attribution"), company: t("t2.company") },
    { quote: t("t3.quote"), attribution: t("t3.attribution"), company: t("t3.company") },
    { quote: t("t4.quote"), attribution: t("t4.attribution"), company: t("t4.company") },
    { quote: t("t5.quote"), attribution: t("t5.attribution"), company: t("t5.company") },
    { quote: t("t6.quote"), attribution: t("t6.attribution"), company: t("t6.company") },
  ];

  const industries = [
    t("industries.insurance"),
    t("industries.finance"),
    t("industries.healthcare"),
    t("industries.realEstate"),
    t("industries.ecommerce"),
    t("industries.technology"),
    t("industries.professionalServices"),
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

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((item, i) => (
              <blockquote
                key={i}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
              >
                <Quote className="mb-4 h-8 w-8 text-gold/40" />
                <p className="flex-1 text-lg italic leading-relaxed text-gray-700">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm text-gold">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <footer className="mt-3 border-t border-gray-100 pt-4">
                  <p className="font-semibold text-navy">
                    &mdash; {item.attribution}
                  </p>
                  <p className="text-sm text-gray-500">{item.company}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="font-poppins text-3xl font-bold text-gray-900">
            {t("industriesTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            {t("industriesSubtitle")}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {industries.map((industry, i) => (
              <span
                key={i}
                className="rounded-full border border-navy/20 bg-white px-5 py-2 text-sm font-medium text-navy"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold py-12">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="font-poppins text-2xl font-bold text-white">
            {t("cta.title")}
          </h2>
          <p className="mt-2 text-white/80">
            {t("cta.desc")}
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-8 py-3 font-semibold text-white hover:bg-navy-dark"
          >
            {tc("contactUsToday")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
