import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { MessageSquare, Mail, Phone, Building, Calendar, Eye } from "lucide-react";

export const metadata = { title: "Inquiries" };

interface InquiriesPageProps {
  searchParams: { page?: string; status?: string; type?: string; search?: string };
}

const INQUIRIES_PER_PAGE = 15;

const STATUS_OPTIONS = ["New", "In Progress", "Replied", "Closed"];
const FORM_TYPE_OPTIONS = [
  { value: "general_inquiry", label: "General Inquiry" },
  { value: "meeting_request", label: "Meeting Request" },
  { value: "service_intake", label: "Service Intake" },
];

export default async function InquiriesListPage({ searchParams }: InquiriesPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const page = parseInt(searchParams.page || "1");
  const status = searchParams.status || "all";
  const formType = searchParams.type || "all";
  const search = searchParams.search || "";

  // Build where clause
  const where: Record<string, unknown> = {};
  if (status !== "all") {
    where.status = status === "In Progress" ? "In_Progress" : status;
  }
  if (formType !== "all") {
    where.form_type = formType;
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { company: { contains: search } },
    ];
  }

  const [inquiries, totalCount, statusCounts] = await Promise.all([
    prisma.inquiries.findMany({
      where,
      orderBy: { submitted_at: "desc" },
      skip: (page - 1) * INQUIRIES_PER_PAGE,
      take: INQUIRIES_PER_PAGE,
    }),
    prisma.inquiries.count({ where }),
    prisma.inquiries.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / INQUIRIES_PER_PAGE);

  const statusCountMap = new Map<string, number>(
    statusCounts.map((s) => [s.status as string, s._count.status])
  );

  function getStatusVariant(status: string) {
    switch (status) {
      case "New":
        return "info";
      case "In_Progress":
      case "In Progress":
        return "warning";
      case "Replied":
        return "success";
      case "Closed":
        return "default";
      default:
        return "default";
    }
  }

  function getFormTypeLabel(formType: string) {
    const type = FORM_TYPE_OPTIONS.find((t) => t.value === formType);
    return type?.label || formType;
  }

  function formatDate(date: Date | null) {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function truncateMessage(message: string, maxLength: number = 100) {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength).trim() + "...";
  }

  return (
    <>
      <PageHeader
        title="Inquiries"
        description={`${totalCount} total inquiries`}
      />

      {/* Status Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/inquiries"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            status === "all"
              ? "bg-navy text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          All
        </Link>
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s}
            href={`/admin/inquiries?status=${encodeURIComponent(s)}`}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              status === s
                ? "bg-navy text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {s} ({statusCountMap.get(s === "In Progress" ? "In_Progress" : s) || 0})
          </Link>
        ))}
      </div>

      {/* Search & Filter */}
      <Card className="mb-6">
        <form className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by name, email, or company..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <select
            name="type"
            defaultValue={formType}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Types</option>
            {FORM_TYPE_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-navy px-6 py-2 text-sm font-medium text-white hover:bg-navy-600"
          >
            Search
          </button>
        </form>
      </Card>

      {/* Inquiries List */}
      {inquiries.length === 0 ? (
        <Card className="py-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No inquiries found
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {search || status !== "all" || formType !== "all"
              ? "Try adjusting your filters"
              : "Inquiries will appear here when visitors submit contact forms"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id} className="transition-shadow hover:shadow-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {inquiry.name}
                    </span>
                    <Badge variant={getStatusVariant(inquiry.status || "New")}>
                      {(inquiry.status || "New").replace("_", " ")}
                    </Badge>
                    <Badge variant="default">
                      {getFormTypeLabel(inquiry.form_type)}
                    </Badge>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {inquiry.email}
                    </span>
                    {inquiry.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {inquiry.phone}
                      </span>
                    )}
                    {inquiry.company && (
                      <span className="flex items-center gap-1">
                        <Building className="h-3.5 w-3.5" />
                        {inquiry.company}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(inquiry.submitted_at)}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {truncateMessage(inquiry.message)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Mail className="h-4 w-4" />
                    Reply
                  </a>
                  <Link
                    href={`/admin/inquiries/${inquiry.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-navy px-3 py-2 text-sm font-medium text-white hover:bg-navy-600"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/admin/inquiries?page=${page - 1}${status !== "all" ? `&status=${status}` : ""}${formType !== "all" ? `&type=${formType}` : ""}${search ? `&search=${search}` : ""}`}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/inquiries?page=${page + 1}${status !== "all" ? `&status=${status}` : ""}${formType !== "all" ? `&type=${formType}` : ""}${search ? `&search=${search}` : ""}`}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </>
  );
}
