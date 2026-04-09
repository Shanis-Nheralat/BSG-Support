"use client";

import InlineBookingWidget from "@/components/InlineBookingWidget";

export default function HeroScheduler() {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/95 p-4 text-gray-900 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-5">
      <InlineBookingWidget />
    </div>
  );
}
