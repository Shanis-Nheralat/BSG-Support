"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What types of businesses do you support?",
    a: "From early-stage startups to enterprises, across all industries. Our flexible service models allow us to tailor our approach to your specific needs, regardless of your company size or sector.",
  },
  {
    q: "How does your pricing structure work?",
    a: "Monthly billing. Flexible terms. Fully customized quotes. We offer transparent pricing based on the service model you choose and the level of support required, allowing for predictable budgeting without unnecessary overhead.",
  },
  {
    q: "What makes Backsure different from other providers?",
    a: "We\u2019re a partner\u2014not just a service vendor. Measurable results and growth-focused. Unlike traditional outsourcing companies, we position ourselves as a strategic partner focused on your business growth with a results-driven approach that evolves with your needs.",
  },
  {
    q: "How quickly can you start?",
    a: "1\u20132 week onboarding depending on complexity. Faster for urgent needs. We begin with a thorough assessment, followed by process mapping and team alignment. For urgent requirements, we can expedite certain services while completing the full onboarding process.",
  },
  {
    q: "How do you ensure data security?",
    a: "Global security protocols, encryption, and strict confidentiality measures. We implement industry-standard security practices and can adapt to your specific requirements, providing detailed documentation of our security measures upon request.",
  },
];

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
          Have Questions? We&apos;ve Got Answers.
        </h2>
        <p className="mt-3 text-center text-gray-600">
          A quick look at some common queries about Backsure&apos;s solutions and services.
        </p>
        <div className="mt-10 space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-lg border border-gray-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex w-full items-center justify-between px-6 py-4 text-left font-medium text-gray-900 hover:bg-gray-50"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 text-sm leading-relaxed text-gray-600">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
