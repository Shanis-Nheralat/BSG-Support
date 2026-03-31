"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import CalendarGrid from "./CalendarGrid";
import TimeSlotPicker from "./TimeSlotPicker";
import BookingForm from "./BookingForm";
import BookingConfirmation from "./BookingConfirmation";

interface BookingResult {
  id: number;
  date: string;
  time: string;
  localTime: string;
  endTime: string;
}

export default function MeetingScheduler({ initialDate }: { initialDate?: string }) {
  const t = useTranslations("Meeting");
  const [step, setStep] = useState(initialDate ? 1 : 0);
  const [selectedDate, setSelectedDate] = useState(initialDate || "");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDisplayTime, setSelectedDisplayTime] = useState("");
  const [selectedLocalTime, setSelectedLocalTime] = useState("");
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [timezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const STEPS = [t("stepDate"), t("stepTime"), t("stepDetails"), t("stepConfirmed")];

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
    <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
      {/* Progress Steps */}
      {step < 3 && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.slice(0, 3).map((label, i) => (
              <div key={i} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      i < step
                        ? "bg-green-500 text-white"
                        : i === step
                          ? "bg-navy text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i < step ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="mt-1 hidden text-xs font-medium text-gray-500 sm:block">
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 transition-colors ${
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
  );
}
