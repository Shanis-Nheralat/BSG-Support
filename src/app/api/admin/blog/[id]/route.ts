import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRole, BLOG_ROLES } from "@/lib/roles";

interface RouteParams {
  params: { id: string };
}

// GET - Get a single post
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check role authorization
  const { authorized } = await checkRole(BLOG_ROLES.READ);
  if (!authorized) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const postId = parseInt(params.id);
  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  try {
    const post = await prisma.blog_posts.findUnique({
      where: { id: postId },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        translations: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Transform tags for easier consumption
    const transformedPost = {
      ...post,
      tags: post.tags.map((pt) => pt.tag),
    };

    return NextResponse.json({ post: transformedPost });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT - Update a post
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check role authorization
  const { authorized } = await checkRole(BLOG_ROLES.UPDATE);
  if (!authorized) {
    return NextResponse.json({ error: "Insufficient permissions to update posts" }, { status: 403 });
  }

  const postId = parseInt(params.id);
  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
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

    // Check if post exists
    const existingPost = await prisma.blog_posts.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if slug is taken by another post
    const slugPost = await prisma.blog_posts.findUnique({
      where: { slug },
    });

    if (slugPost && slugPost.id !== postId) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    // Determine published_at
    let published_at = existingPost.published_at;
    if (status === "published" && !existingPost.published_at) {
      published_at = new Date();
    } else if (status !== "published") {
      published_at = null;
    }

    const post = await prisma.blog_posts.update({
      where: { id: postId },
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        image_path: image_path || null,
        featured: featured || false,
        post_type: post_type || null,
        status: status || "draft",
        category_id,
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        meta_keywords: meta_keywords || null,
        published_at,
        updated_at: new Date(),
      },
    });

    // Handle tags if provided
    if (tags !== undefined && Array.isArray(tags)) {
      // Delete existing tags
      await prisma.blog_post_tags.deleteMany({
        where: { post_id: postId },
      });

      // Add new tags
      for (const tagName of tags) {
        if (!tagName) continue;
        
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
            post_id: postId,
            tag_id: tag.id,
          },
        });
      }
    }

    // Handle translations if provided
    if (translations && Array.isArray(translations)) {
      for (const tr of translations) {
        if (!tr.locale || !tr.title || !tr.slug || !tr.content) continue;

        // Check slug uniqueness for this locale (excluding current post's translation)
        const existingSlug = await prisma.blog_post_translations.findFirst({
          where: {
            locale: tr.locale,
            slug: tr.slug,
            NOT: { post_id: postId },
          },
        });

        if (existingSlug) {
          return NextResponse.json(
            { error: `Translated slug "${tr.slug}" already exists for locale ${tr.locale}` },
            { status: 400 }
          );
        }

        // Upsert translation
        const existing = await prisma.blog_post_translations.findFirst({
          where: { post_id: postId, locale: tr.locale },
        });

        if (existing) {
          await prisma.blog_post_translations.update({
            where: { id: existing.id },
            data: {
              title: tr.title,
              slug: tr.slug,
              excerpt: tr.excerpt || null,
              content: tr.content,
              meta_title: tr.meta_title || null,
              meta_description: tr.meta_description || null,
              auto_translated: tr.auto_translated ?? existing.auto_translated,
              updated_at: new Date(),
            },
          });
        } else {
          await prisma.blog_post_translations.create({
            data: {
              post_id: postId,
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
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete a post (archive it)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check role authorization - DELETE requires admin role
  const { authorized } = await checkRole(BLOG_ROLES.DELETE);
  if (!authorized) {
    return NextResponse.json({ error: "Insufficient permissions to delete posts" }, { status: 403 });
  }

  const postId = parseInt(params.id);
  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  // Check for permanent delete flag
  const { searchParams } = new URL(request.url);
  const permanent = searchParams.get("permanent") === "true";

  try {
    // Check if post exists
    const post = await prisma.blog_posts.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (permanent) {
      // Permanent delete - remove from database
      await prisma.blog_post_tags.deleteMany({
        where: { post_id: postId },
      });

      await prisma.blog_posts.delete({
        where: { id: postId },
      });

      return NextResponse.json({ success: true, message: "Post permanently deleted" });
    } else {
      // Soft delete - archive the post
      await prisma.blog_posts.update({
        where: { id: postId },
        data: {
          status: "archived",
          updated_at: new Date(),
        },
      });

      return NextResponse.json({ success: true, message: "Post archived" });
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
