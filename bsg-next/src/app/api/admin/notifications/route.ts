import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch notifications for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const unreadOnly = searchParams.get("unread") === "true";

    const where = unreadOnly ? { is_read: false } : {};

    const notifications = await prisma.admin_notifications.findMany({
      where,
      orderBy: { created_at: "desc" },
      take: limit,
    });

    const unreadCount = await prisma.admin_notifications.count({
      where: { is_read: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PATCH: Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ids, markAll } = body;

    if (markAll) {
      await prisma.admin_notifications.updateMany({
        where: { is_read: false },
        data: { is_read: true },
      });
    } else if (ids && Array.isArray(ids)) {
      await prisma.admin_notifications.updateMany({
        where: { id: { in: ids } },
        data: { is_read: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
