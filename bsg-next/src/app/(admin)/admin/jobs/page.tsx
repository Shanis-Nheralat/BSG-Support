import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader, Badge, Button } from "@/components/ui";
import Card from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { Plus, Edit, Eye, Users } from "lucide-react";
import { DeleteJobButton } from "./DeleteJobButton";

export const metadata = { title: "Job Postings" };

interface JobsPageProps {
  searchParams: { page?: string; status?: string; department?: string; search?: string };
}

const JOBS_PER_PAGE = 15;

export default async function JobsListPage({ searchParams }: JobsPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const page = parseInt(searchParams.page || "1");
  const status = searchParams.status || "all";
  const department = searchParams.department || "all";
  const search = searchParams.search || "";

  // Build where clause
  const where: Record<string, unknown> = {};
  if (status !== "all") {
    where.status = status;
  }
  if (department !== "all") {
    where.department = department;
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { location: { contains: search } },
    ];
  }

  const [jobs, totalCount, departments, statusCounts] = await Promise.all([
    prisma.job_postings.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * JOBS_PER_PAGE,
      take: JOBS_PER_PAGE,
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
    prisma.job_postings.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);

  // Stats
  const publishedCount = statusCounts.find((s) => s.status === "published")?._count.status || 0;
  const draftCount = statusCounts.find((s) => s.status === "draft")?._count.status || 0;
  const totalApplications = jobs.reduce((sum, job) => sum + job._count.candidates, 0);

  function getStatusVariant(status: string) {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "closed":
        return "default";
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
        title="Job Postings"
        description="Manage job listings and applications"
        actions={
          <Link href="/admin/jobs/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Job
            </Button>
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-navy-600">{totalCount}</p>
          <p className="text-sm text-gray-500">Total Jobs</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
          <p className="text-sm text-gray-500">Published</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-amber-600">{draftCount}</p>
          <p className="text-sm text-gray-500">Drafts</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-blue-600">{totalApplications}</p>
          <p className="text-sm text-gray-500">Total Applications</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <form method="get" className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="search"
              placeholder="Search jobs..."
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
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
          <select
            name="department"
            defaultValue={department}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.department} value={d.department}>
                {d.department} ({d._count.department})
              </option>
            ))}
          </select>
          <Button type="submit" variant="outline" size="sm">
            Filter
          </Button>
          {(search || status !== "all" || department !== "all") && (
            <Link href="/admin/jobs">
              <Button variant="ghost" size="sm">
                Clear
              </Button>
            </Link>
          )}
        </form>
      </Card>

      {/* Jobs Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Applicants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Posted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="truncate font-medium text-gray-900 dark:text-white">
                          {job.title}
                          {job.featured && (
                            <span className="ml-2 inline-flex items-center rounded bg-gold-100 px-1.5 py-0.5 text-xs font-medium text-gold-800">
                              Featured
                            </span>
                          )}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {job.employment_type}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {job.department}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {job.location}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(job.status)} size="sm">
                        {job.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        {job._count.candidates}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(job.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {job.status === "published" && (
                          <Link
                            href={`/careers/${job.slug}`}
                            target="_blank"
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                            title="View on site"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/jobs/${job.id}`}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <DeleteJobButton jobId={job.id} jobTitle={job.title} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No job postings found
                    </p>
                    <Link href="/admin/jobs/new" className="mt-2 inline-block">
                      <Button size="sm">Create your first job posting</Button>
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
              Showing {(page - 1) * JOBS_PER_PAGE + 1} to{" "}
              {Math.min(page * JOBS_PER_PAGE, totalCount)} of {totalCount} jobs
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/jobs?page=${page - 1}${status !== "all" ? `&status=${status}` : ""}${department !== "all" ? `&department=${department}` : ""}${search ? `&search=${search}` : ""}`}
                >
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/jobs?page=${page + 1}${status !== "all" ? `&status=${status}` : ""}${department !== "all" ? `&department=${department}` : ""}${search ? `&search=${search}` : ""}`}
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
