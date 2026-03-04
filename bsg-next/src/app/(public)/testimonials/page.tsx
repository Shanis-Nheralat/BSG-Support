import Link from "next/link";
import { Quote, ArrowRight, Star } from "lucide-react";

export const metadata = {
  title: "Testimonials",
  description: "What our clients say about Backsure Global Support.",
};

const testimonials = [
  {
    quote:
      "BSG Support helped us streamline our insurance operations. Their dedicated support model made it feel like they were part of our in-house team.",
    attribution: "Operations Lead",
    company: "UAE-Based Insurance Aggregator",
    industry: "Insurance",
  },
  {
    quote:
      "From payroll to compliance support, their team has been a reliable extension of our business. Transparent, efficient, and truly scalable.",
    attribution: "CFO",
    company: "Regional Financial Services Firm",
    industry: "Finance",
  },
  {
    quote:
      "We needed a partner who could handle our back-office without constant supervision. BSG delivered exactly that — reliable, consistent, and always ahead of deadlines.",
    attribution: "Managing Director",
    company: "Dubai-Based Real Estate Group",
    industry: "Real Estate",
  },
  {
    quote:
      "Their onboarding process was seamless. Within two weeks, the BSG team was fully integrated into our CRM and handling client queries as if they had been with us for years.",
    attribution: "Head of Operations",
    company: "Health Insurance Brokerage",
    industry: "Insurance",
  },
  {
    quote:
      "What sets BSG apart is their ownership mindset. They don't just execute tasks — they proactively identify improvements and suggest better workflows.",
    attribution: "CEO",
    company: "E-commerce Startup, MENA Region",
    industry: "E-commerce",
  },
  {
    quote:
      "Outsourcing our HR operations to BSG was one of the best decisions we made. Payroll accuracy improved and our team could finally focus on strategic initiatives.",
    attribution: "HR Director",
    company: "Professional Services Firm",
    industry: "Professional Services",
  },
];

export default function TestimonialsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold lg:text-5xl">
            What Our Clients Say
          </h1>
          <p className="mt-4 text-lg text-white/70">
            We take pride in being a growth partner to every client we work
            with. Here&apos;s what some of them have to say.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <blockquote
                key={i}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
              >
                <Quote className="mb-4 h-8 w-8 text-gold/40" />
                <p className="flex-1 text-lg italic leading-relaxed text-gray-700">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm text-gold">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <footer className="mt-3 border-t border-gray-100 pt-4">
                  <p className="font-semibold text-navy">
                    &mdash; {t.attribution}
                  </p>
                  <p className="text-sm text-gray-500">{t.company}</p>
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
            Trusted Across Industries
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Our clients span multiple sectors, and we bring the same level of
            dedication and expertise to every partnership.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              "Insurance",
              "Finance & Banking",
              "Healthcare",
              "Real Estate",
              "E-commerce",
              "Technology",
              "Professional Services",
            ].map((industry) => (
              <span
                key={industry}
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
            Ready to become our next success story?
          </h2>
          <p className="mt-2 text-white/80">
            Let&apos;s discuss how our dedicated teams can help your business
            grow.
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
