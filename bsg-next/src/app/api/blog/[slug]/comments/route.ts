import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyNewBlogComment } from "@/lib/notifications";

interface RouteParams {
  params: { slug: string };
}

// GET /api/blog/[slug]/comments - Fetch approved comments for a post
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const post = await prisma.blog_posts.findUnique({
      where: { slug: params.slug, status: "published" },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const comments = await prisma.blog_comments.findMany({
      where: {
        post_id: post.id,
        status: "approved",
      },
      select: {
        id: true,
        author_name: true,
        content: true,
        parent_id: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/blog/[slug]/comments - Submit a new comment (pending approval)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { author_name, author_email, content, parent_id } = body;

    // Validate required fields
    if (!author_name?.trim() || !author_email?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and comment are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(author_email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.trim().length > 2000) {
      return NextResponse.json(
        { error: "Comment must be under 2000 characters" },
        { status: 400 }
      );
    }

    // Find the post
    const post = await prisma.blog_posts.findUnique({
      where: { slug: params.slug, status: "published" },
      select: { id: true, title: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // If replying to a parent comment, verify it exists and belongs to same post
    if (parent_id) {
      const parentComment = await prisma.blog_comments.findFirst({
        where: { id: parent_id, post_id: post.id, status: "approved" },
      });
      if (!parentComment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 400 }
        );
      }
    }

    // Get IP and user agent
    const ip_address =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const user_agent = request.headers.get("user-agent") || null;

    // Create comment with pending status
    await prisma.blog_comments.create({
      data: {
        post_id: post.id,
        parent_id: parent_id || null,
        author_name: author_name.trim(),
        author_email: author_email.trim(),
        content: content.trim(),
        status: "pending",
        ip_address,
        user_agent,
      },
    });

    // Send admin notification
    await notifyNewBlogComment(post.title, author_name.trim());

    return NextResponse.json(
      {
        success: true,
        message: "Your comment has been submitted for review.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting comment:", error);
    return NextResponse.json(
      { error: "Failed to submit comment. Please try again." },
      { status: 500 }
    );
  }
}
