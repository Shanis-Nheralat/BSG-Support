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
          translations: {
            select: { locale: true, auto_translated: true },
          },
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
      post_type,
      status,
      category_id,
      meta_title,
      meta_description,
      meta_keywords,
      tags,
      translations,
    } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    if (!category_id) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // Validate status enum value
    const validStatuses = ["draft", "pending", "published", "archived"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status "${status}". Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate category_id is a valid number
    if (isNaN(Number(category_id))) {
      return NextResponse.json(
        { error: "Invalid category selected. Please choose a valid category." },
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
    const authorId = session.user.id ? parseInt(session.user.id) : null;
    const post = await prisma.blog_posts.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        image_path: image_path || null,
        featured: featured || false,
        post_type: post_type || null,
        status: status || "draft",
        category_id: Number(category_id),
        author_id: isNaN(authorId as number) ? null : authorId,
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

    // Handle translations if provided
    if (translations && Array.isArray(translations)) {
      for (const tr of translations) {
        if (!tr.locale || !tr.title || !tr.slug || !tr.content) continue;

        await prisma.blog_post_translations.create({
          data: {
            post_id: post.id,
            locale: tr.locale,
            title: tr.title,
            slug: tr.slug,
            excerpt: tr.excerpt || null,
            content: tr.content,
            meta_title: tr.meta_title || null,
            meta_description: tr.meta_description || null,
            auto_translated: tr.auto_translated ?? true,
          },
        });
      }
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);

    // Provide specific error messages based on the error type
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code: string; meta?: { target?: string[] | string; field_name?: string; cause?: string } };

      switch (prismaError.code) {
        case "P2002": {
          const target = prismaError.meta?.target;
          const field = Array.isArray(target) ? target.join(", ") : target || "field";
          return NextResponse.json(
            { error: `A post with this ${field} already exists. Please use a unique value.` },
            { status: 409 }
          );
        }
        case "P2003": {
          const fieldName = prismaError.meta?.field_name || "reference";
          return NextResponse.json(
            { error: `Invalid reference: the selected ${fieldName} does not exist. Please check your selections.` },
            { status: 400 }
          );
        }
        case "P2011": {
          const field = prismaError.meta?.target || "field";
          return NextResponse.json(
            { error: `Required field "${field}" cannot be empty.` },
            { status: 400 }
          );
        }
        case "P2012": {
          return NextResponse.json(
            { error: `A required field is missing from the request.` },
            { status: 400 }
          );
        }
        case "P2006": {
          return NextResponse.json(
            { error: `Invalid value provided for one of the fields. Please check your input.` },
            { status: 400 }
          );
        }
        default:
          break;
      }
    }

    // Check for validation-type errors in the message
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("Argument") && message.includes("needs to be")) {
      // Prisma validation error - extract meaningful part
      const match = message.match(/Argument `(\w+)`:.*?needs to be (.+)/);
      if (match) {
        return NextResponse.json(
          { error: `Invalid value for "${match[1]}": expected ${match[2]}.` },
          { status: 400 }
        );
      }
    }

    if (message.includes("Invalid value for argument")) {
      return NextResponse.json(
        { error: `Invalid data provided: ${message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Failed to create post: ${message}` },
      { status: 500 }
    );
  }
}
