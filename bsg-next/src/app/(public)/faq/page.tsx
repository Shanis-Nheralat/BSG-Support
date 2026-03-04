"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "What is a Dedicated Virtual Team?",
    a: "A group of professionals who work exclusively for your company but operate remotely. They function as an extension of your organization, handling specific backend tasks and integrating seamlessly with your existing workflows and systems. Unlike freelancers, they focus solely on your business needs.",
  },
  {
    q: "How to choose the right outsourcing partner for your backend operations?",
    a: "Define your specific operational needs and goals. Research potential firms and assess their expertise in your industry. Consider cultural fit and scalability options. Verify quality assurance and data security measures. Evaluate support services and response times. Align costs with your budget and request case studies or client references.",
  },
  {
    q: "What are the pros and cons of working with a dedicated virtual team?",
    a: "Pros include cost efficiency (40-60% savings vs. local hiring), access to a global talent pool, easy scalability, reduced administrative burden, and time zone advantages. Cons can include communication challenges across time zones, initial setup investment, and less direct day-to-day oversight. At BSG, we actively address these through communication protocols, thorough onboarding, and cultural training.",
  },
  {
    q: "What roles are typically included in a dedicated backend support team?",
    a: "Common roles include Data Entry Specialists, Administrative Assistants, CRM Managers, Virtual Assistants, Recruitment Coordinators, Document Processors, Customer Support Representatives, and Research Analysts.",
  },
  {
    q: "How do you ensure data security when working with an outsourced team?",
    a: "We enforce strict NDAs and confidentiality agreements, secure access controls and authentication protocols, regular security training, monitored network infrastructure, compliance with data protection regulations, regular security audits, secure file sharing platforms, and data encryption for sensitive information.",
  },
  {
    q: "What industries do you primarily serve?",
    a: "We serve Insurance (policy administration, claims processing), Finance & Banking (transaction processing, compliance), Healthcare (records management, billing), Real Estate (listing management, document processing), E-commerce (order processing, inventory), Technology (administrative support, onboarding), and Professional Services (CRM administration, research).",
  },
  {
    q: "How do you handle the onboarding process for new clients?",
    a: "Our 8-step process: Discovery discussions, Team Assembly with the right skills, System Setup for tools and access, Comprehensive Training, a Pilot Phase to refine processes, a Feedback Loop with regular check-ins, gradual Scale Up, and Ongoing Support with continuous quality checks.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold lg:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Get answers to common questions about our services
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-gray-200"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left hover:bg-gray-50"
                >
                  <span className="pr-4 font-poppins text-base font-semibold text-gray-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === i && (
                  <div className="border-t border-gray-100 px-6 py-5">
                    <p className="text-sm leading-relaxed text-gray-600">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold py-12">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="font-poppins text-2xl font-bold text-white">
            Still have questions about our dedicated teams?
          </h2>
          <p className="mt-2 text-white/80">
            Let&apos;s discuss your specific needs and how our backend support
            solutions can help you scale efficiently.
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
