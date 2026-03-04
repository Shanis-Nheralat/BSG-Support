import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Helper to find user with password in either table
async function findUserWithPassword(userId: number) {
  // Try admin_users first
  const adminUser = await prisma.admin_users.findUnique({
    where: { id: userId },
  });

  if (adminUser) return { user: adminUser, table: "admin_users" as const };

  // Fallback to users table
  const regularUser = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (regularUser) return { user: regularUser, table: "users" as const };

  return null;
}

// PUT - Change password
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);

    // Get current user with password from either table
    const result = await findUserWithPassword(userId);

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, result.user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password in the correct table
    if (result.table === "admin_users") {
      await prisma.admin_users.update({
        where: { id: userId },
        data: { password: hashedPassword, updated_at: new Date() },
      });
    } else {
      await prisma.users.update({
        where: { id: userId },
        data: { password: hashedPassword, updated_at: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
