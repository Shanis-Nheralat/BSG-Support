"use client";

import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import CalendarGrid from "@/app/[locale]/(public)/contact/CalendarGrid";

export default function HeroScheduler() {
  const t = useTranslations("HeroScheduler");
  const router = useRouter();

  function handleDateSelect(date: string) {
    router.push(`/contact?tab=meeting&date=${date}`);
  }

  return (
    <div className="rounded-2xl border border-white/20 bg-white/95 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-5">
      <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
        <Calendar className="h-4 w-4 text-navy" />
        <span className="text-sm font-semibold text-navy">
          {t("title")}
        </span>
      </div>
      <CalendarGrid onDateSelect={handleDateSelect} />
    </div>
  );
}
