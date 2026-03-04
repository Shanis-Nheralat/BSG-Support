import Link from "next/link";
import { Users, HeadphonesIcon, Shield, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Our Services",
  description:
    "Explore our flexible outsourcing service models built for scaling businesses.",
};

const services = [
  {
    icon: <Users className="h-8 w-8" />,
    title: "Tailored Employee Solutions",
    desc: "Empower your business with skilled, dedicated teams customized for your operational needs.",
    href: "/services/dedicated-teams",
  },
  {
    icon: <HeadphonesIcon className="h-8 w-8" />,
    title: "On-Demand Service Support",
    desc: "Get critical tasks done fast and professionally with our expert support on request.",
    href: "/services/on-demand-support",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Business Care Plans",
    desc: "Manage payroll, books, and compliance with ease through our packaged service plans.",
    href: "/services/business-care-plans",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold lg:text-5xl">
            Our Services
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Explore our flexible outsourcing service models built for scaling
            businesses.
          </p>
        </div>
      </section>

      {/* Service Listings */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group rounded-xl border border-gray-200 bg-white p-8 transition-all hover:border-gold hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-navy-50 p-3 text-navy group-hover:bg-gold-50 group-hover:text-gold">
                  {service.icon}
                </div>
                <h2 className="font-poppins text-xl font-semibold text-gray-900">
                  {service.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {service.desc}
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
            Not sure which model fits your business?
          </h2>
          <p className="mt-2 text-white/80">
            Let&apos;s discuss your needs and find the right solution together.
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
