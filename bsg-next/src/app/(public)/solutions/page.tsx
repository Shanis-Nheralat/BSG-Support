import Link from "next/link";
import { Shield, DollarSign, Users, FileCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Our Solutions",
  description:
    "Explore our tech-enabled, people-powered outsourcing solutions tailored for specific operational needs.",
};

const solutions = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Insurance Support",
    desc: "Back-office support for brokers and aggregators — from sales to claims coordination.",
    href: "/solutions/insurance",
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: "Finance & Accounting",
    desc: "End-to-end support for bookkeeping, financial reporting, and regulatory compliance.",
    href: "/solutions/finance-accounting",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Human Resource Management",
    desc: "Support for payroll, HR data entry, and onboarding operations — done right.",
    href: "/solutions/hr-management",
  },
  {
    icon: <FileCheck className="h-8 w-8" />,
    title: "Compliance & Business Admin",
    desc: "From trade license renewals to PRO services, stay fully compliant effortlessly.",
    href: "/solutions/compliance-admin",
  },
];

export default function SolutionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold lg:text-5xl">
            Our Solutions
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Explore our tech-enabled, people-powered outsourcing solutions
            tailored for specific operational needs.
          </p>
        </div>
      </section>

      {/* Solution Listings */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2">
            {solutions.map((solution) => (
              <Link
                key={solution.title}
                href={solution.href}
                className="group rounded-xl border border-gray-200 bg-white p-8 transition-all hover:border-gold hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-navy-50 p-3 text-navy group-hover:bg-gold-50 group-hover:text-gold">
                  {solution.icon}
                </div>
                <h2 className="font-poppins text-xl font-semibold text-gray-900">
                  {solution.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {solution.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy group-hover:text-gold">
                  Learn More <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold py-12">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="font-poppins text-2xl font-bold text-white">
            Looking for a tailored solution?
          </h2>
          <p className="mt-2 text-white/80">
            Let&apos;s discuss how our industry-specific support can drive your
            business forward.
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
