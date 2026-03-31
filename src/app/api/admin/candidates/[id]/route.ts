import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: { id: string };
}

// GET - Get a single candidate
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const candidateId = parseInt(params.id);
  if (isNaN(candidateId)) {
    return NextResponse.json({ error: "Invalid candidate ID" }, { status: 400 });
  }

  try {
    const candidate = await prisma.candidates.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    return NextResponse.json({ candidate });
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidate" },
      { status: 500 }
    );
  }
}

// PATCH - Update candidate (status, notes)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const candidateId = parseInt(params.id);
  if (isNaN(candidateId)) {
    return NextResponse.json({ error: "Invalid candidate ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { status, notes } = body;

    // Check if candidate exists
    const existingCandidate = await prisma.candidates.findUnique({
      where: { id: candidateId },
    });

    if (!existingCandidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {
      updated_at: new Date(),
    };

    if (status !== undefined) {
      const validStatuses = [
        "New",
        "Under Review",
        "Shortlisted",
        "Interviewed",
        "Offered",
        "Hired",
        "Rejected",
      ];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updateData.status = status;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const candidate = await prisma.candidates.update({
      where: { id: candidateId },
      data: updateData,
    });

    return NextResponse.json({ candidate });
  } catch (error) {
    console.error("Error updating candidate:", error);
    return NextResponse.json(
      { error: "Failed to update candidate" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a candidate
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const candidateId = parseInt(params.id);
  if (isNaN(candidateId)) {
    return NextResponse.json({ error: "Invalid candidate ID" }, { status: 400 });
  }

  try {
    const candidate = await prisma.candidates.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    await prisma.candidates.delete({
      where: { id: candidateId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return NextResponse.json(
      { error: "Failed to delete candidate" },
      { status: 500 }
    );
  }
}
