import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { Calculator, TrendingUp, DollarSign, Users, Eye, Building } from "lucide-react";

export const metadata = { title: "Calculator Submissions" };

interface CalculatorSubmissionsPageProps {
  searchParams: { page?: string; status?: string; search?: string };
}

interface CalculatorRequirements {
  teamSize?: number;
  teamMaturity?: string;
  role?: string;
  currency?: string;
  currentCost?: number;
  bsgCost?: number;
  savings?: number;
  efficiencyGain?: number;
  hoursReclaimed?: number;
  roi?: number;
  targetEfficiency?: string;
}

const ITEMS_PER_PAGE = 15;
const STATUS_OPTIONS = ["New", "In Progress", "Replied", "Closed"];

export default async function CalculatorSubmissionsPage({ searchParams }: CalculatorSubmissionsPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const page = parseInt(searchParams.page || "1");
  const status = searchParams.status || "all";
  const search = searchParams.search || "";

  // Build where clause - only calculator leads
  const where: Record<string, unknown> = {
    form_type: "service_intake",
    message: { contains: "[Calculator Lead]" },
  };

  if (status !== "all") {
    where.status = status === "In Progress" ? "In_Progress" : status;
  }
  if (search) {
    where.AND = [
      { message: { contains: "[Calculator Lead]" } },
      {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { company: { contains: search } },
        ],
      },
    ];
    delete where.message;
  }

  const [submissions, totalCount, statusCounts, totals] = await Promise.all([
    prisma.inquiries.findMany({
      where,
      orderBy: { submitted_at: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.inquiries.count({ where }),
    prisma.inquiries.groupBy({
      by: ["status"],
      where: { form_type: "service_intake", message: { contains: "[Calculator Lead]" } },
      _count: { status: true },
    }),
    // Get total calculator leads for stats
    prisma.inquiries.count({
      where: { form_type: "service_intake", message: { contains: "[Calculator Lead]" } },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const statusCountMap = new Map<string, number>(
    statusCounts.map((s) => [s.status as string, s._count.status])
  );

  function getStatusVariant(status: string) {
    switch (status) {
      case "New": return "info";
      case "In_Progress":
      case "In Progress": return "warning";
      case "Replied": return "success";
      case "Closed": return "default";
      default: return "default";
    }
  }

  function formatDate(date: Date | null) {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatCurrency(amount: number | undefined, currency: string = "AED") {
    if (amount === undefined || amount === null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function parseRequirements(reqString: string | null): CalculatorRequirements | null {
    if (!reqString) return null;
    try {
      return JSON.parse(reqString) as CalculatorRequirements;
    } catch {
      return null;
    }
  }

  // Calculate aggregate stats
  let totalSavings = 0;
  let avgROI = 0;
  let totalEmployees = 0;
  let validCount = 0;

  submissions.forEach((sub) => {
    const req = parseRequirements(sub.requirements);
    if (req) {
      if (req.savings) totalSavings += req.savings;
      if (req.roi) avgROI += req.roi;
      if (req.teamSize) totalEmployees += req.teamSize;
      validCount++;
    }
  });

  if (validCount > 0) {
    avgROI = avgROI / validCount;
  }

  return (
    <>
      <PageHeader
        title="Calculator Submissions"
        description="Efficiency calculator leads with detailed analysis data"
      />

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-navy/10 p-2 dark:bg-navy-400/20">
              <Calculator className="h-5 w-5 text-navy dark:text-navy-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totals}</p>
              <p className="text-xs text-gray-500">Total Submissions</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalSavings, "AED")}</p>
              <p className="text-xs text-gray-500">Total Projected Savings</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gold/20 p-2">
              <TrendingUp className="h-5 w-5 text-gold-dark" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgROI.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Average ROI</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEmployees}</p>
              <p className="text-xs text-gray-500">Total Employees Analyzed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <form className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              name="search"
              placeholder="Search by name, email, or company..."
              defaultValue={search}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:ring-1 focus:ring-navy dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-navy focus:ring-1 focus:ring-navy dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Statuses ({totals})</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s} ({statusCountMap.get(s === "In Progress" ? "In_Progress" : s) || 0})
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-600"
          >
            Filter
          </button>
        </form>
      </Card>

      {/* Submissions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Team</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Savings</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-400">ROI</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No calculator submissions found.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => {
                  const req = parseRequirements(sub.requirements);
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 dark:text-white">{sub.name}</div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {sub.company || "N/A"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">{sub.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 dark:text-white">{sub.service_type}</div>
                        <div className="text-xs text-gray-500">
                          {req?.teamSize || "?"} employees | {req?.role || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="font-bold text-green-600 dark:text-green-400">
                          {req ? formatCurrency(req.savings, req.currency) : "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">{req?.currency || "AED"}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="font-bold text-navy dark:text-gold">
                          {req?.roi?.toFixed(1) || "0"}%
                        </div>
                        <div className="text-xs text-gray-500">
                          +{req?.efficiencyGain?.toFixed(0) || "0"}% efficiency
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={getStatusVariant(sub.status || "New")}>
                          {sub.status === "In_Progress" ? "In Progress" : sub.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="text-sm text-gray-900 dark:text-white">{formatDate(sub.submitted_at)}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/admin/inquiries/${sub.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-navy/10 px-3 py-1.5 text-xs font-medium text-navy hover:bg-navy/20 dark:bg-navy-400/20 dark:text-navy-300"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(page * ITEMS_PER_PAGE, totalCount)} of {totalCount} submissions
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/calculator-submissions?page=${page - 1}&status=${status}&search=${search}`}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/calculator-submissions?page=${page + 1}&status=${status}&search=${search}`}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
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
