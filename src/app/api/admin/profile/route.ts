import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper to find user in either table
async function findUserById(userId: number) {
  // Try admin_users first
  const user = await prisma.admin_users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      last_login: true,
      created_at: true,
    },
  });

  if (user) return { user, table: "admin_users" as const };

  // Fallback to users table
  const regularUser = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      last_login: true,
      created_at: true,
    },
  });

  if (regularUser) return { user: regularUser, table: "users" as const };

  return null;
}

// GET - Get current user profile
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = parseInt(session.user.id);
    const result = await findUserById(userId);

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: result.user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT - Update profile (name, email)
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);
    const result = await findUserById(userId);

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if email is taken by another user (in both tables)
    const existingAdmin = await prisma.admin_users.findUnique({ where: { email } });
    const existingUser = await prisma.users.findUnique({ where: { email } });

    if ((existingAdmin && Number(existingAdmin.id) !== userId) ||
        (existingUser && Number(existingUser.id) !== userId)) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 400 }
      );
    }

    // Update in the correct table
    let updatedUser;
    if (result.table === "admin_users") {
      updatedUser = await prisma.admin_users.update({
        where: { id: userId },
        data: { name, email, updated_at: new Date() },
        select: { id: true, name: true, email: true, role: true },
      });
    } else {
      updatedUser = await prisma.users.update({
        where: { id: userId },
        data: { name, email, updated_at: new Date() },
        select: { id: true, name: true, email: true, role: true },
      });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
