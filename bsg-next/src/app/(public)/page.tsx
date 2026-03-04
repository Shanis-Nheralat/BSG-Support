'use client';

import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Users,
  HeadphonesIcon,
  MessageSquare,
  Handshake,
  Target,
  ClipboardCheck,
  GitBranch,
  Zap,
  BarChart3,
} from "lucide-react";
import ScrollReveal from "@/components/animation/ScrollReveal";
import Counter from "@/components/animation/Counter";
import HeroBackground from "@/components/animation/HeroBackground";
import { HomeFAQ } from "./HomeFAQ";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-20 text-white lg:py-28">
        <HeroBackground />
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <ScrollReveal animation="fade-in-up" duration={800}>
              <h1 className="font-poppins text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
                Scale Smarter. Grow Faster.{" "}
                <span className="text-gold">with Backsure Global Support</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal animation="fade-in-up" delay={150} duration={800}>
              <p className="mt-4 text-xl font-medium text-gold">
                Trust Us as Your Strategic Partner
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fade-in-up" delay={300} duration={800}>
              <p className="mt-4 text-lg text-white/80">
                Dedicated teams and on-demand support for insurance, finance, HR
                and compliance — delivered from Dubai and Bangalore.
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fade-in-up" delay={450} duration={800}>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-semibold text-white transition-all hover:bg-gold-dark hover:shadow-lg"
                >
                  Talk to an Expert <ArrowRight className="h-4 w-4 arrow-animate" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-medium transition-all hover:border-white hover:bg-white/10"
                >
                  Learn More
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
        {/* Subtle gradient overlay for depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy via-transparent to-navy-dark/50" />
      </section>

      {/* Metrics with Counter Animation */}
      <section className="border-b border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
            <ScrollReveal animation="fade-in-up" delay={0} className="text-center">
              <p className="font-poppins text-2xl font-bold text-navy">
                <Counter end={5} suffix="+" duration={1500} />
              </p>
              <p className="mt-1 text-xs font-medium text-gray-700">Core Service Domains</p>
              <p className="mt-0.5 text-xs text-gray-500">Supporting businesses across industries</p>
            </ScrollReveal>
            <ScrollReveal animation="fade-in-up" delay={100} className="text-center">
              <p className="font-poppins text-2xl font-bold text-navy">Simple</p>
              <p className="mt-1 text-xs font-medium text-gray-700">Flexible Contract</p>
              <p className="mt-0.5 text-xs text-gray-500">Simple terms with transparent monthly billing</p>
            </ScrollReveal>
            <ScrollReveal animation="fade-in-up" delay={200} className="text-center">
              <p className="font-poppins text-2xl font-bold text-navy">Custom</p>
              <p className="mt-1 text-xs font-medium text-gray-700">Tailored Support</p>
              <p className="mt-0.5 text-xs text-gray-500">Designed to fit startups, SMEs, and large enterprises</p>
            </ScrollReveal>
            <ScrollReveal animation="fade-in-up" delay={300} className="text-center">
              <p className="font-poppins text-2xl font-bold text-navy">
                <Counter end={24} duration={1500} />/
                <Counter end={7} duration={1500} />
              </p>
              <p className="mt-1 text-xs font-medium text-gray-700">Global Support</p>
              <p className="mt-0.5 text-xs text-gray-500">Always available, wherever you are</p>
            </ScrollReveal>
            <ScrollReveal animation="fade-in-up" delay={400} className="text-center">
              <p className="font-poppins text-2xl font-bold text-navy">Positive</p>
              <p className="mt-1 text-xs font-medium text-gray-700">Client Experiences</p>
              <p className="mt-0.5 text-xs text-gray-500">Trusted by early clients and growing partnerships</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Service Models */}
      <section className="bg-gold py-12">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <ScrollReveal animation="zoom-in">
            <h2 className="font-poppins text-2xl font-bold text-white lg:text-3xl">
              Our Scalable Service Models
            </h2>
            <p className="mt-2 text-white/80">
              Explore service tiers built for growth and operational flexibility.
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fade-in-up" delay={200}>
            <Link
              href="/services/dedicated-teams"
              className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-8 py-3 font-semibold text-white transition-all hover:bg-navy-dark hover:shadow-lg"
            >
              Our Services <ArrowRight className="h-4 w-4 arrow-animate" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Leverage Our Expertise */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <ScrollReveal animation="fade-in-up">
            <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
              Leverage Our Expertise
            </h2>
          </ScrollReveal>
          <div className="mt-12 space-y-12">
            {[
              {
                icon: <ClipboardCheck className="h-8 w-8" />,
                title: "Assessment of Requirements",
                desc: "Our systematic approach to understanding your business needs ensures we deliver precisely what you need. Through detailed analysis and collaborative sessions, we map out comprehensive requirement specifications that align with your strategic goals.",
                align: "right",
              },
              {
                icon: <GitBranch className="h-8 w-8" />,
                title: "Process Mapping",
                desc: "We document and visualize your operational workflows, identifying optimization opportunities and streamlining critical processes.",
                align: "left",
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Workflow Automation",
                desc: "Streamline operational tasks through smart automation—reducing effort, improving accuracy, and enhancing your team's impact.",
                align: "right",
              },
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: "Performance Monitoring",
                desc: "We track key metrics and provide regular insights, helping you make data-driven decisions and continuously improve operations.",
                align: "left",
              },
            ].map((item, index) => (
              <ScrollReveal
                key={item.title}
                animation={item.align === "right" ? "fade-in-left" : "fade-in-right"}
                delay={index * 100}
              >
                <div
                  className={`flex flex-col items-center gap-8 md:flex-row ${
                    item.align === "left" ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 rounded-xl bg-gold-50 p-3 text-gold">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-poppins text-xl font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden w-px self-stretch bg-gray-200 md:block" />
                  <div className="flex flex-1 items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy text-white transition-transform hover:scale-110">
                      {item.icon}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why BSG */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <ScrollReveal animation="fade-in-up">
            <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
              Why BSG Support?
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Target className="h-8 w-8" />,
                title: "Results That Matter",
                desc: "Driven by outcomes, delivering measurable impact aligned with your business goals.",
              },
              {
                icon: <MessageSquare className="h-8 w-8" />,
                title: "Crystal-Clear Communication",
                desc: "Transparent, timely, and consistent communication from start to finish.",
              },
              {
                icon: <Handshake className="h-8 w-8" />,
                title: "Ongoing Partnership",
                desc: "Support continues beyond launch, evolving with your business needs.",
              },
            ].map((item, index) => (
              <ScrollReveal
                key={item.title}
                animation="fade-in-up"
                delay={index * 150}
              >
                <div className="hover-lift rounded-xl border border-gray-200 p-8 text-center">
                  <div className="mx-auto mb-4 inline-flex rounded-lg bg-navy-50 p-3 text-navy">
                    {item.icon}
                  </div>
                  <h3 className="font-poppins text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services Cards */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <ScrollReveal animation="fade-in-up">
            <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
              Explore More From Backsure
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Users className="h-8 w-8" />,
                title: "Dedicated Employee Support",
                desc: "Boost business performance with skilled, full-time teams working exclusively for you.",
                href: "/services/dedicated-teams",
              },
              {
                icon: <HeadphonesIcon className="h-8 w-8" />,
                title: "On-Demand Service Support",
                desc: "Expert help when you need it — without the overhead.",
                href: "/services/on-demand-support",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Business Care Plans",
                desc: "We manage the back office, so you can focus on growth.",
                href: "/services/business-care-plans",
              },
            ].map((service, index) => (
              <ScrollReveal
                key={service.title}
                animation="fade-in-up"
                delay={index * 150}
              >
                <Link
                  href={service.href}
                  className="group hover-lift block rounded-xl border border-gray-200 bg-white p-8 transition-all hover:border-gold"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-navy-50 p-3 text-navy transition-colors group-hover:bg-gold-50 group-hover:text-gold">
                    {service.icon}
                  </div>
                  <h3 className="font-poppins text-xl font-semibold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {service.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy group-hover:text-gold">
                    Learn more <ArrowRight className="h-3.5 w-3.5 arrow-animate" />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - imported from separate component */}
      <HomeFAQ />

      {/* CTA */}
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <ScrollReveal animation="zoom-in">
            <h2 className="font-poppins text-3xl font-bold text-white">
              Ready to Scale Smarter?
            </h2>
            <p className="mt-3 text-lg text-white/70">
              Let&apos;s create a custom support model for your business.
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fade-in-up" delay={200}>
            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-gold-dark hover:shadow-lg"
            >
              Talk to Our Team <ArrowRight className="h-5 w-5 arrow-animate" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
