"use client";

import { useTranslations } from "next-intl";
import { CheckCircle, Calendar, Clock, Globe, RotateCcw } from "lucide-react";
import Button from "@/components/ui/Button";

interface BookingConfirmationProps {
  booking: {
    id: number;
    date: string;
    time: string;
    localTime: string;
    endTime: string;
  };
  localTime: string;
  timezone: string;
  onReset: () => void;
}

export default function BookingConfirmation({
  booking,
  timezone,
  onReset,
}: BookingConfirmationProps) {
  const t = useTranslations("Meeting");
  const shortTimezone = timezone.split("/").pop()?.replace(/_/g, " ") || timezone;

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>

      <h3 className="font-poppins text-2xl font-bold text-gray-900">
        {t("meetingConfirmed")}
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        {t("successfullyScheduled")}
      </p>

      {/* Meeting Details Card */}
      <div className="mx-auto mt-6 max-w-sm rounded-xl border border-gray-200 bg-gray-50 p-6 text-left">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-5 w-5 text-navy" />
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">{t("dateLabel")}</p>
              <p className="font-medium text-gray-900">{booking.date}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-navy" />
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">
                {t("timeUAE")}
              </p>
              <p className="font-medium text-gray-900">
                {booking.time} - {booking.endTime} GST
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Globe className="mt-0.5 h-5 w-5 text-navy" />
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">
                {t("yourLocalTimeLabel")}
              </p>
              <p className="font-medium text-gray-900">
                {booking.localTime} ({shortTimezone})
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <p className="text-xs text-gray-400">{t("duration")}</p>
            <p className="font-medium text-gray-900">{t("thirtyMinutes")}</p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        {t("confirmationEmail")}
      </p>

      <div className="mt-6">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          {t("scheduleAnother")}
        </Button>
      </div>
    </div>
  );
}
