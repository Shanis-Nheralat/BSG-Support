import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const availability = await prisma.meeting_availability.findMany({
      orderBy: { day_of_week: "asc" },
    });
    return NextResponse.json({ availability });
  } catch (error) {
    console.error("Fetch availability error:", error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { schedule } = await request.json();

    if (!Array.isArray(schedule) || schedule.length !== 7) {
      return NextResponse.json(
        { error: "Schedule must contain exactly 7 day entries" },
        { status: 400 }
      );
    }

    // Upsert all 7 days
    for (const day of schedule) {
      await prisma.meeting_availability.upsert({
        where: { day_of_week: day.day_of_week },
        update: {
          start_time: day.start_time,
          end_time: day.end_time,
          is_active: day.is_active,
          updated_at: new Date(),
        },
        create: {
          day_of_week: day.day_of_week,
          start_time: day.start_time,
          end_time: day.end_time,
          is_active: day.is_active,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update availability error:", error);
    return NextResponse.json({ error: "Failed to update availability" }, { status: 500 });
  }
}
