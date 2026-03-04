import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Export settings
    const settings = await prisma.settings.findMany({
      orderBy: [{ setting_group: "asc" }, { setting_key: "asc" }],
    });

    // Export blog posts
    const blogPosts = await prisma.blog_posts.findMany({
      orderBy: { created_at: "desc" },
    });

    // Export blog categories
    const blogCategories = await prisma.blog_categories.findMany({
      orderBy: { name: "asc" },
    });

    // Export candidates
    const candidates = await prisma.candidates.findMany({
      orderBy: { submitted_at: "desc" },
    });

    // Export inquiries
    const inquiries = await prisma.inquiries.findMany({
      orderBy: { submitted_at: "desc" },
    });

    const backup = {
      exportedAt: new Date().toISOString(),
      exportedBy: session.user.email,
      version: "1.0",
      data: {
        settings,
        blogPosts,
        blogCategories,
        candidates,
        inquiries,
      },
    };

    return NextResponse.json(backup);
  } catch (error) {
    console.error("Backup export error:", error);
    return NextResponse.json(
      { error: "Failed to export backup" },
      { status: 500 }
    );
  }
}
