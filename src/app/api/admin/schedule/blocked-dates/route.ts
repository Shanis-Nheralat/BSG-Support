import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const blockedDates = await prisma.meeting_blocked_dates.findMany({
      where: { blocked_date: { gte: new Date() } },
      orderBy: { blocked_date: "asc" },
    });
    return NextResponse.json({ blockedDates });
  } catch (error) {
    console.error("Fetch blocked dates error:", error);
    return NextResponse.json({ error: "Failed to fetch blocked dates" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { date, reason } = await request.json();

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const blockedDate = await prisma.meeting_blocked_dates.create({
      data: {
        blocked_date: new Date(date + "T12:00:00+04:00"),
        reason: reason || null,
      },
    });

    return NextResponse.json({ success: true, blockedDate }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return NextResponse.json({ error: "This date is already blocked" }, { status: 409 });
    }
    console.error("Create blocked date error:", error);
    return NextResponse.json({ error: "Failed to block date" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.meeting_blocked_dates.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete blocked date error:", error);
    return NextResponse.json({ error: "Failed to delete blocked date" }, { status: 500 });
  }
}
