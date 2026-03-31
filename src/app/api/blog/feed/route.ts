import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://backsureglobalsupport.com";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export async function GET() {
  try {
    const posts = await prisma.blog_posts.findMany({
      where: { status: "published" },
      orderBy: { published_at: "desc" },
      take: 50, // Limit to last 50 posts
      include: {
        category: true,
      },
    });

    const rssItems = posts
      .map((post) => {
        const pubDate = post.published_at || post.created_at;
        const description = post.excerpt || stripHtml(post.content).substring(0, 300);
        const imageUrl = post.image_path
          ? post.image_path.startsWith("http")
            ? post.image_path
            : `${SITE_URL}${post.image_path}`
          : null;

        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate.toUTCString()}</pubDate>
      ${post.category ? `<category>${escapeXml(post.category.name)}</category>` : ""}
      ${imageUrl ? `<enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" />` : ""}
    </item>`;
      })
      .join("");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Backsure Global Support Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Explore the latest industry insights, trends, and business support strategies from Backsure Global Support.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/blog/feed" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/images/logo.png</url>
      <title>Backsure Global Support</title>
      <link>${SITE_URL}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
