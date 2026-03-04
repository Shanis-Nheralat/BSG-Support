import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader, Badge, Button } from "@/components/ui";
import Card from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { Plus, Edit, Eye } from "lucide-react";
import { DeletePostButton } from "./DeletePostButton";

export const metadata = { title: "Blog Posts" };

interface BlogPageProps {
  searchParams: { page?: string; status?: string; search?: string };
}

const POSTS_PER_PAGE = 10;

export default async function BlogListPage({ searchParams }: BlogPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const page = parseInt(searchParams.page || "1");
  const status = searchParams.status || "all";
  const search = searchParams.search || "";

  // Build where clause
  const where: Record<string, unknown> = {};
  if (status !== "all") {
    where.status = status;
  }
  if (search) {
    where.title = { contains: search };
  }

  const [posts, totalCount, categories] = await Promise.all([
    prisma.blog_posts.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.blog_posts.count({ where }),
    prisma.blog_categories.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  // Create category lookup map
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  function getStatusVariant(status: string) {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "pending":
        return "info";
      case "archived":
        return "default";
      default:
        return "default";
    }
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  }

  return (
    <>
      <PageHeader
        title="Blog Posts"
        description="Manage your blog content"
        actions={
          <Link href="/admin/blog/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <form method="get" className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="search"
              placeholder="Search posts..."
              defaultValue={search}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>
          <Button type="submit" variant="outline" size="sm">
            Filter
          </Button>
          {(search || status !== "all") && (
            <Link href="/admin/blog">
              <Button variant="ghost" size="sm">
                Clear
              </Button>
            </Link>
          )}
        </form>
      </Card>

      {/* Posts Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="truncate font-medium text-gray-900 dark:text-white">
                          {post.title}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          /{post.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {post.category_id
                        ? categoryMap.get(post.category_id) || "—"
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(post.status)} size="sm">
                        {post.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {post.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <DeletePostButton postId={post.id} postTitle={post.title} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No posts found
                    </p>
                    <Link href="/admin/blog/new" className="mt-2 inline-block">
                      <Button size="sm">Create your first post</Button>
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(page - 1) * POSTS_PER_PAGE + 1} to{" "}
              {Math.min(page * POSTS_PER_PAGE, totalCount)} of {totalCount} posts
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/blog?page=${page - 1}${status !== "all" ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                >
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/blog?page=${page + 1}${status !== "all" ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                >
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
