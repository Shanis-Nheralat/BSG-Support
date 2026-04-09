"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface BookingFormProps {
  date: string;
  time: string;
  displayTime: string;
  localTime: string;
  timezone: string;
  onComplete: (result: {
    id: number;
    date: string;
    time: string;
    localTime: string;
    endTime: string;
  }) => void;
  onBack: () => void;
}

export default function BookingForm({
  date,
  time,
  displayTime,
  localTime,
  timezone,
  onComplete,
  onBack,
}: BookingFormProps) {
  const t = useTranslations("Meeting");
  const locale = useLocale();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const displayDate = new Date(date + "T12:00:00").toLocaleDateString(
    locale === "de" ? "de-DE" : "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/schedule/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          date,
          time,
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone") || undefined,
          company: formData.get("company") || undefined,
          purpose: formData.get("purpose") || undefined,
          timezone,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || t("failedToBook"));
      }

      onComplete(result.booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorOccurred"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToTime")}
      </button>

      <h3 className="mb-4 font-poppins text-lg font-semibold text-gray-900">
        {t("yourDetails")}
      </h3>

      {/* Meeting Summary */}
      <div className="mb-6 rounded-lg bg-navy-50 p-4">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-navy">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{displayDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-navy">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{displayTime} {t("uae")}</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {localTime} {t("yourLocalTime")}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label={t("fullName")} name="name" required placeholder={t("placeholderName")} />
        <Input
          label={t("emailAddress")}
          name="email"
          type="email"
          required
          placeholder={t("placeholderEmail")}
        />
        <Input
          label={t("phoneNumber")}
          name="phone"
          type="tel"
          placeholder={t("placeholderPhone")}
        />
        <Input
          label={t("companyName")}
          name="company"
          placeholder={t("placeholderCompany")}
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {t("meetingPurpose")}
          </label>
          <textarea
            name="purpose"
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy-100"
            rows={3}
            placeholder={t("purposePlaceholder")}
          />
        </div>

        <Button type="submit" loading={submitting} className="mt-6 w-full">
          {t("confirmBooking")}
        </Button>
      </form>
    </div>
  );
}
