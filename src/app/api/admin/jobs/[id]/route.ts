import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const job = await prisma.job_postings.findUnique({
      where: { id },
      include: {
        candidates: {
          orderBy: { submitted_at: "desc" },
          take: 10,
        },
        translations: true,
        _count: {
          select: { candidates: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const existingJob = await prisma.job_postings.findUnique({
      where: { id },
    });

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      department,
      location,
      employment_type,
      experience,
      salary_range,
      description,
      requirements,
      benefits,
      status,
      featured,
      translations,
    } = body;

    // Handle published_at based on status change
    let published_at = existingJob.published_at;
    if (status === "published" && existingJob.status !== "published") {
      published_at = new Date();
    } else if (status !== "published") {
      published_at = null;
    }

    const job = await prisma.job_postings.update({
      where: { id },
      data: {
        title: title ?? existingJob.title,
        department: department ?? existingJob.department,
        location: location ?? existingJob.location,
        employment_type: employment_type ?? existingJob.employment_type,
        experience: experience !== undefined ? experience : existingJob.experience,
        salary_range: salary_range !== undefined ? salary_range : existingJob.salary_range,
        description: description ?? existingJob.description,
        requirements: requirements !== undefined ? requirements : existingJob.requirements,
        benefits: benefits !== undefined ? benefits : existingJob.benefits,
        status: status ?? existingJob.status,
        featured: featured !== undefined ? featured : existingJob.featured,
        published_at,
        updated_at: new Date(),
      },
    });

    // Handle translations if provided
    if (translations && Array.isArray(translations)) {
      for (const tr of translations) {
        if (!tr.locale || !tr.title || !tr.slug || !tr.description) continue;

        // Check slug uniqueness for this locale (excluding current job's translation)
        const existingSlug = await prisma.job_posting_translations.findFirst({
          where: {
            locale: tr.locale,
            slug: tr.slug,
            NOT: { job_id: id },
          },
        });

        if (existingSlug) {
          return NextResponse.json(
            { error: `Translated slug "${tr.slug}" already exists for locale ${tr.locale}` },
            { status: 400 }
          );
        }

        // Upsert translation
        const existing = await prisma.job_posting_translations.findFirst({
          where: { job_id: id, locale: tr.locale },
        });

        if (existing) {
          await prisma.job_posting_translations.update({
            where: { id: existing.id },
            data: {
              title: tr.title,
              slug: tr.slug,
              location: tr.location || null,
              description: tr.description,
              requirements: tr.requirements || null,
              benefits: tr.benefits || null,
              meta_title: tr.meta_title || null,
              meta_description: tr.meta_description || null,
              auto_translated: tr.auto_translated ?? existing.auto_translated,
              updated_at: new Date(),
            },
          });
        } else {
          await prisma.job_posting_translations.create({
            data: {
              job_id: id,
              locale: tr.locale,
              title: tr.title,
              slug: tr.slug,
              location: tr.location || null,
              description: tr.description,
              requirements: tr.requirements || null,
              benefits: tr.benefits || null,
              meta_title: tr.meta_title || null,
              meta_description: tr.meta_description || null,
              auto_translated: tr.auto_translated ?? true,
            },
          });
        }
      }
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const existingJob = await prisma.job_postings.findUnique({
      where: { id },
    });

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Update candidates to remove job association before deleting
    await prisma.candidates.updateMany({
      where: { job_id: id },
      data: { job_id: null },
    });

    await prisma.job_postings.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
