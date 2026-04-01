"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Calendar } from "lucide-react";
import CalendarGrid from "@/app/[locale]/(public)/contact/CalendarGrid";
import TimeSlotPicker from "@/app/[locale]/(public)/contact/TimeSlotPicker";
import BookingForm from "@/app/[locale]/(public)/contact/BookingForm";
import BookingConfirmation from "@/app/[locale]/(public)/contact/BookingConfirmation";

interface BookingResult {
  id: number;
  date: string;
  time: string;
  localTime: string;
  endTime: string;
}

export default function InlineBookingWidget() {
  const t = useTranslations("Meeting");
  const th = useTranslations("HeroScheduler");

  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDisplayTime, setSelectedDisplayTime] = useState("");
  const [selectedLocalTime, setSelectedLocalTime] = useState("");
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [timezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const STEP_LABELS = [t("stepDate"), t("stepTime"), t("stepDetails")];

  function handleDateSelect(date: string) {
    setSelectedDate(date);
    setStep(1);
  }

  function handleTimeSelect(time: string, displayTime: string, localTime: string) {
    setSelectedTime(time);
    setSelectedDisplayTime(displayTime);
    setSelectedLocalTime(localTime);
    setStep(2);
  }

  function handleBookingComplete(result: BookingResult) {
    setBookingResult(result);
    setStep(3);
  }

  function handleReset() {
    setStep(0);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedDisplayTime("");
    setSelectedLocalTime("");
    setBookingResult(null);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
        <Calendar className="h-4 w-4 text-navy" />
        <div>
          <span className="text-sm font-semibold text-navy">{th("title")}</span>
          <p className="text-xs text-gray-400">{th("subtitle")}</p>
        </div>
      </div>

      {/* Compact Progress Bar (hidden on confirmation) */}
      {step < 3 && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            {STEP_LABELS.map((label, i) => (
              <div key={i} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                      i < step
                        ? "bg-green-500 text-white"
                        : i === step
                          ? "bg-navy text-white"
                          : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {i < step ? (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="mt-1 hidden text-[10px] font-medium text-gray-400 sm:block">
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className={`mx-1.5 h-0.5 flex-1 transition-colors ${
                      i < step ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div key={step} className="animate-fade-slide-in max-h-[520px] overflow-y-auto">
        {step === 0 && (
          <CalendarGrid onDateSelect={handleDateSelect} />
        )}

        {step === 1 && (
          <TimeSlotPicker
            date={selectedDate}
            timezone={timezone}
            onTimeSelect={handleTimeSelect}
            onBack={() => setStep(0)}
          />
        )}

        {step === 2 && (
          <BookingForm
            date={selectedDate}
            time={selectedTime}
            displayTime={selectedDisplayTime}
            localTime={selectedLocalTime}
            timezone={timezone}
            onComplete={handleBookingComplete}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && bookingResult && (
          <BookingConfirmation
            booking={bookingResult}
            localTime={selectedLocalTime}
            timezone={timezone}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
