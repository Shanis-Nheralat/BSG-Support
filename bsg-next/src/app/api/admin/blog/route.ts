import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRole, BLOG_ROLES } from "@/lib/roles";

// GET - List all posts (with pagination and search)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check role authorization
  const { authorized } = await checkRole(BLOG_ROLES.READ);
  if (!authorized) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10") || 10));
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  try {
    const where: Record<string, unknown> = {};
    
    // Status filter
    if (status && status !== "all") {
      where.status = status;
    }
    
    // Search filter (title, excerpt, content)
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }
    
    // Category filter
    if (category && category !== "all") {
      where.category_id = parseInt(category);
    }

    const [posts, total] = await Promise.all([
      prisma.blog_posts.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
        },
      }),
      prisma.blog_posts.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST - Create a new post
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check role authorization
  const { authorized } = await checkRole(BLOG_ROLES.CREATE);
  if (!authorized) {
    return NextResponse.json({ error: "Insufficient permissions to create posts" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      image_path,
      featured,
      status,
      category_id,
      meta_title,
      meta_description,
      meta_keywords,
      tags,
    } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await prisma.blog_posts.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    // Create post
    const post = await prisma.blog_posts.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        image_path: image_path || null,
        featured: featured || false,
        status: status || "draft",
        category_id: category_id || null,
        author_id: session.user.id ? parseInt(session.user.id) : null,
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        meta_keywords: meta_keywords || null,
        published_at: status === "published" ? new Date() : null,
      },
    });

    // Handle tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        // Find or create tag
        let tag = await prisma.blog_tags.findFirst({
          where: { name: tagName },
        });

        if (!tag) {
          tag = await prisma.blog_tags.create({
            data: {
              name: tagName,
              slug: tagName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
            },
          });
        }

        // Create post-tag relationship
        await prisma.blog_post_tags.create({
          data: {
            post_id: post.id,
            tag_id: tag.id,
          },
        });
      }
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
