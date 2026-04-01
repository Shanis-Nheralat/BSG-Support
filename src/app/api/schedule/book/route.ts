import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isSlotAvailable, calculateEndTime, formatTimeDisplay, formatSlotForTimezone } from "@/lib/schedule";
import { sendEmail } from "@/lib/email";
import { notifyNewBooking } from "@/lib/notifications";
import { resolveLocale, loadEmailTranslations } from "@/lib/email-translations";
import { getMeetingUserConfirmation } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time, name, email, phone, company, purpose, timezone, locale: bodyLocale } = body;

    // Validate required fields
    if (!date || !time || !name || !email || !timezone) {
      return NextResponse.json(
        { error: "Date, time, name, email, and timezone are required" },
        { status: 400 }
      );
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // Validate time format
    if (!/^\d{2}:\d{2}$/.test(time)) {
      return NextResponse.json(
        { error: "Invalid time format. Use HH:mm" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Resolve locale for user-facing emails
    const locale = resolveLocale(bodyLocale, request.cookies.get("NEXT_LOCALE")?.value);

    // Check slot availability
    const available = await isSlotAvailable(date, time);
    if (!available) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please select another." },
        { status: 409 }
      );
    }

    const endTime = calculateEndTime(time);
    const bookingDate = new Date(date + "T12:00:00+04:00");

    // Create the booking
    const booking = await prisma.meeting_bookings.create({
      data: {
        booking_date: bookingDate,
        start_time: time,
        end_time: endTime,
        visitor_name: name,
        visitor_email: email,
        visitor_phone: phone || null,
        visitor_company: company || null,
        purpose: purpose || null,
        visitor_timezone: timezone,
        status: "Confirmed",
      },
    });

    // Format date for display (locale-aware)
    const displayDate = bookingDate.toLocaleDateString(
      locale === "de" ? "de-DE" : "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Dubai",
      }
    );

    const displayTime = formatTimeDisplay(time);
    const localTime = formatSlotForTimezone(time, date, timezone);

    // Create admin notification
    await notifyNewBooking(name, displayDate, displayTime, booking.id);

    // Send confirmation email to visitor (in user's language)
    const t = await loadEmailTranslations(locale);
    const emailContent = getMeetingUserConfirmation(
      { name, date: displayDate, time: displayTime, localTime, timezone },
      t,
    );

    await sendEmail({
      to: email,
      ...emailContent,
    });

    return NextResponse.json(
      {
        success: true,
        booking: {
          id: booking.id,
          date: displayDate,
          time: displayTime,
          localTime,
          endTime: formatTimeDisplay(endTime),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again." },
      { status: 500 }
    );
  }
}
