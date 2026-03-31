import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader, Badge } from "@/components/ui";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { Mail, Phone, Building, Calendar, ArrowLeft, Clock, Globe, MessageSquare } from "lucide-react";
import BookingStatusSelect from "./BookingStatusSelect";

interface BookingDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: BookingDetailPageProps) {
  const booking = await prisma.meeting_bookings.findUnique({
    where: { id: parseInt(params.id) },
  });
  return { title: booking ? `Booking - ${booking.visitor_name}` : "Booking Not Found" };
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const booking = await prisma.meeting_bookings.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!booking) notFound();

  function formatDate(date: Date | null) {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
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

  function formatDateTime(date: Date | null) {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusVariant(s: string) {
    switch (s) {
      case "Confirmed": return "info";
      case "Completed": return "success";
      case "Cancelled": return "default";
      case "No_Show": return "warning";
      default: return "default";
    }
  }

  return (
    <>
      <div className="mb-6">
        <Link
          href="/admin/schedule"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy dark:text-gray-400 dark:hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bookings
        </Link>
      </div>

      <PageHeader
        title={`Meeting with ${booking.visitor_name}`}
        description={`Booked on ${formatDateTime(booking.created_at)}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Meeting Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  Meeting Details
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">{formatDate(booking.booking_date)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Time (UAE)</dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">
                    {formatTime(booking.start_time)} - {formatTime(booking.end_time)} GST
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">30 minutes</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Visitor Timezone</dt>
                  <dd className="mt-1 flex items-center gap-1 text-gray-900 dark:text-white">
                    <Globe className="h-4 w-4 text-gray-400" />
                    {booking.visitor_timezone.replace(/_/g, " ")}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Purpose */}
          {booking.purpose && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                    Meeting Purpose
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {booking.purpose}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Cancellation Details */}
          {booking.status === "Cancelled" && (
            <Card>
              <CardHeader>
                <CardTitle>Cancellation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {booking.cancelled_at && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Cancelled At</dt>
                      <dd className="mt-1 text-gray-900 dark:text-white">{formatDateTime(booking.cancelled_at)}</dd>
                    </div>
                  )}
                  {booking.cancellation_reason && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Reason</dt>
                      <dd className="mt-1 text-gray-900 dark:text-white">{booking.cancellation_reason}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          {booking.admin_notes && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {booking.admin_notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingStatusSelect
                bookingId={booking.id}
                currentStatus={booking.status || "Confirmed"}
              />
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Visitor Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">{booking.visitor_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${booking.visitor_email}`}
                      className="flex items-center gap-2 text-navy hover:text-gold dark:text-navy-300"
                    >
                      <Mail className="h-4 w-4" />
                      {booking.visitor_email}
                    </a>
                  </dd>
                </div>
                {booking.visitor_phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                    <dd className="mt-1">
                      <a
                        href={`tel:${booking.visitor_phone}`}
                        className="flex items-center gap-2 text-navy hover:text-gold dark:text-navy-300"
                      >
                        <Phone className="h-4 w-4" />
                        {booking.visitor_phone}
                      </a>
                    </dd>
                  </div>
                )}
                {booking.visitor_company && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</dt>
                    <dd className="mt-1 flex items-center gap-2 text-gray-900 dark:text-white">
                      <Building className="h-4 w-4 text-gray-400" />
                      {booking.visitor_company}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a
                  href={`mailto:${booking.visitor_email}?subject=Regarding your meeting with BSG`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-600"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </a>
                {booking.visitor_phone && (
                  <a
                    href={`tel:${booking.visitor_phone}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Meta Info */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                  <dd className="mt-1">
                    <Badge variant={getStatusVariant(booking.status || "Confirmed")}>
                      {(booking.status || "Confirmed").replace("_", " ")}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Booked</dt>
                  <dd className="mt-1 flex items-center gap-2 text-gray-900 dark:text-white">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {formatDateTime(booking.created_at)}
                  </dd>
                </div>
                {booking.updated_at && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-500">{formatDateTime(booking.updated_at)}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
