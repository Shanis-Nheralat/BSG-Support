'use client';

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
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
  DollarSign,
  FileCheck,
  Code,
} from "lucide-react";
import ScrollReveal from "@/components/animation/ScrollReveal";
import Counter from "@/components/animation/Counter";
import HeroBackground from "@/components/animation/HeroBackground";
import HeroScheduler from "@/components/HeroScheduler";
import { HomeFAQ } from "./HomeFAQ";

export default function HomePageContent() {
  const t = useTranslations("Home");
  const tc = useTranslations("Common");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-20 text-white lg:py-28">
        <HeroBackground />
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
            {/* Left column — text content */}
            <div className="max-w-2xl lg:flex-1">
              <ScrollReveal animation="fade-in-up" duration={800}>
                <h1 className="font-poppins text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
                  {t("hero.title")}{" "}
                  <span className="text-gold">{t("hero.titleHighlight")}</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal animation="fade-in-up" delay={150} duration={800}>
                <p className="mt-4 text-xl font-medium text-gold">
                  {t("hero.subtitle")}
                </p>
              </ScrollReveal>
              <ScrollReveal animation="fade-in-up" delay={300} duration={800}>
                <p className="mt-4 text-lg text-white/80">
                  {t("hero.description")}
                </p>
              </ScrollReveal>
              <ScrollReveal animation="fade-in-up" delay={450} duration={800}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-semibold text-white transition-all hover:bg-gold-dark hover:shadow-lg"
                  >
                    {tc("talkToAnExpert")} <ArrowRight className="h-4 w-4 arrow-animate" />
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-medium transition-all hover:border-white hover:bg-white/10"
                  >
                    {tc("learnMore")}
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Right column — scheduler widget */}
            <div className="w-full lg:max-w-md lg:flex-shrink-0">
              <ScrollReveal animation="fade-in-up" delay={300} duration={800}>
                <HeroScheduler />
              </ScrollReveal>
            </div>
          </div>
        </div>
        {/* Subtle gradient overlay for depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy via-transparent to-navy-dark/50" />
      </section>

      {/* Metrics with Counter Animation */}
      <section className="border-b border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5">
            <ScrollReveal animation="fade-in-up" delay={0} className="text-center">
              <p className="font-poppins text-2xl font-bold text-navy">
                <Counter end={5} suffix="+" duration={1500} />
              </p>
              <p className="mt-1 text-xs font-medium text-gray-700">{t("metrics.coreServiceDomains")}</p>
              <p className="mt-0.5 text-xs text-gray-500">{t("metrics.coreServiceDomainsDesc")}</p>
            </ScrollReveal>
            <ScrollReveal animation="fade-in-up" delay={100} className="text-center">
              <p className="font-poppins text-2xl font-bold text-navy">{t("metrics.simple")}</p>
              <p className="mt-1 text-xs font-medium text-gray-700">{t("metrics.flexibleContract")}</p>
              <p className="mt-0.5 text-xs text-gray-500">{t("metrics.flexibleContractDesc")}</p>
            </ScrollReveal>
            <ScrollReveal animation="fade-in-up" delay={200} className="text-center">
              <p className="font-poppins text-2xl font-bold text-navy">{t("metrics.custom")}</p>
              <p className="mt-1 text-xs font-medium text-gray-700">{t("metrics.tailoredSupport")}</p>
              <p className="mt-0.5 text-xs text-gray-500">{t("metrics.tailoredSupportDesc")}</p>
            </ScrollReveal>
            <ScrollReveal animation="fade-in-up" delay={300} className="text-center">
              <p className="font-poppins text-2xl font-bold text-navy">
                <Counter end={24} duration={1500} />/
                <Counter end={7} duration={1500} />
              </p>
              <p className="mt-1 text-xs font-medium text-gray-700">{t("metrics.globalSupport")}</p>
              <p className="mt-0.5 text-xs text-gray-500">{t("metrics.globalSupportDesc")}</p>
            </ScrollReveal>
            <ScrollReveal animation="fade-in-up" delay={400} className="text-center">
              <p className="font-poppins text-2xl font-bold text-navy">
                <Counter end={2} duration={1500} />
              </p>
              <p className="mt-1 text-xs font-medium text-gray-700">{t("metrics.globalDeliveryCenters")}</p>
              <p className="mt-0.5 text-xs text-gray-500">{t("metrics.globalDeliveryCentersDesc")}</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Service Models */}
      <section className="bg-gold py-12">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <ScrollReveal animation="zoom-in">
            <h2 className="font-poppins text-2xl font-bold text-white lg:text-3xl">
              {t("serviceModels.title")}
            </h2>
            <p className="mt-2 text-white/80">
              {t("serviceModels.description")}
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fade-in-up" delay={200}>
            <Link
              href="/services/dedicated-teams"
              className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-8 py-3 font-semibold text-white transition-all hover:bg-navy-dark hover:shadow-lg"
            >
              {t("serviceModels.cta")} <ArrowRight className="h-4 w-4 arrow-animate" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Leverage Our Expertise */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <ScrollReveal animation="fade-in-up">
            <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
              {t("expertise.title")}
            </h2>
          </ScrollReveal>
          <div className="mt-12 space-y-12">
            {[
              {
                icon: <ClipboardCheck className="h-8 w-8" />,
                title: t("expertise.assessment.title"),
                desc: t("expertise.assessment.desc"),
                align: "right",
              },
              {
                icon: <GitBranch className="h-8 w-8" />,
                title: t("expertise.processMapping.title"),
                desc: t("expertise.processMapping.desc"),
                align: "left",
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: t("expertise.workflowAutomation.title"),
                desc: t("expertise.workflowAutomation.desc"),
                align: "right",
              },
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: t("expertise.performanceMonitoring.title"),
                desc: t("expertise.performanceMonitoring.desc"),
                align: "left",
              },
            ].map((item, index) => (
              <ScrollReveal
                key={index}
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
              {t("whyBSG.title")}
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Target className="h-8 w-8" />,
                title: t("whyBSG.results.title"),
                desc: t("whyBSG.results.desc"),
              },
              {
                icon: <MessageSquare className="h-8 w-8" />,
                title: t("whyBSG.communication.title"),
                desc: t("whyBSG.communication.desc"),
              },
              {
                icon: <Handshake className="h-8 w-8" />,
                title: t("whyBSG.partnership.title"),
                desc: t("whyBSG.partnership.desc"),
              },
            ].map((item, index) => (
              <ScrollReveal
                key={index}
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
              {t("exploreMore.title")}
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Users className="h-8 w-8" />,
                title: t("exploreMore.dedicatedEmployeeSupport.title"),
                desc: t("exploreMore.dedicatedEmployeeSupport.desc"),
                href: "/services/dedicated-teams" as const,
              },
              {
                icon: <HeadphonesIcon className="h-8 w-8" />,
                title: t("exploreMore.onDemandServiceSupport.title"),
                desc: t("exploreMore.onDemandServiceSupport.desc"),
                href: "/services/on-demand-support" as const,
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: t("exploreMore.businessCarePlans.title"),
                desc: t("exploreMore.businessCarePlans.desc"),
                href: "/services/business-care-plans" as const,
              },
            ].map((service, index) => (
              <ScrollReveal
                key={index}
                animation="fade-in-up"
                delay={index * 150}
              >
                <Link
                  href={service.href}
                  className="group hover-lift block rounded-xl border border-gray-200 bg-white p-8 transition-all hover:border-gold"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-navy-50 p-3 text-navy transition-colors group-hover:bg-gold-50 group-hover:text-gold-700">
                    {service.icon}
                  </div>
                  <h3 className="font-poppins text-xl font-semibold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {service.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy group-hover:text-gold-700">
                    {tc("learnMore")} <ArrowRight className="h-3.5 w-3.5 arrow-animate" />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <ScrollReveal animation="fade-in-up">
            <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
              {t("industrySolutions.title")}
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600">
              {t("industrySolutions.description")}
            </p>
          </ScrollReveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Shield className="h-8 w-8" />,
                title: t("industrySolutions.insurance.title"),
                desc: t("industrySolutions.insurance.desc"),
                href: "/solutions/insurance" as const,
              },
              {
                icon: <DollarSign className="h-8 w-8" />,
                title: t("industrySolutions.finance.title"),
                desc: t("industrySolutions.finance.desc"),
                href: "/solutions/finance-accounting" as const,
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: t("industrySolutions.hr.title"),
                desc: t("industrySolutions.hr.desc"),
                href: "/solutions/hr-management" as const,
              },
              {
                icon: <FileCheck className="h-8 w-8" />,
                title: t("industrySolutions.compliance.title"),
                desc: t("industrySolutions.compliance.desc"),
                href: "/solutions/compliance-admin" as const,
              },
              {
                icon: <Code className="h-8 w-8" />,
                title: t("industrySolutions.technology.title"),
                desc: t("industrySolutions.technology.desc"),
                href: "/solutions/technology" as const,
              },
            ].map((solution, index) => (
              <ScrollReveal
                key={index}
                animation="fade-in-up"
                delay={index * 100}
              >
                <Link
                  href={solution.href}
                  className="group hover-lift block rounded-xl border border-gray-200 bg-white p-8 transition-all hover:border-gold"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-navy-50 p-3 text-navy transition-colors group-hover:bg-gold-50 group-hover:text-gold-700">
                    {solution.icon}
                  </div>
                  <h3 className="font-poppins text-xl font-semibold text-gray-900">
                    {solution.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {solution.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy group-hover:text-gold-700">
                    {tc("learnMore")} <ArrowRight className="h-3.5 w-3.5 arrow-animate" />
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
              {t("cta.title")}
            </h2>
            <p className="mt-3 text-lg text-white/70">
              {t("cta.description")}
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fade-in-up" delay={200}>
            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-gold-dark hover:shadow-lg"
            >
              {tc("talkToOurTeam")} <ArrowRight className="h-5 w-5 arrow-animate" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
