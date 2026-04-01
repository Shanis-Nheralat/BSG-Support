import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { Eye, Download, Mail, Briefcase } from "lucide-react";

export const metadata = { title: "Candidates" };

interface CandidatesPageProps {
  searchParams: { page?: string; status?: string; search?: string; job?: string };
}

const CANDIDATES_PER_PAGE = 15;

const STATUS_OPTIONS = [
  "New",
  "Under Review",
  "Shortlisted",
  "Interviewed",
  "Offered",
  "Hired",
  "Rejected",
];

export default async function CandidatesListPage({ searchParams }: CandidatesPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const page = parseInt(searchParams.page || "1");
  const status = searchParams.status || "all";
  const search = searchParams.search || "";
  const jobFilter = searchParams.job || "all";

  // Build where clause
  const where: Record<string, unknown> = {};
  if (status !== "all") {
    where.status = status;
  }
  if (jobFilter !== "all") {
    where.job_id = parseInt(jobFilter);
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { position: { contains: search } },
    ];
  }

  const [candidates, totalCount, statusCounts, jobPostings] = await Promise.all([
    prisma.candidates.findMany({
      where,
      orderBy: { submitted_at: "desc" },
      skip: (page - 1) * CANDIDATES_PER_PAGE,
      take: CANDIDATES_PER_PAGE,
      include: {
        job: {
          select: { id: true, title: true, slug: true },
        },
      },
    }),
    prisma.candidates.count({ where }),
    prisma.candidates.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.job_postings.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / CANDIDATES_PER_PAGE);

  // Create status count map (use string keys for lookup)
  const statusCountMap = new Map<string, number>(
    statusCounts.map((s) => [s.status as string, s._count.status])
  );

  function getStatusVariant(status: string) {
    switch (status) {
      case "New":
        return "info";
      case "Under Review":
        return "warning";
      case "Shortlisted":
        return "default";
      case "Interviewed":
        return "default";
      case "Offered":
        return "success";
      case "Hired":
        return "success";
      case "Rejected":
        return "danger";
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
        title="Candidates"
        description="Review and manage job applications"
      />

      {/* Status Filter Tabs */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/candidates"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              status === "all"
                ? "bg-navy-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            All ({totalCount})
          </Link>
          {STATUS_OPTIONS.map((s) => (
            <Link
              key={s}
              href={`/admin/candidates?status=${encodeURIComponent(s)}`}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                status === s
                  ? "bg-navy-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {s} ({statusCountMap.get(s) || 0})
            </Link>
          ))}
        </div>
      </Card>

      {/* Search */}
      <Card className="mb-6">
        <form method="get" className="flex flex-wrap gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search by name, email, or position..."
            defaultValue={search}
            className="flex-1 min-w-[200px] rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <select
            name="job"
            defaultValue={jobFilter}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Jobs</option>
            {jobPostings.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          {status !== "all" && (
            <input type="hidden" name="status" value={status} />
          )}
          <button
            type="submit"
            className="rounded-lg bg-navy-600 px-6 py-2 text-sm font-medium text-white hover:bg-navy-700"
          >
            Search
          </button>
          {(search || jobFilter !== "all") && (
            <Link
              href={`/admin/candidates${status !== "all" ? `?status=${status}` : ""}`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
            >
              Clear
            </Link>
          )}
        </form>
      </Card>

      {/* Candidates Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Job Posting
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Applied
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {candidate.name}
                        </p>
                        <p className="text-sm text-gray-500">{candidate.email}</p>
                        <p className="text-xs text-gray-400">{candidate.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {candidate.position}
                    </td>
                    <td className="px-6 py-4">
                      {candidate.job ? (
                        <Link
                          href={`/admin/jobs/${candidate.job.id}`}
                          className="inline-flex items-center gap-1 text-sm text-navy-600 hover:underline"
                        >
                          <Briefcase className="h-3.5 w-3.5" />
                          {candidate.job.title}
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400">General</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(candidate.status)} size="sm">
                        {candidate.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(candidate.submitted_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/candidates/${candidate.id}`}
                          className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-navy-600 dark:hover:bg-gray-700"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <a
                          href={`mailto:${candidate.email}`}
                          className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-green-600 dark:hover:bg-gray-700"
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                        {candidate.resume_path && (
                          <a
                            href={candidate.resume_path.startsWith("http") ? candidate.resume_path : `/uploads/resumes/${candidate.resume_path}`}
                            target="_blank"
                            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700"
                            title="Download Resume"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No candidates found
                    </p>
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
              Showing {(page - 1) * CANDIDATES_PER_PAGE + 1} to{" "}
              {Math.min(page * CANDIDATES_PER_PAGE, totalCount)} of {totalCount} candidates
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/candidates?page=${page - 1}${status !== "all" ? `&status=${encodeURIComponent(status)}` : ""}${jobFilter !== "all" ? `&job=${jobFilter}` : ""}${search ? `&search=${search}` : ""}`}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/candidates?page=${page + 1}${status !== "all" ? `&status=${encodeURIComponent(status)}` : ""}${jobFilter !== "all" ? `&job=${jobFilter}` : ""}${search ? `&search=${search}` : ""}`}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
