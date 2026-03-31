import { Link } from "@/i18n/navigation";
import { ArrowRight, CheckCircle } from "lucide-react";

interface ServicePageProps {
  hero: { title: string; subtitle: string };
  intro: string;
  servicesTitle: string;
  services: { title: string; desc: string }[];
  benefitsTitle: string;
  benefits: { title: string; desc: string }[];
  audienceTitle: string;
  audience: string[];
  cta: { headline: string; text: string; button: string };
}

export default function ServicePageTemplate({
  hero,
  intro,
  servicesTitle,
  services,
  benefitsTitle,
  benefits,
  audienceTitle,
  audience,
  cta,
}: ServicePageProps) {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold lg:text-5xl">
            {hero.title}
          </h1>
          <p className="mt-4 text-lg text-white/70">{hero.subtitle}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <p className="text-lg leading-relaxed text-gray-700">{intro}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            {servicesTitle}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {services.map((s, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <h3 className="font-poppins text-lg font-semibold text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            {benefitsTitle}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-gray-900">
                    {b.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-2xl font-bold text-gray-900">
            {audienceTitle}
          </h2>
          <ul className="mt-8 space-y-3">
            {audience.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-navy" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold py-12">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="font-poppins text-2xl font-bold text-white">
            {cta.headline}
          </h2>
          <p className="mt-2 text-white/80">{cta.text}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-8 py-3 font-semibold text-white hover:bg-navy-dark"
          >
            {cta.button} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
