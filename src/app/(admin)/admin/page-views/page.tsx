import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/ui";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { Eye, TrendingUp, Calendar, Globe } from "lucide-react";

export const metadata = { title: "Page Views" };

export default async function PageViewsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  // Get total page views
  const totalViews = await prisma.admin_page_views.count();

  // Get views grouped by page name
  const viewsByPage = await prisma.admin_page_views.groupBy({
    by: ["page_name"],
    _count: { page_name: true },
    orderBy: { _count: { page_name: "desc" } },
    take: 20,
  });

  // Get recent page views
  const recentViews = await prisma.admin_page_views.findMany({
    orderBy: { timestamp: "desc" },
    take: 20,
    select: {
      id: true,
      page_name: true,
      username: true,
      ip_address: true,
      timestamp: true,
    },
  });

  // Get views from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentViewsCount = await prisma.admin_page_views.count({
    where: {
      timestamp: { gte: sevenDaysAgo },
    },
  });

  // Get unique visitors (by IP)
  const uniqueIPs = await prisma.admin_page_views.groupBy({
    by: ["ip_address"],
  });

  function formatDate(date: Date | null) {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <>
      <PageHeader
        title="Page Views Analytics"
        description="Track visitor activity on your website"
      />

      {/* Stats Overview */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-white">
              <Eye className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalViews.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last 7 Days</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {recentViewsCount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold text-white">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {uniqueIPs.length.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pages Tracked</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {viewsByPage.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-400" />
                Top Pages
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewsByPage.length > 0 ? (
              <div className="space-y-3">
                {viewsByPage.map((page, index) => (
                  <div
                    key={page.page_name || index}
                    className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs font-medium text-white">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {page.page_name || "Unknown"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {page._count.page_name.toLocaleString()} views
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">
                No page view data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Views */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-gray-400" />
                Recent Views
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentViews.length > 0 ? (
              <div className="space-y-3">
                {recentViews.map((view) => (
                  <div
                    key={view.id}
                    className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0 dark:border-gray-800"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {view.page_name || "Unknown page"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {view.username || "Anonymous"} &bull; {view.ip_address || "N/A"}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(view.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">
                No recent page views
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Note */}
      <Card className="mt-6">
        <CardContent>
          <div className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
            <Eye className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <p>
              Page view tracking is recorded when users visit admin pages. Public website page views 
              require additional tracking configuration. Contact your administrator to enable 
              comprehensive analytics.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
