import Link from "next/link";
import { Shield, Lock, Eye, Server, FileCheck, Trash2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Data Security",
  description:
    "How Backsure Global Support protects your information with a multi-layered security approach.",
};

export default function DataSecurityPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold lg:text-5xl">
            Data Security at Backsure Global Support
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Protecting Your Information with Confidence
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <p className="text-lg leading-relaxed text-gray-700">
            Managing business operations often involves handling sensitive,
            confidential data. We take a multi-layered security approach
            combining legal safeguards, digital protections, and physical access
            control. Every client engagement begins with a Non-Disclosure
            Agreement (NDA), and all team members sign individual
            confidentiality agreements.
          </p>
        </div>
      </section>

      {/* Framework */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            Our Data Security Framework
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <FileCheck className="h-8 w-8" />,
                title: "Legal Safeguards",
                items: [
                  "NDA signed with every client",
                  "Confidentiality agreements for all employees",
                  "Internal protocols for sensitive information",
                ],
              },
              {
                icon: <Lock className="h-8 w-8" />,
                title: "Digital Security",
                items: [
                  "End-to-end encryption for all communications",
                  "VPN tunnels for secure connectivity",
                  "Firewall protection and role-based access",
                  "Aligned with UAE PDPL and GCC privacy laws",
                ],
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Physical Security",
                items: [
                  "SmartCard and login-based entry",
                  "CCTV-monitored facilities 24/7",
                  "Controlled device usage in work areas",
                  "Regular internal audits",
                ],
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="mb-4 inline-flex rounded-lg bg-navy-50 p-3 text-navy">
                  {pillar.icon}
                </div>
                <h3 className="font-poppins text-lg font-semibold text-gray-900">
                  {pillar.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {pillar.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Access Protocols */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            Platform Access Protocols
          </h2>
          <div className="mx-auto mt-8 max-w-3xl">
            <ul className="space-y-3">
              {[
                "Dedicated user credentials with role-limited access",
                "Activity logging to ensure traceability",
                "No unauthorized downloads or local storage",
                "Immediate access revocation upon role change or offboarding",
                "Regular access reviews and permission audits",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Data Handling */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            Ongoing Data Handling
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Server className="h-6 w-6" />,
                title: "Secure Storage",
                desc: "Encrypted formats with multiple security layers to prevent unauthorized access.",
              },
              {
                icon: <Eye className="h-6 w-6" />,
                title: "Access Control",
                desc: "Strict role-based access — only authorized members can view or process specific data.",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Regular Audits",
                desc: "Scheduled security audits to verify compliance and identify potential vulnerabilities.",
              },
              {
                icon: <Trash2 className="h-6 w-6" />,
                title: "Data Destruction",
                desc: "Upon request or project completion, permanently delete client data with verification certificates.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-gray-200 p-6 text-center"
              >
                <div className="mx-auto mb-3 inline-flex rounded-lg bg-navy-50 p-2.5 text-navy">
                  {card.icon}
                </div>
                <h3 className="font-poppins font-semibold text-gray-900">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Security Measures */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            Our Comprehensive Security Measures
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Lock className="h-8 w-8" />,
                title: "Technical Security",
                desc: "Industry-leading encryption, secure networks, and advanced threat monitoring systems to protect your data at every level.",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Personnel Security",
                desc: "Rigorous background checks for all staff, regular security training, and strict access policies to ensure human-level protection.",
              },
              {
                icon: <FileCheck className="h-8 w-8" />,
                title: "Compliance Framework",
                desc: "Fully aligned with UAE PDPL and GCC privacy laws, with continuous monitoring and adaptation to evolving regulatory requirements.",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl border border-gray-200 p-6 text-center"
              >
                <div className="mx-auto mb-3 inline-flex rounded-lg bg-navy-50 p-3 text-navy">
                  {pillar.icon}
                </div>
                <h3 className="font-poppins text-lg font-semibold text-gray-900">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold py-12">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="font-poppins text-2xl font-bold text-white">
            A Reliable Partner in Data Protection
          </h2>
          <p className="mt-2 text-white/80">
            Backsure Global Support ensures your information is safe,
            confidential, and always handled with integrity.
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
