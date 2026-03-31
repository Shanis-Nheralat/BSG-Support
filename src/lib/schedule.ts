import { prisma } from "@/lib/prisma";

const SLOT_DURATION = 30; // minutes
const TIMEZONE = "Asia/Dubai"; // UAE timezone (UTC+4)

/**
 * Generate 30-minute time slots between start and end times.
 * Times are in "HH:mm" 24h format.
 */
export function generateTimeSlots(
  startTime: string,
  endTime: string,
  durationMinutes: number = SLOT_DURATION
): { start: string; end: string }[] {
  const slots: { start: string; end: string }[] = [];
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (currentMinutes + durationMinutes <= endMinutes) {
    const slotStart = minutesToTime(currentMinutes);
    const slotEnd = minutesToTime(currentMinutes + durationMinutes);
    slots.push({ start: slotStart, end: slotEnd });
    currentMinutes += durationMinutes;
  }

  return slots;
}

/**
 * Convert total minutes to "HH:mm" format.
 */
function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Convert a "HH:mm" UAE time to a visitor's local timezone display string.
 * Returns formatted time like "11:30 AM" in the visitor's timezone.
 */
export function formatSlotForTimezone(
  time: string,
  date: string,
  visitorTimezone: string
): string {
  // Build a Date object for the given date + time in UAE timezone
  const [h, m] = time.split(":").map(Number);
  // Create the date string in ISO format with UAE offset (+04:00)
  const dateObj = new Date(`${date}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00+04:00`);

  return dateObj.toLocaleTimeString("en-US", {
    timeZone: visitorTimezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format a "HH:mm" time to a display string like "10:00 AM" (UAE time).
 */
export function formatTimeDisplay(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * Get available time slots for a specific date.
 * Checks day-of-week availability, blocked dates, and existing bookings.
 */
export async function getAvailableSlotsForDate(dateStr: string): Promise<
  { start: string; end: string }[]
> {
  const date = new Date(dateStr + "T00:00:00+04:00");
  const dayOfWeek = getDayOfWeekInUAE(dateStr);

  // Check if date is blocked
  const blocked = await prisma.meeting_blocked_dates.findFirst({
    where: { blocked_date: date },
  });
  if (blocked) return [];

  // Get availability for this day of week
  const availability = await prisma.meeting_availability.findUnique({
    where: { day_of_week: dayOfWeek },
  });
  if (!availability || !availability.is_active) return [];

  // Generate all possible slots
  const allSlots = generateTimeSlots(
    availability.start_time,
    availability.end_time
  );

  // Get existing confirmed bookings for this date
  const bookings = await prisma.meeting_bookings.findMany({
    where: {
      booking_date: date,
      status: "Confirmed",
    },
    select: { start_time: true },
  });

  const bookedTimes = new Set(bookings.map((b) => b.start_time));

  // Filter out past slots if the date is today
  const now = new Date();
  const uaeNow = new Date(
    now.toLocaleString("en-US", { timeZone: TIMEZONE })
  );
  const todayStr = formatDateToStr(uaeNow);

  const availableSlots = allSlots.filter((slot) => {
    // Remove already booked slots
    if (bookedTimes.has(slot.start)) return false;

    // If today, remove past slots (add 30 min buffer)
    if (dateStr === todayStr) {
      const [slotH, slotM] = slot.start.split(":").map(Number);
      const slotMinutes = slotH * 60 + slotM;
      const currentMinutes = uaeNow.getHours() * 60 + uaeNow.getMinutes() + 30;
      if (slotMinutes <= currentMinutes) return false;
    }

    return true;
  });

  return availableSlots;
}

/**
 * Get dates in a month that have at least one available slot.
 */
export async function getAvailableDatesForMonth(
  year: number,
  month: number // 1-12
): Promise<string[]> {
  // Get all active availability rules
  const availabilities = await prisma.meeting_availability.findMany({
    where: { is_active: true },
  });
  const activeDays = new Set(availabilities.map((a) => a.day_of_week));

  if (activeDays.size === 0) return [];

  // Get blocked dates for this month
  const monthStart = new Date(`${year}-${String(month).padStart(2, "0")}-01T00:00:00+04:00`);
  const monthEnd = new Date(year, month, 0); // last day of month
  const monthEndDate = new Date(
    `${year}-${String(month).padStart(2, "0")}-${String(monthEnd.getDate()).padStart(2, "0")}T23:59:59+04:00`
  );

  const blockedDates = await prisma.meeting_blocked_dates.findMany({
    where: {
      blocked_date: { gte: monthStart, lte: monthEndDate },
    },
  });
  const blockedSet = new Set(
    blockedDates.map((b) => formatDateToStr(new Date(b.blocked_date)))
  );

  // Get all bookings for this month to check slot availability
  const bookings = await prisma.meeting_bookings.findMany({
    where: {
      booking_date: { gte: monthStart, lte: monthEndDate },
      status: "Confirmed",
    },
    select: { booking_date: true, start_time: true },
  });

  // Group bookings by date
  const bookingsByDate: Record<string, number> = {};
  bookings.forEach((b) => {
    const dateKey = formatDateToStr(new Date(b.booking_date));
    bookingsByDate[dateKey] = (bookingsByDate[dateKey] || 0) + 1;
  });

  // Calculate max slots per day
  const maxSlotsByDay: Record<number, number> = {};
  availabilities.forEach((a) => {
    maxSlotsByDay[a.day_of_week] = generateTimeSlots(
      a.start_time,
      a.end_time
    ).length;
  });

  // Get today in UAE timezone
  const now = new Date();
  const uaeNow = new Date(
    now.toLocaleString("en-US", { timeZone: TIMEZONE })
  );
  const todayStr = formatDateToStr(uaeNow);

  const availableDates: string[] = [];
  const daysInMonth = monthEnd.getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // Skip past dates
    if (dateStr < todayStr) continue;

    // Skip blocked dates
    if (blockedSet.has(dateStr)) continue;

    // Check day of week
    const dayOfWeek = getDayOfWeekInUAE(dateStr);
    if (!activeDays.has(dayOfWeek)) continue;

    // Check if all slots are booked
    const maxSlots = maxSlotsByDay[dayOfWeek] || 0;
    const bookedCount = bookingsByDate[dateStr] || 0;
    if (bookedCount >= maxSlots) continue;

    // For today, do a more detailed check
    if (dateStr === todayStr) {
      const slots = await getAvailableSlotsForDate(dateStr);
      if (slots.length === 0) continue;
    }

    availableDates.push(dateStr);
  }

  return availableDates;
}

/**
 * Check if a specific slot is still available (for booking validation).
 */
export async function isSlotAvailable(
  dateStr: string,
  startTime: string
): Promise<boolean> {
  const date = new Date(dateStr + "T00:00:00+04:00");

  // Check not in the past
  const now = new Date();
  const uaeNow = new Date(
    now.toLocaleString("en-US", { timeZone: TIMEZONE })
  );
  const todayStr = formatDateToStr(uaeNow);

  if (dateStr < todayStr) return false;
  if (dateStr === todayStr) {
    const [slotH, slotM] = startTime.split(":").map(Number);
    const slotMinutes = slotH * 60 + slotM;
    const currentMinutes = uaeNow.getHours() * 60 + uaeNow.getMinutes() + 30;
    if (slotMinutes <= currentMinutes) return false;
  }

  // Check day-of-week availability
  const dayOfWeek = getDayOfWeekInUAE(dateStr);
  const availability = await prisma.meeting_availability.findUnique({
    where: { day_of_week: dayOfWeek },
  });
  if (!availability || !availability.is_active) return false;

  // Check if within availability window
  const [startH, startM] = startTime.split(":").map(Number);
  const [availStartH, availStartM] = availability.start_time.split(":").map(Number);
  const [availEndH, availEndM] = availability.end_time.split(":").map(Number);
  const slotMinutes = startH * 60 + startM;
  const availStart = availStartH * 60 + availStartM;
  const availEnd = availEndH * 60 + availEndM;
  if (slotMinutes < availStart || slotMinutes + SLOT_DURATION > availEnd) return false;

  // Check blocked date
  const blocked = await prisma.meeting_blocked_dates.findFirst({
    where: { blocked_date: date },
  });
  if (blocked) return false;

  // Check existing booking
  const existing = await prisma.meeting_bookings.findFirst({
    where: {
      booking_date: date,
      start_time: startTime,
      status: "Confirmed",
    },
  });

  return !existing;
}

/**
 * Get the day of week (0-6) for a date string in UAE timezone.
 */
function getDayOfWeekInUAE(dateStr: string): number {
  const date = new Date(dateStr + "T12:00:00+04:00");
  return date.getUTCDay();
}

/**
 * Format a Date object to "YYYY-MM-DD" string.
 */
function formatDateToStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Calculate the end time for a 30-minute slot.
 */
export function calculateEndTime(startTime: string): string {
  const [h, m] = startTime.split(":").map(Number);
  const totalMinutes = h * 60 + m + SLOT_DURATION;
  return minutesToTime(totalMinutes);
}
