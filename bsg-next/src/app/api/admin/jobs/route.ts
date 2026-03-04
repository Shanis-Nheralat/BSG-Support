import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const status = searchParams.get("status");
    const department = searchParams.get("department");
    const search = searchParams.get("search");

    // Build where clause
    const where: Record<string, unknown> = {};
    if (status && status !== "all") {
      where.status = status;
    }
    if (department && department !== "all") {
      where.department = department;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { department: { contains: search } },
        { location: { contains: search } },
      ];
    }

    const [jobs, total, departments] = await Promise.all([
      prisma.job_postings.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: { candidates: true },
          },
        },
      }),
      prisma.job_postings.count({ where }),
      prisma.job_postings.groupBy({
        by: ["department"],
        _count: { department: true },
      }),
    ]);

    return NextResponse.json({
      jobs,
      departments: departments.map((d) => d.department),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Validate required fields
    if (!title || !department || !location || !employment_type || !description) {
      return NextResponse.json(
        { error: "Missing required fields: title, department, location, employment_type, description" },
        { status: 400 }
      );
    }

    // Generate slug
    let slug = generateSlug(title);
    
    // Check for duplicate slug and append timestamp if needed
    const existingJob = await prisma.job_postings.findUnique({
      where: { slug },
    });
    if (existingJob) {
      slug = `${slug}-${Date.now()}`;
    }

    const job = await prisma.job_postings.create({
      data: {
        title,
        slug,
        department,
        location,
        employment_type,
        experience: experience || null,
        salary_range: salary_range || null,
        description,
        requirements: requirements || null,
        benefits: benefits || null,
        status: status || "draft",
        featured: featured || false,
        published_at: status === "published" ? new Date() : null,
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
