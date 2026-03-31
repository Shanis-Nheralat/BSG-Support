import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRole, CATEGORY_ROLES } from "@/lib/roles";

interface RouteParams {
  params: { id: string };
}

// GET - Get a single category
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { authorized } = await checkRole(CATEGORY_ROLES.READ);
  if (!authorized) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const categoryId = parseInt(params.id);
  if (isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  try {
    const category = await prisma.blog_categories.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT - Update a category
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { authorized } = await checkRole(CATEGORY_ROLES.UPDATE);
  if (!authorized) {
    return NextResponse.json({ error: "Insufficient permissions to update categories" }, { status: 403 });
  }

  const categoryId = parseInt(params.id);
  if (isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.blog_categories.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Generate new slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check if slug is taken by another category
    const slugCategory = await prisma.blog_categories.findUnique({
      where: { slug },
    });

    if (slugCategory && slugCategory.id !== categoryId) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.blog_categories.update({
      where: { id: categoryId },
      data: {
        name: name.trim(),
        slug,
        description: description || null,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { authorized } = await checkRole(CATEGORY_ROLES.DELETE);
  if (!authorized) {
    return NextResponse.json({ error: "Insufficient permissions to delete categories" }, { status: 403 });
  }

  const categoryId = parseInt(params.id);
  if (isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  try {
    // Check if category exists
    const category = await prisma.blog_categories.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Check if category has posts
    if (category._count.posts > 0) {
      // Option: Set posts' category_id to null instead of blocking deletion
      await prisma.blog_posts.updateMany({
        where: { category_id: categoryId },
        data: { category_id: null },
      });
    }

    // Delete the category
    await prisma.blog_categories.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
