import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Public blog listing with search, filtering, and pagination
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12") || 12));
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const featured = searchParams.get("featured");
  const locale = searchParams.get("locale") || "en";

  try {
    // Build where clause - only published posts
    const where: Record<string, unknown> = {
      status: "published",
    };

    // Search filter (title, excerpt)
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    // Category filter (by slug)
    if (category && category !== "all") {
      const categoryRecord = await prisma.blog_categories.findUnique({
        where: { slug: category },
      });
      if (categoryRecord) {
        where.category_id = categoryRecord.id;
      }
    }

    // Featured filter
    if (featured === "true") {
      where.featured = true;
    }

    // Tag filter (by slug)
    if (tag) {
      const tagRecord = await prisma.blog_tags.findFirst({
        where: { slug: tag },
      });
      if (tagRecord) {
        where.tags = {
          some: {
            tag_id: tagRecord.id,
          },
        };
      }
    }

    const [posts, total, categories, tags] = await Promise.all([
      prisma.blog_posts.findMany({
        where,
        orderBy: [
          { featured: "desc" },
          { published_at: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image_path: true,
          featured: true,
          published_at: true,
          views: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          translations: {
            where: { locale },
            select: {
              title: true,
              slug: true,
              excerpt: true,
            },
            take: 1,
          },
        },
      }),
      prisma.blog_posts.count({ where }),
      // Get all categories with post counts (for filter UI)
      prisma.blog_categories.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: {
              posts: {
                where: { status: "published" },
              },
            },
          },
        },
      }),
      // Get popular tags (for filter UI)
      prisma.blog_tags.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
        take: 20,
      }),
    ]);

    // Transform posts to flatten tags and overlay translations
    const transformedPosts = posts.map((post) => {
      const tr = post.translations[0];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { translations: _tr, ...rest } = post;
      return {
        ...rest,
        title: tr?.title ?? post.title,
        slug: tr?.slug ?? post.slug,
        excerpt: tr?.excerpt ?? post.excerpt,
        tags: post.tags.map((pt) => pt.tag),
      };
    });

    // Filter categories and tags that have posts
    const activeCategories = categories.filter((c) => c._count.posts > 0);
    const activeTags = tags.filter((t) => t._count.posts > 0);

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      filters: {
        categories: activeCategories,
        tags: activeTags,
      },
    });
  } catch (error) {
    console.error("Error fetching public blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
