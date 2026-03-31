import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { CalendarDays, Mail, Phone, Building, Calendar, Eye, Settings } from "lucide-react";

export const metadata = { title: "Meeting Bookings" };

interface SchedulePageProps {
  searchParams: { page?: string; status?: string; search?: string };
}

const BOOKINGS_PER_PAGE = 15;
const STATUS_OPTIONS = ["Confirmed", "Completed", "Cancelled", "No Show"];

export default async function ScheduleListPage({ searchParams }: SchedulePageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const page = parseInt(searchParams.page || "1");
  const status = searchParams.status || "all";
  const search = searchParams.search || "";

  const where: Record<string, unknown> = {};
  if (status !== "all") {
    where.status = status === "No Show" ? "No_Show" : status;
  }
  if (search) {
    where.OR = [
      { visitor_name: { contains: search } },
      { visitor_email: { contains: search } },
      { visitor_company: { contains: search } },
    ];
  }

  const [bookings, totalCount, statusCounts] = await Promise.all([
    prisma.meeting_bookings.findMany({
      where,
      orderBy: { booking_date: "desc" },
      skip: (page - 1) * BOOKINGS_PER_PAGE,
      take: BOOKINGS_PER_PAGE,
    }),
    prisma.meeting_bookings.count({ where }),
    prisma.meeting_bookings.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / BOOKINGS_PER_PAGE);
  const statusCountMap = new Map<string, number>(
    statusCounts.map((s) => [s.status as string, s._count.status])
  );

  function getStatusVariant(s: string) {
    switch (s) {
      case "Confirmed": return "info";
      case "Completed": return "success";
      case "Cancelled": return "default";
      case "No_Show":
      case "No Show": return "warning";
      default: return "default";
    }
  }

  function formatBookingDate(date: Date | null) {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Dubai",
    });
  }

  function formatTime(time: string) {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <PageHeader
          title="Meeting Bookings"
          description={`${totalCount} total bookings`}
        />
        <Link
          href="/admin/schedule/settings"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Settings className="h-4 w-4" />
          Manage Availability
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/schedule"
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
            href={`/admin/schedule?status=${encodeURIComponent(s)}`}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              status === s
                ? "bg-navy text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {s} ({statusCountMap.get(s === "No Show" ? "No_Show" : s) || 0})
          </Link>
        ))}
      </div>

      {/* Search */}
      <Card className="mb-6">
        <form className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by name, email, or company..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-lg bg-navy px-6 py-2 text-sm font-medium text-white hover:bg-navy-600"
          >
            Search
          </button>
        </form>
      </Card>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <Card className="py-12 text-center">
          <CalendarDays className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No bookings found
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {search || status !== "all"
              ? "Try adjusting your filters"
              : "Meeting bookings will appear here when visitors schedule meetings"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="transition-shadow hover:shadow-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {booking.visitor_name}
                    </span>
                    <Badge variant={getStatusVariant(booking.status || "Confirmed")}>
                      {(booking.status || "Confirmed").replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatBookingDate(booking.booking_date)}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-navy dark:text-gold">
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {booking.visitor_email}
                    </span>
                    {booking.visitor_phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {booking.visitor_phone}
                      </span>
                    )}
                    {booking.visitor_company && (
                      <span className="flex items-center gap-1">
                        <Building className="h-3.5 w-3.5" />
                        {booking.visitor_company}
                      </span>
                    )}
                  </div>

                  {booking.purpose && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      {booking.purpose.length > 100
                        ? booking.purpose.substring(0, 100) + "..."
                        : booking.purpose}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <a
                    href={`mailto:${booking.visitor_email}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                  <Link
                    href={`/admin/schedule/${booking.id}`}
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
              href={`/admin/schedule?page=${page - 1}${status !== "all" ? `&status=${encodeURIComponent(status)}` : ""}${search ? `&search=${search}` : ""}`}
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
              href={`/admin/schedule?page=${page + 1}${status !== "all" ? `&status=${encodeURIComponent(status)}` : ""}${search ? `&search=${search}` : ""}`}
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
