import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifySystem } from "@/lib/notifications";

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

// POST /api/admin/settings/backup - Restore from JSON backup
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backup = await request.json();

    // Validate backup structure
    if (!backup.version || !backup.data) {
      return NextResponse.json(
        { error: "Invalid backup file: missing version or data" },
        { status: 400 }
      );
    }

    const { data } = backup;
    const requiredKeys = ["settings", "blogPosts", "blogCategories", "candidates", "inquiries"];
    for (const key of requiredKeys) {
      if (!Array.isArray(data[key])) {
        return NextResponse.json(
          { error: `Invalid backup file: missing or invalid "${key}" data` },
          { status: 400 }
        );
      }
    }

    // Restore in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Settings: delete all, recreate
      await tx.settings.deleteMany();
      if (data.settings.length > 0) {
        await tx.settings.createMany({
          data: data.settings.map((s: Record<string, unknown>) => ({
            setting_group: s.setting_group as string,
            setting_key: s.setting_key as string,
            setting_value: s.setting_value as string | null,
            type: s.type as string | undefined,
            autoload: s.autoload as boolean | undefined,
            updated_by: s.updated_by as number | undefined,
          })),
          skipDuplicates: true,
        });
      }

      // 2. Blog categories: delete posts first (FK constraint), then categories
      // Delete blog post tags first (FK to posts)
      await tx.blog_post_tags.deleteMany();
      await tx.blog_comments.deleteMany();
      await tx.blog_posts.deleteMany();
      await tx.blog_categories.deleteMany();

      if (data.blogCategories.length > 0) {
        await tx.blog_categories.createMany({
          data: data.blogCategories.map((c: Record<string, unknown>) => ({
            id: c.id as number,
            name: c.name as string,
            slug: c.slug as string,
            description: c.description as string | null,
            parent_id: c.parent_id as number | null,
          })),
          skipDuplicates: true,
        });
      }

      // 3. Blog posts
      if (data.blogPosts.length > 0) {
        await tx.blog_posts.createMany({
          data: data.blogPosts.map((p: Record<string, unknown>) => ({
            id: p.id as number,
            title: p.title as string,
            slug: p.slug as string,
            excerpt: p.excerpt as string | null,
            content: p.content as string,
            image_path: p.image_path as string | null,
            featured: (p.featured as boolean) || false,
            status: (p.status as "draft" | "pending" | "published" | "archived") || "draft",
            published_at: p.published_at ? new Date(p.published_at as string) : null,
            category_id: p.category_id as number | null,
            author_id: p.author_id as number | null,
            views: (p.views as number) || 0,
            meta_title: p.meta_title as string | null,
            meta_description: p.meta_description as string | null,
            meta_keywords: p.meta_keywords as string | null,
          })),
          skipDuplicates: true,
        });
      }

      // 4. Candidates: delete all, recreate
      await tx.candidates.deleteMany();
      if (data.candidates.length > 0) {
        await tx.candidates.createMany({
          data: data.candidates.map((c: Record<string, unknown>) => ({
            id: c.id as number,
            name: c.name as string,
            email: c.email as string,
            phone: c.phone as string,
            position: c.position as string,
            job_id: c.job_id as number | null,
            resume_path: (c.resume_path as string) || "",
            status: (c.status as "New") || "New",
            submitted_at: new Date(c.submitted_at as string),
            notes: c.notes as string | null,
          })),
          skipDuplicates: true,
        });
      }

      // 5. Inquiries: delete all, recreate
      await tx.inquiries.deleteMany();
      if (data.inquiries.length > 0) {
        await tx.inquiries.createMany({
          data: data.inquiries.map((i: Record<string, unknown>) => ({
            id: i.id as number,
            name: i.name as string,
            email: i.email as string,
            phone: i.phone as string | null,
            company: i.company as string | null,
            form_type: (i.form_type as "general_inquiry") || "general_inquiry",
            message: i.message as string,
            status: (i.status as "New") || "New",
            submitted_at: new Date(i.submitted_at as string),
            services: i.services as string | null,
            meeting_date: i.meeting_date ? new Date(i.meeting_date as string) : null,
            meeting_time: i.meeting_time as string | null,
            timezone: i.timezone as string | null,
            service_type: i.service_type as string | null,
            business_industry: i.business_industry as string | null,
            implementation_timeline: i.implementation_timeline as string | null,
            requirements: i.requirements as string | null,
            additional_comments: i.additional_comments as string | null,
            admin_notes: i.admin_notes as string | null,
          })),
          skipDuplicates: true,
        });
      }
    });

    // Log the restore action
    await notifySystem(
      "Data Restored",
      `Backup restored by ${session.user.email} (exported at ${backup.exportedAt || "unknown"})`,
      "warning"
    );

    return NextResponse.json({
      success: true,
      message: "Backup restored successfully.",
      restored: {
        settings: data.settings.length,
        blogCategories: data.blogCategories.length,
        blogPosts: data.blogPosts.length,
        candidates: data.candidates.length,
        inquiries: data.inquiries.length,
      },
    });
  } catch (error) {
    console.error("Backup restore error:", error);
    return NextResponse.json(
      { error: "Failed to restore backup. The operation has been rolled back." },
      { status: 500 }
    );
  }
}
