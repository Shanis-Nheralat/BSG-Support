"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import MeetingScheduler from "./MeetingScheduler";

function ContactContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const dateParam = searchParams.get("date");
  const t = useTranslations("Contact");
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState<"general" | "meeting" | "intake">(
    tabParam === "meeting" ? "meeting" : "general"
  );
  const [initialDate, setInitialDate] = useState(dateParam || "");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const tabs = [
    { key: "general" as const, label: t("tabs.generalInquiry") },
    { key: "meeting" as const, label: t("tabs.scheduleMeeting") },
    { key: "intake" as const, label: t("tabs.serviceIntake") },
  ];

  const formTypeMap = {
    general: "general_inquiry",
    meeting: "meeting_request",
    intake: "service_intake",
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {
      form_type: formTypeMap[activeTab],
      locale,
    };

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || t("failedToSubmit"));
      }

      setSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorOccurred"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold lg:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-lg text-white/70">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <a
              href="tel:+971524419445"
              className="flex items-start gap-4 rounded-xl border border-gray-200 p-6 transition-colors hover:border-gold"
            >
              <div className="rounded-lg bg-navy-50 p-3 text-navy">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t("cards.callUs")}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t("cards.callUsDesc")}
                </p>
                <p className="mt-2 font-medium text-navy">+971 52-441-9445</p>
              </div>
            </a>

            <a
              href="mailto:info@backsureglobalsupport.com"
              className="flex items-start gap-4 rounded-xl border border-gray-200 p-6 transition-colors hover:border-gold"
            >
              <div className="rounded-lg bg-navy-50 p-3 text-navy">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t("cards.emailUs")}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t("cards.emailUsDesc")}
                </p>
                <p className="mt-2 text-sm font-medium text-navy">
                  info@backsureglobalsupport.com
                </p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-xl border border-gray-200 p-6">
              <div className="rounded-lg bg-navy-50 p-3 text-navy">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t("cards.ourLocations")}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  <strong>{t("cards.uaeLabel")}</strong> {t("cards.uaeAddress")}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  <strong>{t("cards.indiaLabel")}</strong> {t("cards.indiaAddress")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          {/* Tabs */}
          <div className="mb-8 flex rounded-lg border border-gray-200 bg-white p-1">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSuccess(false);
                  setInitialDate("");
                }}
                className={`flex-1 rounded-md px-2 py-2.5 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                  activeTab === tab.key
                    ? "bg-navy text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "meeting" ? (
            <MeetingScheduler initialDate={initialDate} />
          ) : success ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
              <h3 className="font-poppins text-xl font-semibold text-green-800">
                {t("success.title")}
              </h3>
              <p className="mt-2 text-green-700">
                {t("success.message")}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-gray-200 bg-white p-8"
            >
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {activeTab === "general" && (
                <div className="space-y-4">
                  <Input label={t("form.yourName")} name="name" required />
                  <Input label={t("form.yourEmail")} name="email" type="email" required />
                  <Input label={t("form.phoneNumber")} name="phone" type="tel" />
                  <Input label={t("form.companyName")} name="company" />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {t("form.yourMessage")}
                    </label>
                    <textarea
                      name="message"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy-100"
                      rows={5}
                      required
                    />
                  </div>
                </div>
              )}

              {activeTab === "intake" && (
                <div className="space-y-4">
                  <Input label={t("form.name")} name="name" required />
                  <Input label={t("form.emailAddress")} name="email" type="email" required />
                  <Input label={t("form.phoneNumber")} name="phone" type="tel" />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {t("form.solutionType")}
                    </label>
                    <select
                      name="service_type"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy-100"
                      required
                    >
                      <option value="">{t("form.selectSolution")}</option>
                      <option>{t("form.salesSupport")}</option>
                      <option>{t("form.dataEntry")}</option>
                      <option>{t("form.backendSupport")}</option>
                      <option>{t("form.customerService")}</option>
                      <option>{t("form.technicalSupport")}</option>
                      <option>{t("form.humanResources")}</option>
                      <option>{t("form.marketing")}</option>
                      <option>{t("form.accounting")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {t("form.implementationTimeline")}
                    </label>
                    <select 
                      name="implementation_timeline"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy-100"
                    >
                      <option>{t("form.immediately")}</option>
                      <option>{t("form.within1Month")}</option>
                      <option>{t("form.oneToThreeMonths")}</option>
                      <option>{t("form.threeToSixMonths")}</option>
                      <option>{t("form.sixPlusMonths")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {t("form.serviceRequirements")}
                    </label>
                    <textarea
                      name="message"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy-100"
                      rows={4}
                      required
                    />
                  </div>
                </div>
              )}

              <Button type="submit" loading={submitting} className="mt-6 w-full">
                <Send className="h-4 w-4" />
                {t("form.submit")}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactContent />
    </Suspense>
  );
}
