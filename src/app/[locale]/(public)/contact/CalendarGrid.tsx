"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarGridProps {
  onDateSelect: (date: string) => void;
}

export default function CalendarGrid({ onDateSelect }: CalendarGridProps) {
  const t = useTranslations("Meeting");
  const locale = useLocale();

  const DAY_LABELS = [t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")];

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1); // 1-12
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/schedule/availability?mode=month&year=${viewYear}&month=${viewMonth}`
      );
      const data = await res.json();
      setAvailableDates(new Set(data.dates || []));
    } catch {
      setAvailableDates(new Set());
    } finally {
      setLoading(false);
    }
  }, [viewYear, viewMonth]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  function goToPrevMonth() {
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    if (viewYear === currentYear && viewMonth <= currentMonth) return;

    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function goToNextMonth() {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function handleDateClick(dateStr: string) {
    setSelectedDate(dateStr);
    onDateSelect(dateStr);
  }

  // Calendar grid calculations
  const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const monthName = new Date(viewYear, viewMonth - 1).toLocaleString(
    locale === "de" ? "de-DE" : "en-US",
    { month: "long" }
  );

  // Check if prev button should be disabled
  const isPrevDisabled =
    viewYear === now.getFullYear() && viewMonth <= now.getMonth() + 1;

  // Today's date string for comparison
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <div>
      <h3 className="mb-1 font-poppins text-lg font-semibold text-gray-900">
        {t("selectDate")}
      </h3>
      <p className="mb-6 text-sm text-gray-500">
        {t("selectDateDesc")}
      </p>

      {/* Month Navigation */}
      <div className="mb-4 flex items-center justify-between rounded-lg bg-navy px-4 py-3">
        <button
          type="button"
          onClick={goToPrevMonth}
          disabled={isPrevDisabled}
          className="rounded-md p-1 text-white transition-colors hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-white">
          {monthName} {viewYear}
        </span>
        <button
          type="button"
          onClick={goToNextMonth}
          className="rounded-md p-1 text-white transition-colors hover:bg-white/20"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="mb-2 grid grid-cols-7 text-center">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="py-2 text-xs font-semibold uppercase text-gray-400">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the 1st */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isAvailable = availableDates.has(dateStr);
            const isPast = dateStr < todayStr;
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === todayStr;

            return (
              <button
                key={dateStr}
                type="button"
                disabled={!isAvailable || isPast}
                onClick={() => handleDateClick(dateStr)}
                className={`relative flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-navy text-white shadow-md"
                    : isAvailable
                      ? "cursor-pointer bg-green-50 text-gray-900 hover:bg-green-100 hover:shadow-sm"
                      : isPast
                        ? "cursor-default text-gray-300"
                        : "cursor-default text-gray-400"
                }`}
              >
                {day}
                {isToday && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-navy" />
                )}
                {isAvailable && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-green-500" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          {t("available")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-gray-300" />
          {t("unavailable")}
        </span>
      </div>
    </div>
  );
}
