"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Clock, Globe } from "lucide-react";

interface TimeSlotPickerProps {
  date: string;
  timezone: string;
  onTimeSelect: (time: string, displayTime: string, localTime: string) => void;
  onBack: () => void;
}

interface Slot {
  time: string;
  endTime: string;
  displayTime: string;
  localTime: string;
}

export default function TimeSlotPicker({
  date,
  timezone,
  onTimeSelect,
  onBack,
}: TimeSlotPickerProps) {
  const t = useTranslations("Meeting");
  const locale = useLocale();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/schedule/availability?mode=date&date=${date}&timezone=${encodeURIComponent(timezone)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSlots(data.slots || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedToLoadSlots"));
    } finally {
      setLoading(false);
    }
  }, [date, timezone]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Format the selected date for display
  const displayDate = new Date(date + "T12:00:00").toLocaleDateString(
    locale === "de" ? "de-DE" : "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  const shortTimezone = timezone.split("/").pop()?.replace(/_/g, " ") || timezone;

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToCalendar")}
      </button>

      <h3 className="mb-1 font-poppins text-lg font-semibold text-gray-900">
        {t("selectTime")}
      </h3>
      <p className="mb-2 text-sm font-medium text-navy">{displayDate}</p>
      <div className="mb-6 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {t("minMeeting")}
        </span>
        <span className="flex items-center gap-1">
          <Globe className="h-3.5 w-3.5" />
          {shortTimezone}
        </span>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      ) : slots.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-600">
            {t("noSlots")}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-3 text-sm font-medium text-navy hover:underline"
          >
            {t("chooseAnotherDate")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {slots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              onClick={() => onTimeSelect(slot.time, slot.displayTime, slot.localTime)}
              className="group flex flex-col items-center rounded-lg border border-gray-200 px-3 py-3 text-sm text-gray-900 transition-all hover:border-navy hover:bg-navy hover:text-white hover:shadow-md"
            >
              <span className="font-semibold">{slot.displayTime}</span>
              <span className="mt-0.5 text-xs text-gray-400 group-hover:text-white/70">
                {slot.localTime} {t("local")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
