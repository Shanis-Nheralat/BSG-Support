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
