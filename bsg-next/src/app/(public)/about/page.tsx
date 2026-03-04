import Link from "next/link";
import { Shield, Users, Lightbulb, ArrowRight, Eye, Target } from "lucide-react";

export const metadata = {
  title: "About Us",
  description:
    "Get to know Backsure Global Support — your smart backend partner for scalable growth.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold lg:text-5xl">
            Get to Know Backsure Global Support
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Your Smart Backend Partner for Scalable Growth
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <p className="text-lg leading-relaxed text-gray-700">
            BSG Support is a new-age backend support company offering{" "}
            <strong>dedicated virtual teams</strong> to businesses across
            sectors — from startups to growing enterprises. We handle data
            processing, admin support, CRM management, recruitment coordination,
            and recurring tasks. Our teams are trained to integrate smoothly into
            your workflows and deliver results from day one.
          </p>
        </div>
      </section>

      {/* Core Purpose, Vision & Mission */}
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold">
              Core Purpose
            </p>
            <h2 className="mt-2 font-poppins text-3xl font-bold">
              Powering businesses, to create a thriving global community
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 p-8">
              <div className="mb-3 inline-flex rounded-lg bg-gold/20 p-2">
                <Eye className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-poppins text-xl font-semibold">Our Vision</h3>
              <p className="mt-2 text-white/70">
                To connect the business world to skilled people globally.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 p-8">
              <div className="mb-3 inline-flex rounded-lg bg-gold/20 p-2">
                <Target className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-poppins text-xl font-semibold">Our Mission</h3>
              <p className="mt-2 text-white/70">
                To be the partner of choice for corporate growth, by enabling
                businesses to leverage the best global resources at the right
                price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              "We act and operate as a true reflection of our clients while promoting continuous improvement.",
              "We deliver unique solutions to exceed expectations and our clients\u2019 strategic objectives.",
              "We maintain superior facilities and infrastructure to ensure operational stability and seamless delivery.",
              "We protect our clients\u2019 brands by employing industry best practices and control mechanisms for compliance.",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-gray-200 p-6"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-gray-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            Who We Are
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-gray-600">
            Founded with a clear vision to empower businesses by taking care of
            their back office, we provide highly trained, reliable, and
            cost-effective virtual teams based in India. We support companies
            worldwide, helping with non-core but business-critical tasks that
            slow down internal teams.
          </p>
        </div>
      </section>

      {/* Why Choose BSG */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            Why Choose Backsure Global Support
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Industry-Ready Teams",
                desc: "Trained in industry tools, workflows, and compliance standards across tech, healthcare, real estate, and education.",
              },
              {
                title: "Flexible Engagement Models",
                desc: "Project-based, dedicated resources, or monthly subscription support — choose what works for you.",
              },
              {
                title: "Seamless Integration",
                desc: "Our backend teams blend into your operations and collaborate via your systems and CRMs.",
              },
              {
                title: "Smart Processes + Human Touch",
                desc: "Tech where it matters, people where it counts. Efficiency with empathy.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <h3 className="font-poppins text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            Our Core Values
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Shield className="h-8 w-8" />,
                title: "We are Safe",
                subtitle: "Genuine Care",
                desc: "We treat our clients, teams, and customers with respect, empathy, and professionalism.",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "We are Flexible",
                subtitle: "Ownership Mindset",
                desc: "We take full responsibility — like internal teams would.",
              },
              {
                icon: <Lightbulb className="h-8 w-8" />,
                title: "We are Innovative",
                subtitle: "Transparency & Trust",
                desc: "Clear communication, honest updates, no surprises.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-gray-200 p-8 text-center"
              >
                <div className="mx-auto mb-4 inline-flex rounded-lg bg-navy-50 p-3 text-navy">
                  {v.icon}
                </div>
                <h3 className="font-poppins text-xl font-semibold text-gray-900">
                  {v.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-gold">{v.subtitle}</p>
                <p className="mt-3 text-sm text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold py-12">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="font-poppins text-2xl font-bold text-white">
            Ready to empower your business with smart backend support?
          </h2>
          <p className="mt-2 text-white/80">
            Let&apos;s discuss how our dedicated teams can help you scale
            efficiently.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-8 py-3 font-semibold text-white hover:bg-navy-dark"
          >
            Contact Us Today <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
