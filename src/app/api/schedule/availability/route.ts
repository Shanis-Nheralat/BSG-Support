import { NextRequest, NextResponse } from "next/server";
import {
  getAvailableDatesForMonth,
  getAvailableSlotsForDate,
  formatSlotForTimezone,
  formatTimeDisplay,
} from "@/lib/schedule";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    if (mode === "month") {
      const year = parseInt(searchParams.get("year") || "");
      const month = parseInt(searchParams.get("month") || "");

      if (!year || !month || month < 1 || month > 12) {
        return NextResponse.json(
          { error: "Valid year and month (1-12) are required" },
          { status: 400 }
        );
      }

      const dates = await getAvailableDatesForMonth(year, month);
      return NextResponse.json({ dates });
    }

    if (mode === "date") {
      const date = searchParams.get("date");
      const timezone = searchParams.get("timezone") || "Asia/Dubai";

      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json(
          { error: "Valid date in YYYY-MM-DD format is required" },
          { status: 400 }
        );
      }

      const rawSlots = await getAvailableSlotsForDate(date);
      const slots = rawSlots.map((slot) => ({
        time: slot.start,
        endTime: slot.end,
        displayTime: formatTimeDisplay(slot.start),
        localTime: formatSlotForTimezone(slot.start, date, timezone),
      }));

      return NextResponse.json({ slots, timezone });
    }

    return NextResponse.json(
      { error: "mode parameter must be 'month' or 'date'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Schedule availability error:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
