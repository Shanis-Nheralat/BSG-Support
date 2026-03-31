import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader, Badge } from "@/components/ui";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import {
  FileText,
  Users,
  Eye,
  MessageSquare,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

async function getDashboardStats() {
  const [
    totalPosts,
    publishedPosts,
    totalCandidates,
    newCandidates,
    totalPageViews,
    totalInquiries,
    newInquiries,
    recentActivity,
    recentInquiries,
  ] = await Promise.all([
    prisma.blog_posts.count(),
    prisma.blog_posts.count({ where: { status: "published" } }),
    prisma.candidates.count(),
    prisma.candidates.count({ where: { status: "New" } }),
    prisma.admin_page_views.count(),
    prisma.inquiries.count(),
    prisma.inquiries.count({ where: { status: "New" } }),
    prisma.admin_activity_log.findMany({
      orderBy: { timestamp: "desc" },
      take: 5,
    }),
    prisma.inquiries.findMany({
      orderBy: { submitted_at: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        form_type: true,
        status: true,
        submitted_at: true,
      },
    }),
  ]);

  return {
    totalPosts,
    publishedPosts,
    totalCandidates,
    newCandidates,
    totalPageViews,
    totalInquiries,
    newInquiries,
    recentActivity,
    recentInquiries,
  };
}

function formatDate(date: Date | null) {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "New":
      return "info";
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
  switch (formType) {
    case "general_inquiry":
      return "General";
    case "meeting_request":
      return "Meeting";
    case "service_intake":
      return "Intake";
    default:
      return formType;
  }
}

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "Blog Posts",
      value: stats.totalPosts,
      subtext: `${stats.publishedPosts} published`,
      icon: FileText,
      color: "bg-navy-600",
      href: "/admin/blog",
    },
    {
      label: "Candidates",
      value: stats.totalCandidates,
      subtext: `${stats.newCandidates} new`,
      icon: Users,
      color: "bg-gold-600",
      href: "/admin/candidates",
    },
    {
      label: "Page Views",
      value: stats.totalPageViews,
      subtext: "All time",
      icon: Eye,
      color: "bg-green-600",
      href: "/admin/page-views",
    },
    {
      label: "Inquiries",
      value: stats.totalInquiries,
      subtext: `${stats.newInquiries} pending`,
      icon: MessageSquare,
      color: "bg-blue-600",
      href: "/admin/inquiries",
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${session.user.name ?? "Admin"}`}
      />

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="block">
            <Card className="transition-shadow hover:shadow-md">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color} text-white`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {stat.subtext}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Two Column Section */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                Recent Activity
              </div>
            </CardTitle>
          </CardHeader>
          {stats.recentActivity.length > 0 ? (
            <ul className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0 dark:border-gray-800"
                >
                  <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action || activity.action_type}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {activity.username || "System"} &bull;{" "}
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-center text-sm text-gray-500">
              No recent activity
            </p>
          )}
        </Card>

        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                Recent Inquiries
              </div>
            </CardTitle>
          </CardHeader>
          {stats.recentInquiries.length > 0 ? (
            <ul className="space-y-3">
              {stats.recentInquiries.map((inquiry) => (
                <li
                  key={inquiry.id}
                  className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 last:border-0 dark:border-gray-800"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {inquiry.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {inquiry.email}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {getFormTypeLabel(inquiry.form_type)} &bull;{" "}
                      {formatDate(inquiry.submitted_at)}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(inquiry.status)} size="sm">
                    {inquiry.status}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-center text-sm text-gray-500">
              No inquiries yet
            </p>
          )}
        </Card>
      </div>
    </>
  );
}
